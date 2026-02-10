# =====================================================
# FAD-AI - Multi-Stage Next.js Dockerfile
# =====================================================
# Architecture: Multi-stage build for optimal image size
# Stages:
#   1. base       - Base Node.js image with dependencies
#   2. deps       - Install production dependencies only
#   3. builder    - Build the Next.js application
#   4. runner     - Production runtime (minimal)
#   5. development- Development runtime (hot reload)
# =====================================================

# =====================================================
# Stage 1: Base
# =====================================================
FROM node:20-alpine AS base

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat

WORKDIR /app

# =====================================================
# Stage 2: Dependencies
# =====================================================
FROM base AS deps

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && \
    cp -R node_modules /tmp/node_modules_prod && \
    npm ci

# =====================================================
# Stage 3: Builder
# =====================================================
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
# Output: Optimized production build
RUN npm run build

# =====================================================
# Stage 4: Runner (Production)
# =====================================================
FROM base AS runner

WORKDIR /app

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]

# =====================================================
# Stage 5: Development
# =====================================================
FROM base AS development

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy application code
COPY . .

# Set environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Development server with hot reload
CMD ["npm", "run", "dev"]

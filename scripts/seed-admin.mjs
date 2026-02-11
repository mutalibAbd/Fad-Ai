/**
 * Creates the default admin user via Supabase Auth Admin API.
 * Run after `supabase db reset` to seed the admin account.
 * Retries automatically while containers are restarting.
 */
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const API_URL = 'http://127.0.0.1:54321';
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${API_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          apikey: SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'fadai@gmail.com',
          password: '!FadaiArzu2005!',
          email_confirm: true,
          app_metadata: { role: 'admin' },
        }),
      });

      if (res.ok) {
        console.log('Admin user created: fadai@gmail.com');
        return;
      }

      // 422 = user already exists — that's fine
      if (res.status === 422) {
        console.log('Admin user already exists.');
        return;
      }

      // 502/503 = container still starting, retry
      if (res.status >= 500) {
        console.log(`Attempt ${attempt}/${MAX_RETRIES}: server not ready (${res.status}), retrying...`);
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      const err = await res.text();
      console.error(`Failed to create admin user (${res.status}):`, err);
      process.exit(1);
    } catch (e) {
      console.log(`Attempt ${attempt}/${MAX_RETRIES}: connection failed, retrying...`);
      await sleep(RETRY_DELAY_MS);
    }
  }

  console.error('Failed to create admin user after all retries.');
  process.exit(1);
}

main();

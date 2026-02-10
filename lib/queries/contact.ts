import type { ContactFormData } from '@/lib/types'

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const result = await response.json()
      return { success: false, error: result.error || 'Xəta baş verdi' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Şəbəkə xətası baş verdi' }
  }
}

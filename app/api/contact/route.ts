import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

type ContactInsert = Database['public']['Tables']['contact_submissions']['Insert'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, message, phone, subject } = body;

    // Validate required fields
    if (!full_name || !email || !message) {
      return NextResponse.json(
        { error: 'Ad, e-poçt və mesaj sahələri vacibdir.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Düzgün e-poçt ünvanı daxil edin.' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (full_name.length > 200 || email.length > 200 || (message && message.length > 5000)) {
      return NextResponse.json(
        { error: 'Sahə uzunluğu limitini aşır.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const insertData: ContactInsert = {
      full_name: full_name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || null,
      message: message.trim(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('contact_submissions') as any).insert(insertData);

    if (error) {
      console.error('Error inserting contact submission:', error);
      return NextResponse.json(
        { error: 'Mesaj göndərilə bilmədi. Zəhmət olmasa yenidən cəhd edin.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Server xətası baş verdi.' },
      { status: 500 }
    );
  }
}

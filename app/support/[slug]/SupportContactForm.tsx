'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  message: string;
}

export default function SupportContactForm() {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (!formData.full_name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Zəhmət olmasa bütün vacib sahələri doldurun.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Düzgün e-poçt ünvanı daxil edin.');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          subject: 'Dəstək sorğusu',
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setStatus('error');
        setErrorMessage(result.error || 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
        return;
      }

      setStatus('success');
      setFormData({ full_name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMessage('Şəbəkə xətası baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-text-primary tracking-tight mb-2">
            Ad Soyad *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Adınız və soyadınız"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary tracking-tight mb-2">
            E-poçt *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="email@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text-primary tracking-tight mb-2">
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="+994 XX XXX XX XX"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-primary tracking-tight mb-2">
            Mesaj *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            placeholder="Dəstək sorğunuzu ətraflı yazın..."
          />
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 tracking-tight text-sm">
              Sorğunuz uğurla göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.
            </p>
          </div>
        )}

        {status === 'error' && errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 tracking-tight text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-primary text-white px-8 py-4 rounded-2xl font-medium tracking-tight hover:bg-primary-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {status === 'submitting' ? 'Göndərilir...' : 'Sorğunu Göndər'}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-10 pt-8 border-t border-slate-200">
        <p className="text-text-secondary tracking-tight text-sm text-center mb-4">
          Və ya birbaşa əlaqə səhifəmizə keçin
        </p>
        <Link
          href="/contact"
          className="block w-full text-center bg-slate-50 text-text-primary px-8 py-4 rounded-2xl font-medium tracking-tight border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
        >
          Əlaqə Səhifəsinə Keçin
        </Link>
      </div>
    </div>
  );
}

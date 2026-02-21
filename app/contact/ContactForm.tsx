'use client';

import { useState } from 'react';
import { submitContactForm } from '@/lib/queries/contact';
import type { ContactFormData } from '@/lib/types';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
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

    const result = await submitContactForm(formData);

    if (result.success) {
      setStatus('success');
      setFormData({ full_name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Xəta baş verdi');
    }
  };

  return (
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
          className="w-full px-4 py-3 rounded-xl border border-card-border bg-card text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
          className="w-full px-4 py-3 rounded-xl border border-card-border bg-card text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
          className="w-full px-4 py-3 rounded-xl border border-card-border bg-card text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="+994 XX XXX XX XX"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-text-primary tracking-tight mb-2">
          Mövzu
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-card-border bg-card text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="Müraciətin mövzusu"
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
          className="w-full px-4 py-3 rounded-xl border border-card-border bg-card text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          placeholder="Mesajınızı yazın..."
        />
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800 tracking-tight text-sm">
            Mesajınız uğurla göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.
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
        {status === 'submitting' ? 'Göndərilir...' : 'Göndər'}
      </button>
    </form>
  );
}

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageCircle, 
  Navigation,
  ShieldCheck
} from 'lucide-react';

export const ContactPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: 'General Inquiry / Order Information',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <MapPin size={13} />
          <span>Connect With Us</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Visit or Contact Aberdares Soaps
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Our customer service and dispatch desks are based at our manufacturing facility in Ruiru, Kimbo – Matangi Road.
        </p>
      </div>

      {/* 2-Column: Contact Details + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Contact Info & Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 pb-3 border-b border-stone-100">
              Factory & Office Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Physical Location</h4>
                  <p className="text-stone-600 mt-0.5">
                    Ruiru, Kimbo – Matangi Road<br />
                    Kiambu County, Kenya
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                    Off Thika Superhighway (Exit 12 Kimbo)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Phone & WhatsApp Support</h4>
                  <p className="text-stone-600 mt-0.5 font-mono">
                    <a href="tel:+254712792555" className="hover:text-emerald-700 font-bold">
                      +254 712 792 555
                    </a>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Calls & WhatsApp messages answered promptly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Inquiries</h4>
                  <p className="text-stone-600 mt-0.5">
                    <a href="mailto:info@aberdarecleaners.co.ke" className="hover:text-emerald-700 font-bold">
                      info@aberdarecleaners.co.ke
                    </a>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Official quotation & tender correspondence
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Operating Hours</h4>
                  <p className="text-stone-600 mt-0.5">
                    Monday – Friday: 8:00 AM – 6:00 PM<br />
                    Saturday: 8:30 AM – 4:00 PM<br />
                    Sunday & Public Holidays: Closed for Plant Maintenance
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Button */}
            <div className="pt-2">
              <a
                href="https://wa.me/254712792555?text=Hello%20Aberdares%20Soaps%2C%20I%20am%20reaching%20out%20via%20your%20website%20contact%20page."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-colors"
              >
                <MessageCircle size={16} />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Message Sent Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <strong>{form.fullName}</strong>. A customer representative from our Ruiru office will reply to your inquiry within 2 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ fullName: '', phone: '', email: '', subject: 'General Inquiry / Order Information', message: '' });
                }}
                className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 pb-2 border-b border-stone-100">
                Send Us a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="e.g. Samuel Kariuki"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="07XX XXX XXX"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@email.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inquiry Subject *
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="General Inquiry / Order Information">General Inquiry / Order Information</option>
                    <option value="Wholesale / Supermarket Supply">Wholesale / Supermarket Supply</option>
                    <option value="Hotel & Safari Lodge Amenities">Hotel & Safari Lodge Amenities</option>
                    <option value="Bio-Digester & Sanitation Solution">Bio-Digester & Sanitation Solution</option>
                    <option value="Farmer & Grower Partnership">Farmer & Grower Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Message or Product Requirements *
                </label>
                <textarea
                  rows="4"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what product lines, quantities, or questions you have..."
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 bg-aberdares-forest hover:bg-aberdares-dark text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* EMBEDDED MAP FOR RUIRU, KIMBO – MATANGI ROAD */}
      <section className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Find Our Manufacturing Facility
            </h3>
            <p className="text-xs text-stone-500">
              Ruiru, Kimbo – Matangi Road, Kiambu County (Accessible via Thika Superhighway Exit 12)
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Ruiru+Kimbo+Matangi+Road+Kenya"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-aberdares-forest rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Navigation size={13} />
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Embedded Map Representation */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
          <iframe
            title="Aberdares Soaps Location Map - Ruiru, Kimbo Matangi Road"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src="https://maps.google.com/maps?q=Kimbo%20Matangi%20Road,%20Ruiru,%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full filter saturate-125"
          />
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-stone-200 text-xs text-slate-900 hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">Aberdares Soaps Plant & Factory Store</span>
          </div>
        </div>
      </section>

    </div>
  );
};

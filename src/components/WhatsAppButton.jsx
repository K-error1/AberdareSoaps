import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const phoneNumber = "254712792555";
  const defaultMessage = encodeURIComponent(
    "Hello Aberdares Soaps! I'm browsing your website and would like to inquire about your cleaning & personal care products."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Interactive Tooltip Card */}
      {tooltipOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 animate-bounce-short relative text-slate-800">
          <button 
            onClick={() => setTooltipOpen(false)}
            className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-700"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider">
              Aberdares Soaps Live Desk
            </span>
          </div>
          <p className="text-xs text-stone-600 mb-3">
            Habari! Need quick delivery in Nairobi/Kiambu, custom hospitality sizes, or bulk wholesale prices? Chat with our team now.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
          >
            <MessageCircle size={14} /> Open WhatsApp (+254 712 792 555)
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center gap-2">
        {!tooltipOpen && (
          <button
            onClick={() => setTooltipOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:text-emerald-700 transition-all hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Chat with us on WhatsApp</span>
          </button>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Aberdares Soaps on WhatsApp"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all group"
        >
          <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        </a>
      </div>
    </div>
  );
};

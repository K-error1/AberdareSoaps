import React from 'react';
import { 
  Building2, 
  Award, 
  Truck, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Percent, 
  Layers, 
  FileText, 
  Sparkles,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { hospitalityPackages, wholesaleTiers } from '../data/wholesaleTiers';
import { useCart } from '../context/CartContext';

export const WholesalePage = () => {
  const { setIsWholesaleModalOpen } = useCart();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-stone-900 via-amber-950/90 to-stone-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Award size={13} />
            <span>Commercial & Institutional Portal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Wholesale, Supermarket & Hospitality Supply
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Factory-direct pricing, custom hotel branding, and guaranteed 48-hour delivery across Kenya. Partner with an authentically Kenyan eco-manufacturer.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsWholesaleModalOpen(true)}
              className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <FileText size={15} />
              <span>Request Custom B2B Quotation</span>
            </button>
            <a
              href="https://wa.me/254712792555?text=Hello%20Aberdares%20Soaps%2C%20I%20am%20inquiring%20about%20wholesale%20distribution%20and%20hospitality%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <MessageCircle size={15} />
              <span>Direct WhatsApp Desk (+254 712 792 555)</span>
            </a>
          </div>
        </div>
      </section>

      {/* HOSPITALITY PACKAGES (HOTELS, SAFARI LODGES & AIRBNBS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Hotel & Tourism Sector
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Curated Hospitality Supply Packages
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Delight your guests with authentic Aberdare mountain botanical amenities in eco-friendly paper packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hospitalityPackages.map((pack) => (
            <div
              key={pack.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider">
                    {pack.badge}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">B2B Pack</span>
                </div>

                <h3 className="text-lg font-black text-slate-900">
                  {pack.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                  Target: {pack.target}
                </p>

                <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                  {pack.description}
                </p>

                {/* Package contents list */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                    What's Included in This Carton Pack:
                  </span>
                  {pack.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                      <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Starting Package Price</span>
                    <span className="text-xl font-black text-slate-900">
                      KSh {pack.starterPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    {pack.savings}
                  </span>
                </div>

                <button
                  onClick={() => setIsWholesaleModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-aberdares-forest text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Order This Hospitality Pack</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIERED VOLUME PRICING TABLE (10-49, 50-199, 200+) */}
      <section className="bg-stone-100/90 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/60 text-amber-950 text-xs font-bold uppercase tracking-wider">
              <Percent size={13} />
              <span>Volume Discount Model</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Wholesale & Institutional Tier Structure
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Transparent discount schedules for supermarkets, regional distributors, and contract cleaning operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wholesaleTiers.map((tier, idx) => (
              <div 
                key={tier.tier}
                className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
                  idx === 1 
                    ? 'bg-white border-amber-500 shadow-xl ring-2 ring-amber-500/20' 
                    : 'bg-white border-stone-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-stone-400 uppercase">
                      Tier 0{idx + 1}
                    </span>
                    {idx === 1 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                        Most Selected
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{tier.tier}</h3>
                  <div className="text-2xl font-black text-amber-700 mt-2">
                    {tier.volume}
                  </div>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">
                    {tier.discountPercent}
                  </p>

                  <div className="mt-5 space-y-2.5 text-xs text-stone-600 pt-4 border-t border-stone-100">
                    <div>
                      <strong className="text-slate-800 block mb-0.5">Dispatch & Lead Time:</strong>
                      <span>{tier.leadTime}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800 block mb-0.5">Payment Terms:</strong>
                      <span>{tier.paymentTerms}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800 block mb-0.5">Delivery Terms:</strong>
                      <span>{tier.deliveryCost}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-100">
                  <button
                    onClick={() => setIsWholesaleModalOpen(true)}
                    className="w-full py-2.5 px-4 bg-stone-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Select {tier.tier.split(':')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTRACT MANUFACTURING & PRIVATE LABEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-aberdares-dark to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">
                Custom Stamping & Private Labeling
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Want Your Hotel or Supermarket Brand on Our Soap?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                We provide custom mould stamping, embossed logos on 15g to 250g bars, pleat wrapping with your resort branding, and custom fragrance formulation using high-altitude botanical extracts.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-200">
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-400" /> Minimum 5,000 units</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-400" /> Custom Eco-Parchment wrap</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-400" /> KEBS Standard Batch Certificate</span>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => setIsWholesaleModalOpen(true)}
                className="w-full py-3.5 px-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg transition-colors text-center"
              >
                Inquire Private Label
              </button>
              <a
                href="tel:+254712792555"
                className="w-full py-3.5 px-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors text-center flex items-center justify-center gap-2"
              >
                <Phone size={14} />
                <span>Call Procurement Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

import React from 'react';
import { 
  MapPin, 
  Leaf, 
  Award, 
  ShieldCheck, 
  Lightbulb, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Factory,
  Target,
  Eye,
  HeartHandshake
} from 'lucide-react';
import { coreValues } from '../data/wholesaleTiers';

export const AboutPage = ({ setActivePage }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Hero Header */}
      <section className="bg-gradient-to-b from-aberdares-forest via-emerald-950 to-stone-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles size={13} />
            <span>About Us</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Nature Meets Innovation
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Crafting Kenya's finest cleaning and personal-care products, rooted in the purity of the Aberdare ranges and precision modern science.
          </p>
        </div>
      </section>

      {/* 2. Company Overview & History */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* User Provided Company Overview Banner */}
            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
                  Company Overview
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                Aberdares Soaps is a proudly Kenyan brand located in Ruiru, Kimbo – Matangi Road, specializing in high‑quality cleaning and personal‑care products. Inspired by the purity and vitality of the Aberdare ranges, we blend nature’s finest ingredients with modern formulations to deliver products that are effective, safe, and environmentally responsible.
              </p>
            </div>

            {/* 🌱 Our Natural Edge */}
            <div className="bg-gradient-to-br from-emerald-50/70 via-stone-50 to-amber-50/40 border border-emerald-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>🌱</span>
                  <span>Our Natural Edge</span>
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full uppercase tracking-wider">
                  <Leaf size={12} />
                  <span>Aberdares Sourced</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                We source key natural ingredients such as aloe vera and hibiscus directly from the Aberdares region, ensuring purity, sustainability, and support for local growers. This connection to nature defines our brand — clean, fresh, and authentically Kenyan.
              </p>

              {/* Pillars emphasized directly from the text */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-white/90 rounded-xl border border-emerald-100/90 shadow-2xs">
                  <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Purity</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">Direct from Aberdares</p>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-emerald-100/90 shadow-2xs">
                  <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Sustainability</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">Eco-friendly practices</p>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-emerald-100/90 shadow-2xs">
                  <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Support for Growers</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">Local farming impact</p>
                </div>
              </div>

              {/* Brand Definition Badges */}
              <div className="flex items-center gap-2 pt-2 border-t border-emerald-100/80 text-xs text-stone-600 flex-wrap">
                <span className="font-semibold text-emerald-950">Brand Definition:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-200/80 text-emerald-900 font-bold text-[11px] shadow-2xs">Clean</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-200/80 text-emerald-900 font-bold text-[11px] shadow-2xs">Fresh</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-200/80 text-emerald-900 font-bold text-[11px] shadow-2xs">Authentically Kenyan</span>
              </div>
            </div>

            {/* Quick Fact Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-stone-100 px-3.5 py-2 rounded-xl">
                <MapPin size={15} className="text-emerald-700" />
                <span>Ruiru, Kimbo – Matangi Road</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-stone-100 px-3.5 py-2 rounded-xl">
                <ShieldCheck size={15} className="text-emerald-700" />
                <span>KEBS Certified Formulations</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-stone-100 px-3.5 py-2 rounded-xl">
                <Leaf size={15} className="text-emerald-700" />
                <span>100% Kenyan Botanical Extracts</span>
              </div>
            </div>

          </div>

          {/* Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
                  alt="Highland Botanical Harvesting"
                  className="rounded-2xl shadow-md object-cover aspect-4/5 w-full"
                />
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-center">
                  <div className="text-xl font-black text-emerald-900">100%</div>
                  <div className="text-[11px] text-stone-500 font-medium">Kenyan Owned & Operated</div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 bg-emerald-900 text-white rounded-2xl text-center">
                  <div className="text-xl font-black text-emerald-300">KEBS</div>
                  <div className="text-[11px] text-emerald-100 font-medium">Standard Tested & Approved</div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
                  alt="Ruiru Saponification Facility"
                  className="rounded-2xl shadow-md object-cover aspect-4/5 w-full"
                />
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* 4. Manufacturing Facility & Location: Ruiru, Kimbo – Matangi Road */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-aberdares-dark via-emerald-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <MapPin size={13} />
                <span>Factory Location</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Manufacturing Hub: Ruiru, Kimbo – Matangi Road
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Strategically situated along the vibrant industrial corridor of Ruiru Kimbo on Matangi Road, our modern plant combines high-capacity production with eco-responsible practices.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2 text-xs text-stone-200">
                  <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Triple-milling soap plodders for dense, long-lasting lather</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-200">
                  <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Closed-loop industrial water filtration and recycling</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-200">
                  <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Solar-assisted curing tunnels reducing carbon footprint</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-200">
                  <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Same-day wholesale dispatch for Nairobi & Kiambu counties</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 space-y-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <Factory size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Factory Dispatch</h4>
                  <p className="text-xs text-stone-300">Ruiru, Kimbo – Matangi Road, Kiambu County</p>
                </div>
              </div>

              <div className="text-xs text-stone-300 space-y-1.5 border-t border-white/10 pt-3">
                <p>• <strong>Factory Pickups:</strong> Mon – Sat, 8:00 AM – 5:30 PM</p>
                <p>• <strong>Direct Hotline:</strong> +254 712 792 555</p>
                <p>• <strong>Visits & B2B Audits:</strong> By prior appointment</p>
              </div>

              <button
                onClick={() => {
                  setActivePage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-4 bg-white text-aberdares-dark rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors shadow-sm text-center"
              >
                Get Directions or Visit Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Target size={26} />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
              Purpose & Focus
            </div>
            <h3 className="text-xl font-black text-slate-900">Our Mission</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              To formulate and manufacture accessible, high-performance cleaning and personal care solutions that honor African botanical heritage, protect our environment, and elevate the daily health and dignity of Kenyan communities.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Eye size={26} />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
              Future Direction
            </div>
            <h3 className="text-xl font-black text-slate-900">Our Vision</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              To become East Africa's most respected and sustainable home & personal care brand—proving that world-class industrial excellence and authentic indigenous regenerative botanicals can thrive hand-in-hand.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>Guiding Principles</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Our Core Values
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Every product batch formulated in Ruiru reflects five non-negotiable commitments to our customers, community, and country.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val) => (
            <div
              key={val.title}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    {val.title === 'Quality' && <Award size={22} />}
                    {val.title === 'Integrity' && <ShieldCheck size={22} />}
                    {val.title === 'Innovation' && <Lightbulb size={22} />}
                    {val.title === 'Sustainability' && <Leaf size={22} />}
                    {val.title === 'Community' && <Users size={22} />}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">
                    Value Pillar
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  {val.title}
                </h3>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
                  {val.subtitle}
                </p>

                {val.kikuyuProverb && (
                  <div className="my-2.5 p-2 bg-stone-50 rounded-xl border border-stone-100 text-[11px] text-stone-600 italic">
                    "{val.kikuyuProverb}"
                  </div>
                )}

                <p className="text-xs text-stone-600 leading-relaxed mt-2">
                  {val.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 size={13} />
                <span>Verified in Daily Practice</span>
              </div>
            </div>
          ))}

          {/* Environmental Responsibility Callout */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center mb-3">
                <Leaf size={22} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Environmentally Responsible</h3>
              <p className="text-xs text-emerald-200 uppercase font-semibold mt-0.5">Green Saponification</p>
              <p className="text-xs text-emerald-100/90 leading-relaxed mt-3">
                From biodegradable soap bases to zero hazardous effluent into local waterways, our green chemistry guarantees cleanliness that preserves Kenya's natural ecosystems.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>Eco-Responsible Formulations</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

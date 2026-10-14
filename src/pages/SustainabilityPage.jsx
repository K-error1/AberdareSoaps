import React from 'react';
import { 
  Leaf, 
  Droplets, 
  Sun, 
  Users, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight,
  Recycle,
  Sparkles
} from 'lucide-react';

export const SustainabilityPage = ({ setActivePage }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-950 via-aberdares-forest to-stone-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Leaf size={13} />
            <span>Protecting Kenya's Natural Heritage</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Sustainability & Community Stewardship
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Clean homes should never come at the expense of poisoned rivers or degraded soil. How our Ruiru facility operates on circular green principles.
          </p>
        </div>
      </section>

      {/* 4 Pillars of Eco-Manufacturing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Our Environmental Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Clean Products, Conscious Footprint
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Droplets size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">100% Greywater Safe</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Formulated without toxic nonylphenols or excess phosphates. Rinse water from our soaps and detergents can be safely directed onto Kenyan kitchen gardens and fruit trees.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Recycle size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Zero Factory Effluent</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our Ruiru plant employs a closed-loop multi-stage filtration system that cleans and recirculates process wash water, releasing zero untreated wastewater into Kiambu waterways.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sun size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Solar-Curing Tunnels</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our bar soap curing tunnels utilize passive solar thermal ventilation, cutting heavy industrial boiler energy consumption by over 60% compared to conventional soap plants.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Fair Farm Contracts</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Direct off-take contracts with smallholder aloe vera and hibiscus growers across Nyeri, Murang’a and Kiambu counties, eliminating exploitation by predatory middlemen.
            </p>
          </div>
        </div>
      </section>

      {/* Community Impact Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <HeartHandshake size={14} />
                <span>Community Action</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                The Aberdares Green Schools & Reforestation Initiative
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                For every 100 cartons of Aberdares Soaps purchased by Kenyan households, hotels, and schools, we donate 5 indigenous highland tree seedlings (Cedar, Bamboo, Prunus Africana) planted along threatened riparian zones in the Aberdares water catchment basin.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <span className="text-lg font-black text-emerald-700 block">14,800+</span>
                  <span className="text-stone-500">Trees planted since 2024</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <span className="text-lg font-black text-emerald-700 block">82 Farmers</span>
                  <span className="text-stone-500">Supported with fair-wage contracts</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                alt="Kenyan Tree Planting"
                className="rounded-3xl shadow-lg aspect-4/3 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packaging Circularity & Refill Initiative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-aberdares-dark to-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-emerald-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Packaging Circularity
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Ruiru Factory Bulk Jerrycan Refill Program
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Return your empty 5-Litre or 20-Litre jerrycans to our Ruiru factory desk (Kimbo – Matangi Road) for sanitation and refill, receiving a <strong>KSh 150 discount</strong> on your next purchase.
              </p>
            </div>
            <button
              onClick={() => {
                setActivePage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Visit Our Ruiru Factory</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Leaf, 
  ShieldCheck, 
  Heart
} from 'lucide-react';
import { categories } from '../data/products';

export const Footer = ({ setActivePage, onCategorySelect }) => {

  const handlePageClick = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCatClick = (catId) => {
    setActivePage('products');
    if (onCategorySelect) onCategorySelect(catId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-aberdares-dark text-stone-300 pt-16 pb-8 border-t-4 border-aberdares-forest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* 4-Column Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Column 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 64 64" fill="none">
                  <path d="M12 44L26 22L36 34L42 26L52 44H12Z" fill="#74c69d" opacity="0.6"/>
                  <path d="M22 44L34 26L46 44H22Z" fill="#ffffff" />
                  <path d="M34 22C34 22 44 28 44 38C44 42 41 45 36 45C30 45 28 40 28 40C28 40 30 32 34 22Z" fill="#f07167" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">ABERDARES SOAPS</span>
                <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Nature Meets Innovation</p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed pr-4">
              Proudly Kenyan manufacturer blending high-altitude botanicals (Aloe Vera & Hibiscus from the Aberdare ranges) with modern clean-chemistry formulations. Manufacturing plant based in Ruiru, Kimbo – Matangi Road.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-stone-300">
                <MapPin size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Ruiru, Kimbo – Matangi Road, Kiambu County, Kenya</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-300">
                <Phone size={15} className="text-emerald-400 flex-shrink-0" />
                <a href="tel:+254712792555" className="hover:text-white transition-colors">+254 712 792 555</a>
              </div>
              <div className="flex items-center gap-2.5 text-stone-300">
                <Mail size={15} className="text-emerald-400 flex-shrink-0" />
                <a href="mailto:info@aberdarecleaners.co.ke" className="hover:text-white transition-colors">info@aberdarecleaners.co.ke</a>
              </div>
            </div>
          </div>

          {/* Column 2: Product Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-emerald-400">
              Product Lines
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.filter(c => c.id !== 'all').map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCatClick(cat.id)}
                    className="text-stone-400 hover:text-emerald-300 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links & Wholesale */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-emerald-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handlePageClick('home')} className="text-stone-400 hover:text-white">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('about')} className="text-stone-400 hover:text-white">
                  Our Story & Heritage
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('wholesale')} className="text-stone-400 hover:text-white">
                  Hotel & Wholesale Supply
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('sustainability')} className="text-stone-400 hover:text-white">
                  CSR & Sustainability
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('gallery')} className="text-stone-400 hover:text-white">
                  Factory & Farm Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('blog')} className="text-stone-400 hover:text-white">
                  Hygiene & Eco Blog
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('contact')} className="text-stone-400 hover:text-white">
                  Contact & Map
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('track')} className="text-emerald-400 font-bold hover:text-white">
                  Track Your Order &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: CSR Highlights & Trust Marks */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-emerald-400">
              Our Commitments
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex gap-2.5 items-start">
                <Leaf size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-stone-400">
                  <strong className="text-stone-200">Ethical Sourcing:</strong> Direct contracts with smallholder aloe & hibiscus farmers along Aberdare ranges.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-stone-400">
                  <strong className="text-stone-200">KEBS Quality Standards:</strong> Every batch laboratory tested for active matter and skin-safe pH.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <Heart size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="text-stone-400">
                  <strong className="text-stone-200">Community Rooted:</strong> Youth & women employment programs across Kiambu & Nyeri.
                </span>
              </div>
            </div>

            {/* Payment & Certification Logos Strip */}
            <div className="pt-2 border-t border-stone-800">
              <p className="text-[11px] text-stone-500 mb-2 font-medium">Accepted Payments & Security:</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 rounded bg-stone-800 text-[11px] font-bold text-emerald-400 border border-stone-700">
                  Lipa na M-PESA
                </span>
                <span className="px-2 py-1 rounded bg-stone-800 text-[11px] font-semibold text-stone-300 border border-stone-700">
                  Visa / Mastercard
                </span>
                <span className="px-2 py-1 rounded bg-stone-800 text-[11px] font-semibold text-stone-300 border border-stone-700">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Aberdares Soaps. All rights reserved. Registered Kenyan Manufacturer.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Ruiru, Kimbo – Matangi Road</span>
            <span>•</span>
            <span>Customer Care: +254 712 792 555</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

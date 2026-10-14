import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Building2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Send, 
  MessageCircle, 
  Percent, 
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const WholesaleQuoteModal = () => {
  const { isWholesaleModalOpen, setIsWholesaleModalOpen } = useCart();

  const [form, setForm] = useState({
    businessName: 'Serena Mara Safari Lodge',
    contactPerson: 'David Mwangi',
    phone: '0722000111',
    email: 'procurement@serenamara.co.ke',
    businessType: 'hotel',
    estimatedCartons: '50-199',
    productsNeeded: ['15g / 25g Guest Soaps', '5L Room Mists', '5L / 20L Hand Wash'],
    deliveryLocation: 'Nairobi & Narok',
    specialNotes: 'Interested in custom paper wrapping for 25g Lisa Lux bars with our lodge logo.'
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isWholesaleModalOpen) return null;

  const productOptions = [
    '15g / 25g Guest Soaps (Hospitality)',
    '100g / 250g Batian Bar Soaps',
    '500g / 1kg Heavy Duty Laundry Bars',
    '5L / 20L Liquid Detergent',
    '5L / 20L Aloe Vera Hand Wash',
    '5L / 20L Max-Guard Sodium Hypochlorite Bleach',
    'Eco-Flow Bio-Digester Catalyst (Powder / Liquid)',
    '5L Highland Jasmine / Pine Room Mists',
    'Bulk Shampoos & Conditioners (Dispenser Refills)'
  ];

  const handleProductToggle = (prod) => {
    setForm(prev => ({
      ...prev,
      productsNeeded: prev.productsNeeded.includes(prod)
        ? prev.productsNeeded.filter(p => p !== prod)
        : [...prev.productsNeeded, prod]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppDispatch = () => {
    const text = encodeURIComponent(
      `Hello Aberdares Soaps B2B Desk!\n\n` +
      `Business: ${form.businessName}\n` +
      `Contact: ${form.contactPerson} (${form.phone})\n` +
      `Category: ${form.businessType.toUpperCase()}\n` +
      `Estimated Volume: ${form.estimatedCartons} cartons\n` +
      `Products: ${form.productsNeeded.join(', ')}\n` +
      `Delivery Location: ${form.deliveryLocation}\n` +
      `Notes: ${form.specialNotes}`
    );
    window.open(`https://wa.me/254712792555?text=${text}`, '_blank');
    setSubmitted(true);
  };

  const getDiscountEstimate = () => {
    if (form.estimatedCartons === '10-49') return '15% Tier 1 Discount';
    if (form.estimatedCartons === '50-199') return '25% Tier 2 Supermarket/Hotel Discount + FREE Delivery';
    return '35% Tier 3 Distributor Discount + Custom Branding Option';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Award size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">B2B & Wholesale Quotation Builder</h2>
              <p className="text-xs text-amber-200/80">
                Direct factory pricing for hotels, institutions, supermarkets & distributors
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsWholesaleModalOpen(false);
              setSubmitted(false);
            }}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Wholesale Request Received!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Our commercial procurement team in Ruiru has logged your quotation request for <strong>{form.businessName}</strong>. A dedicated wholesale manager will contact you within 2 business hours.
              </p>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs font-mono text-stone-700 max-w-md mx-auto text-left space-y-1">
                <p><strong>Quotation Ref:</strong> B2B-ABS-{Math.floor(1000 + Math.random() * 9000)}</p>
                <p><strong>Estimated Volume:</strong> {form.estimatedCartons} Cartons</p>
                <p><strong>Applicable Tier:</strong> {getDiscountEstimate()}</p>
                <p><strong>Hotline:</strong> +254 712 792 555</p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsWholesaleModalOpen(false);
                    setSubmitted(false);
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Tier Discount Banner */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center gap-3">
                <Percent size={20} className="text-amber-700 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-amber-950">Active Tier Estimate: </span>
                  <span className="text-amber-800 font-semibold">{getDiscountEstimate()}</span>
                </div>
              </div>

              {/* Business Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Mara Serena Lodge / Quickmart"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Sector *
                  </label>
                  <select
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="hotel">Hotel, Safari Lodge & Airbnb</option>
                    <option value="supermarket">Supermarket / Retail Chain</option>
                    <option value="institution">School, University or Hospital</option>
                    <option value="cleaning">Commercial Cleaning Contractor</option>
                    <option value="wholesaler">Regional Distributor / Wholesaler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. David Mwangi"
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
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="07XX XXX XXX"
                  />
                </div>
              </div>

              {/* Volume & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Monthly Order Volume *
                  </label>
                  <select
                    value={form.estimatedCartons}
                    onChange={(e) => setForm({ ...form, estimatedCartons: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-semibold"
                  >
                    <option value="10-49">10 – 49 Cartons (Tier 1: 15% Off)</option>
                    <option value="50-199">50 – 199 Cartons (Tier 2: 25% Off + Free Delivery)</option>
                    <option value="200+">200+ Cartons (Tier 3: 35% Off + Private Label)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination Town / County *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.deliveryLocation}
                    onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Nairobi, Nakuru, Mombasa"
                  />
                </div>
              </div>

              {/* Product Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Required Product Lines:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {productOptions.map((opt) => (
                    <label 
                      key={opt}
                      className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                        form.productsNeeded.includes(opt)
                          ? 'border-amber-600 bg-amber-50/60 font-semibold text-amber-950'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.productsNeeded.includes(opt)}
                        onChange={() => handleProductToggle(opt)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="truncate">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Specs or Branding (optional)
                </label>
                <textarea
                  rows="2"
                  value={form.specialNotes}
                  onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
                  placeholder="e.g. Need hotel logo pleat-wrapping on 25g soaps or 20L bulk dispenser pumps..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send size={15} />
                  <span>Submit Formal RFQ Quote</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppDispatch}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle size={15} />
                  <span>Send Direct to WhatsApp Desk</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Settings,
  Store,
  Truck,
  CreditCard,
  Award,
  Bell,
  CheckCircle2,
  Save,
  ShieldCheck,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export const SettingsPage = () => {
  const [toastMessage, setToastMessage] = useState('');

  const [storeSettings, setStoreSettings] = useState({
    businessName: 'Aberdares Soaps & Detergents Ltd',
    slogan: 'Nature Meets Innovation',
    facilityLocation: 'Ruiru, Kimbo – Matangi Road, Kiambu County, Kenya',
    officialPhone: '+254 712 792 555',
    supportEmail: 'orders@aberdares.co.ke',
    whatsappNumber: '+254712792555',
    hours: 'Mon – Sat: 7:30 AM – 6:00 PM'
  });

  const [deliverySettings, setDeliverySettings] = useState({
    nairobiExpressFee: 250,
    nationwideCourierFee: 450,
    freeDeliveryThreshold: 3000,
    factoryPickupAllowed: true
  });

  const [paymentSettings, setPaymentSettings] = useState({
    mpesaShortcode: '174379',
    mpesaEnv: 'sandbox', // 'sandbox' or 'production'
    paystackEnabled: true,
    codEnabled: true
  });

  const [loyaltySettings, setLoyaltySettings] = useState({
    earnRateKes: 50, // 1 point for every 50 KES
    pointValueKes: 1, // 1 point = 1 KES
    minimumRedeemPoints: 50
  });

  const [notifications, setNotifications] = useState({
    smsOrderConfirmation: true,
    smsDispatchAlert: true,
    emailOrderReceipt: true,
    adminNotificationOnNewOrder: true
  });

  const handleSave = (sectionName) => {
    setToastMessage(`✓ ${sectionName} saved successfully!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Store Operations & Configuration
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Manage manufacturing plant identity, delivery fees, payment gateways, and automated loyalty parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Plant & Contact Information */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Store size={18} className="text-emerald-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Manufacturing Facility & Contact
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Official Registered Name</label>
              <input
                type="text"
                value={storeSettings.businessName}
                onChange={(e) => setStoreSettings({ ...storeSettings, businessName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Facility Address</label>
              <input
                type="text"
                value={storeSettings.facilityLocation}
                onChange={(e) => setStoreSettings({ ...storeSettings, facilityLocation: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Dispatch Hotline</label>
                <input
                  type="text"
                  value={storeSettings.officialPhone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, officialPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">WhatsApp Orders #</label>
                <input
                  type="text"
                  value={storeSettings.whatsappNumber}
                  onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Support Email</label>
              <input
                type="email"
                value={storeSettings.supportEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex justify-end">
            <button
              onClick={() => handleSave('Plant Details')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <Save size={14} />
              <span>Save Contact Info</span>
            </button>
          </div>
        </div>

        {/* Delivery Rates & Free Threshold */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Truck size={18} className="text-teal-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Logistics & Delivery Pricing (KES)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nairobi & Kiambu Doorstep Express (KSh)</label>
              <input
                type="number"
                value={deliverySettings.nairobiExpressFee}
                onChange={(e) => setDeliverySettings({ ...deliverySettings, nairobiExpressFee: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nationwide Courier Rate (KSh)</label>
              <input
                type="number"
                value={deliverySettings.nationwideCourierFee}
                onChange={(e) => setDeliverySettings({ ...deliverySettings, nationwideCourierFee: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Free Delivery Cart Threshold (KSh)</label>
              <input
                type="number"
                value={deliverySettings.freeDeliveryThreshold}
                onChange={(e) => setDeliverySettings({ ...deliverySettings, freeDeliveryThreshold: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono font-bold"
              />
              <p className="text-[10px] text-stone-400">
                Orders with subtotal equal or exceeding this amount receive free delivery in Nairobi/Kiambu.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliverySettings.factoryPickupAllowed}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, factoryPickupAllowed: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-slate-700">Allow Free Factory Pickup at Ruiru Kimbo Gate</span>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex justify-end">
            <button
              onClick={() => handleSave('Delivery Rates')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <Save size={14} />
              <span>Save Delivery Settings</span>
            </button>
          </div>
        </div>

        {/* Payment Gateways (M-Pesa Daraja) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <CreditCard size={18} className="text-emerald-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Payment Gateways & Daraja STK
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Safaricom M-Pesa Shortcode</label>
              <input
                type="text"
                value={paymentSettings.mpesaShortcode}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, mpesaShortcode: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Daraja Environment</label>
              <select
                value={paymentSettings.mpesaEnv}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, mpesaEnv: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-semibold text-slate-700"
              >
                <option value="sandbox">Sandbox (Development / Testing)</option>
                <option value="production">Production (Live Safaricom Paybill)</option>
              </select>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.paystackEnabled}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, paystackEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-slate-700">Enable Paystack (Visa / Mastercard)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.codEnabled}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, codEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-slate-700">Enable Cash on Delivery Option</span>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex justify-end">
            <button
              onClick={() => handleSave('Payment Gateways')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <Save size={14} />
              <span>Save Payment Config</span>
            </button>
          </div>
        </div>

        {/* Loyalty & Notification Settings */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Award size={18} className="text-amber-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Loyalty Engine & Automated Alerts
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">KES per 1 Point Earned</label>
                <input
                  type="number"
                  value={loyaltySettings.earnRateKes}
                  onChange={(e) => setLoyaltySettings({ ...loyaltySettings, earnRateKes: parseInt(e.target.value) || 50 })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">KES Value per Point</label>
                <input
                  type="number"
                  value={loyaltySettings.pointValueKes}
                  onChange={(e) => setLoyaltySettings({ ...loyaltySettings, pointValueKes: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider text-stone-400">
                Automated Alerts
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.smsOrderConfirmation}
                  onChange={(e) => setNotifications({ ...notifications, smsOrderConfirmation: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-slate-700">SMS Customer on M-Pesa Payment Confirmation</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.smsDispatchAlert}
                  onChange={(e) => setNotifications({ ...notifications, smsDispatchAlert: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-slate-700">SMS Customer when Van Leaves Ruiru (Out for Delivery)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailOrderReceipt}
                  onChange={(e) => setNotifications({ ...notifications, emailOrderReceipt: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-slate-700">Email Customer PDF Invoice & Botanical Care Guide</span>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex justify-end">
            <button
              onClick={() => handleSave('Loyalty & Notification Rules')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <Save size={14} />
              <span>Save Rules</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

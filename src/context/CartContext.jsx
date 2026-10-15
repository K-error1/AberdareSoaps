import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage if available
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aberdares_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('aberdares_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('aberdares_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);

  // Promo code engine
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Delivery options: 'nairobi' (KSh 250), 'pickup' (KSh 0), 'nationwide' (KSh 450)
  const [deliveryOption, setDeliveryOption] = useState('nairobi');

  // Customer Loyalty Green Points
  const [greenPoints, setGreenPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('aberdares_points');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('aberdares_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('aberdares_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('aberdares_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Persist points
  useEffect(() => {
    try {
      localStorage.setItem('aberdares_points', greenPoints.toString());
    } catch (e) {
      console.error(e);
    }
  }, [greenPoints]);

  const addToCart = (product, sizeLabel, quantity = 1) => {
    const selectedSizeObj = product.sizes?.find(s => s.label === sizeLabel) || {
      label: sizeLabel || product.defaultSize || "Standard",
      price: product.basePrice || 100
    };

    const cartItemId = `${product.id}-${selectedSizeObj.label}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            brandLine: product.brandLine,
            image: product.image,
            size: selectedSizeObj.label,
            price: selectedSizeObj.price,
            quantity: quantity
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // Computed financial calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Free delivery threshold: KSh 3,000
  const isFreeDeliveryEligible = cartSubtotal >= 3000;

  let baseDeliveryFee = 0;
  if (deliveryOption === 'pickup') {
    baseDeliveryFee = 0;
  } else if (deliveryOption === 'nairobi') {
    baseDeliveryFee = isFreeDeliveryEligible ? 0 : 250;
  } else if (deliveryOption === 'nationwide') {
    baseDeliveryFee = isFreeDeliveryEligible ? 150 : 450;
  }

  // Promo code validation
  const applyPromoCode = (code) => {
    setPromoError('');
    const clean = (code || '').trim().toUpperCase();
    if (!clean) return;

    if (clean === 'KARIBU10') {
      setAppliedPromo({
        code: 'KARIBU10',
        discountPercent: 10,
        description: '10% Welcome Discount applied!'
      });
      setPromoCodeInput('');
    } else if (clean === 'ABERDARE') {
      setAppliedPromo({
        code: 'ABERDARE',
        discountPercent: 0,
        freeDelivery: true,
        description: 'Free Nairobi/Kiambu Delivery applied!'
      });
      setPromoCodeInput('');
    } else if (clean === 'GREEN20') {
      setAppliedPromo({
        code: 'GREEN20',
        discountPercent: 20,
        description: '20% Eco-Hero Loyalty Discount applied!'
      });
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid promo code. Try KARIBU10 or ABERDARE');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const discountAmount = appliedPromo?.discountPercent
    ? Math.round((cartSubtotal * appliedPromo.discountPercent) / 100)
    : 0;

  const actualDeliveryFee = appliedPromo?.freeDelivery ? 0 : baseDeliveryFee;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + actualDeliveryFee);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const createOrder = (details) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `ABS-${randomNum}`;

    const newOrder = {
      id: newOrderId,
      date: new Date().toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "Order Confirmed — Preparing at Ruiru Facility",
      statusCode: "processing",
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryFee: actualDeliveryFee,
      total: cartTotal,
      customerName: details.fullName,
      phone: details.phone,
      email: details.email,
      deliveryMethod: details.deliveryMethodName,
      deliveryAddress: details.address,
      paymentMethod: details.paymentMethodName,
      mpesaRef: details.mpesaRef || `QKE${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    setOrders(prev => [newOrder, ...prev]);

    // Award loyalty green points: 1 point for every 50 KES spent
    const earnedPoints = Math.floor(cartTotal / 50);
    setGreenPoints(p => p + earnedPoints);

    clearCart();
    return newOrder;
  };

  const lookupOrder = (orderId) => {
    const cleanId = (orderId || '').trim().toUpperCase();
    return orders.find(o => o.id === cleanId) || null;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        cartSubtotal,
        discountAmount,
        actualDeliveryFee,
        cartTotal,
        deliveryOption,
        setDeliveryOption,
        isFreeDeliveryEligible,
        appliedPromo,
        promoCodeInput,
        setPromoCodeInput,
        applyPromoCode,
        removePromoCode,
        promoError,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isQuickViewOpen,
        setIsQuickViewOpen,
        quickViewProduct,
        setQuickViewProduct,
        isWholesaleModalOpen,
        setIsWholesaleModalOpen,
        orders,
        createOrder,
        lookupOrder,
        greenPoints
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

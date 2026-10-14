import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WholesaleQuoteModal } from './components/WholesaleQuoteModal';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { WholesalePage } from './pages/WholesalePage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { GalleryPage } from './pages/GalleryPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';

export function App() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'products', 'about', 'wholesale', 'sustainability', 'gallery', 'blog', 'contact', 'account'
  const [previousPage, setPreviousPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = (pageId) => {
    setPreviousPage(activePage);
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    navigateTo('products');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800 selection:bg-aberdares-forest selection:text-white">
        
        {/* Navigation (Hidden on Account Page) */}
        {activePage !== 'account' && (
          <Navbar
            activePage={activePage}
            setActivePage={navigateTo}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* Dynamic Main Page Content */}
        <main className="flex-1">
          {activePage === 'home' && (
            <HomePage 
              setActivePage={navigateTo} 
              onCategorySelect={handleCategorySelect} 
            />
          )}

          {activePage === 'products' && (
            <ProductsPage
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activePage === 'about' && (
            <AboutPage 
              setActivePage={navigateTo} 
            />
          )}

          {activePage === 'wholesale' && (
            <WholesalePage />
          )}

          {activePage === 'sustainability' && (
            <SustainabilityPage 
              setActivePage={navigateTo} 
            />
          )}

          {activePage === 'gallery' && (
            <GalleryPage />
          )}

          {activePage === 'blog' && (
            <BlogPage />
          )}

          {activePage === 'contact' && (
            <ContactPage />
          )}

          {activePage === 'account' && (
            <AccountPage 
              setActivePage={navigateTo} 
              previousPage={previousPage}
            />
          )}
        </main>

        {/* Global Footer (Hidden on Account Page) */}
        {activePage !== 'account' && (
          <Footer 
            setActivePage={navigateTo} 
            onCategorySelect={handleCategorySelect} 
          />
        )}

        {/* Floating WhatsApp Action Button */}
        <WhatsAppButton />

        {/* Modals & Overlays */}
        <CartDrawer setActivePage={setActivePage} />
        <CheckoutModal />
        <OrderTrackingModal />
        <ProductDetailModal />
        <WholesaleQuoteModal />
        <AuthModal />

      </div>
    </CartProvider>
  </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
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
import { MobileBottomNav } from './components/MobileBottomNav';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { WholesalePage } from './pages/WholesalePage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { GalleryPage } from './pages/GalleryPage';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AdminApp } from './admin/AdminApp';
import { blogPosts } from './data/blogPosts';

export function App() {
  const [selectedArticle, setSelectedArticle] = useState(blogPosts[0]);
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin' || search.includes('page=admin') || search.includes('admin')) {
        return 'admin';
      }
      if (path === '/track' || path.startsWith('/track') || hash === '#track' || hash.startsWith('#track-') || search.includes('track')) {
        return 'track';
      }
      if (hash.startsWith('#article-') || search.includes('article=')) {
        return 'article';
      }
    }
    return 'home';
  });
  const [previousPage, setPreviousPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Listen for direct URL address bar navigation (popstate & hashchange)
  useEffect(() => {
    const checkUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin' || search.includes('page=admin') || search.includes('admin')) {
        setActivePage('admin');
        return;
      }
      if (path === '/track' || path.startsWith('/track') || hash === '#track' || hash.startsWith('#track-') || search.includes('track')) {
        setActivePage('track');
        return;
      }
      if (hash.startsWith('#article-')) {
        const articleId = window.location.hash.replace('#article-', '');
        const matched = blogPosts.find(p => p.id === articleId);
        if (matched) {
          setSelectedArticle(matched);
          setActivePage('article');
          return;
        }
      }
    };

    checkUrlRoute();
    window.addEventListener('popstate', checkUrlRoute);
    window.addEventListener('hashchange', checkUrlRoute);
    return () => {
      window.removeEventListener('popstate', checkUrlRoute);
      window.removeEventListener('hashchange', checkUrlRoute);
    };
  }, []);

  const navigateTo = (pageId) => {
    setPreviousPage(activePage);
    setActivePage(pageId);
    if (pageId === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (pageId === 'track') {
      window.history.pushState({}, '', '/track');
    } else if (pageId === 'article' && selectedArticle) {
      window.history.pushState({}, '', `#article-${selectedArticle.id}`);
    } else if (window.location.pathname === '/admin' || window.location.pathname === '/track' || window.location.hash.startsWith('#admin') || window.location.hash.startsWith('#track') || window.location.hash.startsWith('#article-')) {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    setPreviousPage(activePage);
    setActivePage('article');
    window.history.pushState({}, '', `#article-${article.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    navigateTo('products');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className={`min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800 selection:bg-aberdares-forest selection:text-white w-full max-w-full overflow-x-hidden ${activePage !== 'account' && activePage !== 'admin' ? 'pb-16 lg:pb-0' : ''}`}>
        
        {/* Navigation (Hidden on Account and Admin Pages) */}
        {activePage !== 'account' && activePage !== 'admin' && (
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
            <BlogPage 
              onSelectArticle={handleSelectArticle}
            />
          )}

          {activePage === 'article' && (
            <ArticlePage 
              article={selectedArticle}
              onBack={() => navigateTo('blog')}
              onSelectArticle={handleSelectArticle}
              setActivePage={navigateTo}
            />
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

          {activePage === 'track' && (
            <TrackOrderPage setActivePage={navigateTo} />
          )}

          {activePage === 'admin' && (
            <AdminApp setActivePage={navigateTo} />
          )}
        </main>

        {/* Global Footer (Hidden on Account and Admin Pages) */}
        {activePage !== 'account' && activePage !== 'admin' && (
          <Footer 
            setActivePage={navigateTo} 
            onCategorySelect={handleCategorySelect} 
          />
        )}

        {/* Floating WhatsApp Action Button */}
        {activePage !== 'admin' && <WhatsAppButton />}

        {/* Sticky Mobile Bottom Navigation Bar */}
        {activePage !== 'account' && activePage !== 'admin' && (
          <MobileBottomNav 
            activePage={activePage} 
            setActivePage={navigateTo} 
          />
        )}

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

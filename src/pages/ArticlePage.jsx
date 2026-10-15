import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Bookmark, 
  Check, 
  Tag, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import { blogPosts as fallbackPosts } from '../data/blogPosts';
import { api } from '../services/api';

export const ArticlePage = ({ article, onBack, onSelectArticle, setActivePage }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [liveArticle, setLiveArticle] = useState(article || fallbackPosts[0]);
  const [allArticles, setAllArticles] = useState(fallbackPosts);

  useEffect(() => {
    if (article) {
      setLiveArticle(article);
    }
  }, [article]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await api.getArticles();
        const raw = data.results || (Array.isArray(data) ? data : []);
        if (raw.length > 0) {
          const formatted = raw.map(p => ({
            id: p.slug || p.id,
            slug: p.slug,
            title: p.title,
            category: p.category,
            readTime: p.readTime || p.read_time || '5 min read',
            date: p.date || p.date_display || 'Recent',
            author: p.author || 'Aberdares Chemist',
            summary: p.summary,
            content: p.content,
            image: p.image,
            tags: Array.isArray(p.tags) ? p.tags : []
          }));
          setAllArticles(formatted);

          // If no article passed or URL had hash, match from live
          if (!article && window.location.hash.startsWith('#article-')) {
            const hashId = window.location.hash.replace('#article-', '');
            const match = formatted.find(p => p.id === hashId || p.slug === hashId);
            if (match) setLiveArticle(match);
          }
        }
      } catch (err) {
        console.warn('API getArticles failed in ArticlePage:', err);
      }
    };

    fetchArticles();
  }, [article]);

  const post = liveArticle || fallbackPosts[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Find related articles (excluding current)
  const relatedArticles = allArticles
    .filter(p => p.id !== post.id && p.slug !== post.slug)
    .slice(0, 2);

  return (
    <article className="min-h-screen bg-[#FAF8F5] pb-20">
      
      {/* Top sticky navigation bar */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-aberdares-forest transition-colors py-2 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>All Articles</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-full border transition-all text-xs font-semibold flex items-center gap-1.5 ${
                saved 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title={saved ? "Article Bookmarked" : "Bookmark Article"}
            >
              <Bookmark size={15} className={saved ? 'fill-current' : ''} />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Share Article"
            >
              {copied ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} />}
              <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <button onClick={() => setActivePage?.('home')} className="hover:text-stone-900 transition-colors">Home</button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-stone-900 transition-colors">Knowledge Desk</button>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-[200px] sm:max-w-xs">{post.category}</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-wider">
            <Leaf size={12} className="text-emerald-700" />
            <span>{post.category}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-lg text-stone-600 leading-relaxed font-normal">
            {post.summary}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200 text-xs sm:text-sm text-stone-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a4d36] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {post.author ? post.author.charAt(0) : 'A'}
              </div>
              <div>
                <p className="font-bold text-slate-900 leading-tight">{post.author}</p>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Verified Laboratory Insight</span>
            </div>
          </div>
        </header>

        {/* Featured Hero Image */}
        <div className="rounded-3xl overflow-hidden shadow-lg border border-stone-200 aspect-16/9 bg-stone-100 relative group">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Prose Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-stone-200 shadow-sm space-y-6">
          <div className="prose prose-stone prose-lg max-w-none text-stone-800 leading-relaxed space-y-6">
            {post.content ? (
              post.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "text-base sm:text-lg font-medium text-stone-900 leading-relaxed" : "text-sm sm:text-base leading-relaxed text-stone-700"}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-stone-600">{post.summary}</p>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 mt-8 border-t border-stone-100 flex flex-wrap items-center gap-2">
              <Tag size={15} className="text-stone-400" />
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mr-1">Tags:</span>
              {post.tags.map(t => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-xs font-semibold"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Author Bio Card */}
        <div className="bg-emerald-50/60 rounded-3xl p-6 sm:p-8 border border-emerald-100 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-aberdares-forest text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {post.author ? post.author.charAt(0) : 'A'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Authored By</h4>
            <p className="font-extrabold text-slate-900 text-base">{post.author}</p>
            <p className="text-xs text-stone-600 leading-relaxed">
              Formulation & Research Department at Aberdares Soaps & Detergents Limited, Ruiru, Kenya. Dedicated to eco-safe botanical chemistry and high-foaming water-smart technologies.
            </p>
          </div>
        </div>

        {/* Product Promo Callout */}
        <div className="bg-gradient-to-br from-[#0f291e] to-[#1a4d36] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
              <Sparkles size={13} /> Aberdares Nature + Science
            </span>
            <h3 className="text-xl sm:text-2xl font-black">Experience the Quality First-Hand</h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg">
              Explore our range of cold-pressed bar soaps, enzyme liquid detergents, and garden-safe cleaning solutions engineered in Kenya.
            </p>
          </div>
          <button
            onClick={() => setActivePage?.('products')}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider shrink-0 transition-transform hover:scale-105 shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span>Shop Products</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Related Articles</h3>
              <button
                onClick={onBack}
                className="text-xs font-bold text-aberdares-forest hover:underline flex items-center gap-1"
              >
                <span>View all articles</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel)}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="aspect-16/9 overflow-hidden bg-stone-100">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {rel.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-aberdares-forest transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-[11px] text-stone-500">
                      <span>{rel.readTime}</span>
                      <span className="font-bold text-aberdares-forest flex items-center gap-1">
                        Read Now <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};

export default ArticlePage;

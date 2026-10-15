import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { blogPosts as fallbackPosts } from '../data/blogPosts';
import { api } from '../services/api';

export const BlogPage = ({ onSelectArticle }) => {
  const [posts, setPosts] = useState(fallbackPosts);
  const [activeTag, setActiveTag] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await api.getArticles();
        const raw = data.results || (Array.isArray(data) ? data : []);
        if (raw.length > 0) {
          setPosts(raw.map(p => ({
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
          })));
        }
      } catch (err) {
        console.warn('API getArticles fallback to static:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const allTags = ['All', 'Skincare', 'Botanicals', 'Sustainability', 'Greywater', 'Bio-Digester', 'Hospitality'];

  const filteredPosts = activeTag === 'All'
    ? posts
    : posts.filter(p => p.tags?.some(t => t.toLowerCase() === activeTag.toLowerCase()));

  const handleCardClick = (post) => {
    if (onSelectArticle) {
      onSelectArticle(post);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <BookOpen size={13} />
          <span>Aberdares Knowledge Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Hygiene, Skincare & Eco-Cleaning Insights
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
          Practical advice from our formulation chemists and environmental safety engineers based in Ruiru.
        </p>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTag === tag
                ? 'bg-aberdares-forest text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => handleCardClick(post)}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider">
                {post.category}
              </span>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-aberdares-forest transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-500">
                  By {post.author ? post.author.split(' ')[0] : 'Aberdares'} {post.author ? (post.author.split(' ')[1] || '') : 'Chemist'}
                </span>
                <span className="text-xs font-bold text-aberdares-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Full Article</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};

export default BlogPage;

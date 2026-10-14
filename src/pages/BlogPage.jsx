import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  X, 
  Tag, 
  Share2,
  Sparkles
} from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export const BlogPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTag, setActiveTag] = useState('All');

  const allTags = ['All', 'Skincare', 'Botanicals', 'Sustainability', 'Greywater', 'Bio-Digester', 'Hospitality'];

  const filteredPosts = activeTag === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.tags?.includes(activeTag));

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
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
            onClick={() => setSelectedPost(post)}
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
                  By {post.author.split(' ')[0]} {post.author.split(' ')[1]}
                </span>
                <span className="text-xs font-bold text-aberdares-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Reading Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-stone-200 my-6 relative max-h-[88vh] flex flex-col">
            
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-stone-100 text-stone-700 flex items-center justify-center shadow-md backdrop-blur-xs transition-colors"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto">
              <div className="relative aspect-16/9 max-h-[320px] w-full bg-stone-100">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 font-extrabold text-[10px] uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {selectedPost.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-200 text-xs text-stone-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <User size={13} /> {selectedPost.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {selectedPost.date}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[10px]">
                    {selectedPost.readTime}
                  </span>
                </div>

                <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
                  {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Article Tags */}
                <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-1.5">
                  <Tag size={13} className="text-stone-400" />
                  {selectedPost.tags?.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Back to Articles
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  ExternalLink,
  X,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { blogPosts as fallbackPosts } from '../../data/blogPosts';
import { api } from '../../services/api';

export const BlogAdminPage = () => {
  const [posts, setPosts] = useState(fallbackPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'Skincare Science',
    readTime: '',
    date: new Date().toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }),
    author: '',
    summary: '',
    content: '',
    image: '',
    tags: ''
  });

  const normalizeArticle = (p) => ({
    id: p.slug || p.id,
    slug: p.slug,
    rawId: p.id,
    title: p.title,
    category: p.category,
    readTime: p.readTime || p.read_time || '5 min read',
    date: p.date || p.date_display || 'Recent',
    author: p.author || 'Aberdares Chemist',
    summary: p.summary || '',
    content: p.content || '',
    image: p.image || '',
    tags: Array.isArray(p.tags) ? p.tags : []
  });

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await api.getArticles({ all: 'true' });
      const raw = data.results || (Array.isArray(data) ? data : []);
      if (raw.length > 0) {
        setPosts(raw.map(normalizeArticle));
      }
    } catch (err) {
      console.warn('Failed to load articles from API, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormData({
      id: `post-${Date.now()}`,
      title: '',
      category: 'Skincare Science',
      readTime: '4 min read',
      date: new Date().toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: 'Wanjiku Mwangi (Head Formulation Chemist)',
      summary: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      tags: 'Skincare, Botanicals'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({
      id: post.id,
      title: post.title,
      category: post.category,
      readTime: post.readTime,
      date: post.date,
      author: post.author,
      summary: post.summary,
      content: post.content,
      image: post.image,
      tags: post.tags ? post.tags.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const tagArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const postPayload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: formData.category,
      read_time: formData.readTime,
      date_display: formData.date,
      author: formData.author,
      summary: formData.summary,
      content: formData.content,
      image: formData.image,
      tags: tagArray,
      is_published: true
    };

    if (editingPost) {
      try {
        await api.updateArticle(editingPost.slug || editingPost.id, postPayload);
      } catch (err) {
        console.warn('Backend updateArticle failed, updated locally:', err);
      }
      setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...formData, tags: tagArray } : p));
    } else {
      try {
        const created = await api.createArticle(postPayload);
        setPosts([normalizeArticle(created), ...posts]);
      } catch (err) {
        console.warn('Backend createArticle failed, saved locally:', err);
        setPosts([{ ...formData, tags: tagArray }, ...posts]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this published article?')) {
      const post = posts.find(p => p.id === id);
      if (post) {
        try {
          await api.deleteArticle(post.slug || post.id);
        } catch (err) {
          console.warn('Backend deleteArticle failed, removed locally:', err);
        }
      }
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Knowledge Desk & Blog Articles
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Publish educational guides on hygiene, greywater safety, and active botanicals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadArticles}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
            title="Refresh articles from database"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={15} />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or category..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
          />
        </div>
        <span className="text-xs font-semibold text-stone-500">
          Total: <span className="text-slate-900 font-bold">{posts.length}</span> article(s)
        </span>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-[11px] font-bold text-stone-700 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Read Time</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 max-w-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.image}
                        alt=""
                        className="w-12 h-9 rounded-lg object-cover bg-stone-100 shrink-0"
                      />
                      <span className="line-clamp-2">{post.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[10px] uppercase">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-stone-500 font-medium">
                    {post.author}
                  </td>
                  <td className="py-3 px-3 text-stone-400 text-[11px]">
                    {post.readTime}
                  </td>
                  <td className="py-3 px-3 text-stone-400 text-[11px] whitespace-nowrap">
                    {post.date}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`#article-${post.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors inline-flex items-center"
                        title="View Live Article Page"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {editingPost ? 'Edit Article' : 'Draft New Insight Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  placeholder="e.g. Why Aberdare Aloe Outperforms Coastal Aloe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Skincare Science">Skincare Science</option>
                    <option value="Eco Living">Eco Living</option>
                    <option value="Sanitation & Hygiene">Sanitation & Hygiene</option>
                    <option value="Hospitality Insights">Hospitality Insights</option>
                    <option value="Company News">Company News</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    placeholder="e.g. 5 min read"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Author *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    placeholder="e.g. Wanjiku Mwangi (Head Chemist)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Publication Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl leading-relaxed"
                  placeholder="Short introductory summary snippet displayed on card previews..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Content (Markdown / Paragraphs) *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl leading-relaxed font-mono text-[11px]"
                  placeholder="Double newline between paragraphs..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  placeholder="Skincare, Botanicals, Aloe Vera, Ruiru"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingPost ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdminPage;

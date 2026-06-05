import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import RichTextEditor from '../components/RichTextEditor';
import ImagePickerDialog from '../components/ImagePickerDialog';
import ReadingProgress from '../components/ReadingProgress';

export default function Articles() {
  const { user } = useAuth();
  const { articles, addArticle, updateArticle, deleteArticle } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', imageUrl: '', isPinned: false });
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const handleEdit = (article: any) => {
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      imageUrl: article.imageUrl || '',
      isPinned: article.isPinned
    });
    setEditingId(article.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title && form.content) {
      if (editingId) {
        updateArticle(editingId, {
          ...form,
        });
      } else {
        addArticle({
          ...form,
          date: new Date().toISOString().split('T')[0],
          author: user?.name || 'Admin',
        });
      }
      setForm({ title: '', excerpt: '', content: '', imageUrl: '', isPinned: false });
      setEditingId(null);
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', excerpt: '', content: '', imageUrl: '', isPinned: false });
  };

  return (
    <div className="pt-24 min-h-screen bg-heraldry-bg relative">
      <ReadingProgress />
      <div className="container mx-auto px-6 max-w-5xl py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="text-heraldry-red font-sans text-xs uppercase tracking-[0.3em] font-semibold block mb-2">Nyhende og Fag</span>
            <h1 className="text-4xl md:text-5xl font-serif text-heraldry-blue font-light italic">Artiklar</h1>
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={() => showForm ? handleCancel() : setShowForm(!showForm)}
              className="mt-6 md:mt-0 px-6 py-3 bg-heraldry-red text-white text-xs uppercase tracking-widest font-bold hover:bg-heraldry-red-dark transition-colors cursor-pointer"
            >
              {showForm ? 'Avbryt' : 'Ny artikkel'}
            </button>
          )}
        </div>

        {showForm && user?.role === 'admin' && (
          <form onSubmit={handleSubmit} className="bg-white p-8 border border-heraldry-gold/30 shadow-lg mb-12">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-heraldry-gold/20 pb-4">
              {editingId ? 'Rediger artikkel' : 'Skriv ny artikkel'}
            </h3>
            <div className="grid gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Tittel</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} type="text" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 focus:outline-none focus:border-heraldry-red" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Sammendrag (Kort)</label>
                <input required value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} type="text" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 focus:outline-none focus:border-heraldry-red" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">HOVEDBILDE URL (VALGFRITT)</label>
                <div className="flex gap-2">
                  <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} type="text" className="flex-1 px-0 py-2 bg-transparent border-b border-heraldry-blue/20 focus:outline-none focus:border-heraldry-red" placeholder="https://..." />
                  <button type="button" onClick={() => setIsImagePickerOpen(true)} className="px-4 py-2 border border-heraldry-blue/20 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">
                    Søk bilde
                  </button>
                </div>
                <ImagePickerDialog isOpen={isImagePickerOpen} onClose={() => setIsImagePickerOpen(false)} onSelect={(url) => { setForm({...form, imageUrl: url}); setIsImagePickerOpen(false); }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Innhald</label>
                <RichTextEditor value={form.content} onChange={val => setForm({...form, content: val})} placeholder="Skriv din artikkel her, bruk formatering etter behov..." />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" checked={form.isPinned} onChange={e => setForm({...form, isPinned: e.target.checked})} className="cursor-pointer" />
                 <span className="text-sm">Fest artikkel (Visast på framsida)</span>
              </label>
              <button type="submit" className="bg-heraldry-blue text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer">
                {editingId ? 'Oppdater artikkel' : 'Publiser'}
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white border border-heraldry-gold/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
              {article.imageUrl && (
                <div className="w-full h-64 md:h-96">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-6 text-[10px] uppercase tracking-widest font-sans">
                  <div className="flex gap-4 items-center opacity-60">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.author}</span>
                    {article.isPinned && (
                      <>
                        <span>•</span>
                        <span className="text-heraldry-red font-bold">Festa</span>
                      </>
                    )}
                  </div>
                  {user?.role === 'admin' && (
                     <div className="flex gap-3">
                       <button onClick={(e) => { e.stopPropagation(); handleEdit(article); }} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-heraldry-blue transition-colors font-bold">Rediger</button>
                       <button onClick={(e) => { e.stopPropagation(); if(confirm('Er du sikker på at du vil slette denne artikkelen?')) deleteArticle(article.id); }} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 transition-colors font-bold">Slett</button>
                     </div>
                  )}
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-heraldry-blue mb-8 leading-tight">{article.title}</h2>
                <div className="prose prose-slate prose-lg max-w-none opacity-80 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: article.content }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

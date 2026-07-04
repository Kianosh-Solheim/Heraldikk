import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ArticleDownloadMenu from '../components/ArticleDownloadMenu';
import ReadingProgress from '../components/ReadingProgress';
import { Share2, Check } from 'lucide-react';

import { extractIdFromSlug } from '../utils/slugify';

export default function ArticleDetail() {
  const { articleId } = useParams<{ articleId: string }>();
  const { articles, deleteArticle } = useData();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const id = articleId ? extractIdFromSlug(articleId) : '';
  const article = articles.find(a => a.id === id);

  const handleShare = async () => {
    if (!article) return;
    
    const shareData = {
      title: article.title,
      text: article.excerpt || `Les artikkelen "${article.title}" på Norsk Heraldisk Forening`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    }
  };

  if (!article) {
    return (
      <div className="pt-8 min-h-screen bg-heraldry-bg flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif text-heraldry-blue mb-4">Artikkelen ble ikke funnet</h1>
        <Link to="/artikler" className="text-heraldry-red hover:underline font-bold text-sm uppercase tracking-widest">
          &larr; Tilbake til artikler
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-8 min-h-screen bg-heraldry-bg relative">
      <ReadingProgress />
      <div className="container mx-auto px-6 max-w-4xl py-12">
        <div className="mb-8">
          <Link to="/artikler" className="text-heraldry-red hover:underline font-bold text-xs uppercase tracking-widest">
            &larr; Tilbake til artikler
          </Link>
        </div>

        <div className="bg-white border border-heraldry-gold/20 shadow-sm overflow-hidden">
          {article.imageUrl && (
            <div className="w-full bg-slate-50 border-b border-heraldry-gold/10 relative">
              <div className="w-full flex justify-center">
                <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-[600px] object-contain" referrerPolicy="no-referrer" />
              </div>
              {article.imageTitle && article.imageSourceUrl && (
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                  Bilde:{' '}
                  <a 
                    href={article.imageSourceUrl} 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="underline hover:text-heraldry-gold transition-colors"
                  >
                    {article.imageTitle.replace(/^File:/, '').replace(/\.[^/.]+$/, '').replace(/_/g, ' ')} fra Wikimedia Commons
                  </a>
                </div>
              )}
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
              <div className="flex gap-3 relative z-10">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-heraldry-blue transition-colors font-bold group"
                  title="Del artikkel"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Kopiert!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>Del</span>
                    </>
                  )}
                </button>
                <ArticleDownloadMenu title={article.title} content={article.content} imageUrl={article.imageUrl} />
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => { 
                      if(window.confirm('Er du sikker på at du vil slette denne artikkelen?')) {
                        deleteArticle(article.id);
                        window.location.href = '/artikler';
                      }
                    }} 
                    className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 transition-colors font-bold"
                  >
                    Slett
                  </button>
                )}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-heraldry-blue mb-8 leading-tight">{article.title}</h1>
            
            <div className="prose prose-slate prose-lg max-w-none opacity-80 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: article.content }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

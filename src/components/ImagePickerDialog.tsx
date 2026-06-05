import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Upload, Image as ImageIcon } from 'lucide-react';

interface ImagePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function ImagePickerDialog({ isOpen, onClose, onSelect }: ImagePickerDialogProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'wikimedia'>('wikimedia');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(searchQuery)}&gsrlimit=30&prop=imageinfo&iiprop=url|size&iiurlwidth=500&format=json&origin=*`);
      const data = await response.json();
      
      if (data.query && data.query.pages) {
        const results = Object.values(data.query.pages)
          .map((page: any) => ({
            id: page.pageid,
            title: page.title,
            url: page.imageinfo?.[0]?.url,
            thumbUrl: page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url
          }))
          .filter(img => img.url);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 800KB to fit easily into Firestore 1MB limits)
      if (file.size > 800 * 1024) {
        alert("Bildet er for stort. Velg et bilde under 800KB, eller bruk Wikimedia søket.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelect(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const dialogContent = (
    <div className="fixed inset-0 z-[20000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-heraldry-gold/20">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="font-serif text-2xl text-heraldry-blue">Legg til bilde</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
        </div>
        
        <div className="flex border-b border-slate-100 px-6">
          <button 
            type="button"
            className={`py-4 px-6 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'wikimedia' ? 'border-b-2 border-heraldry-red text-heraldry-blue' : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'}`}
            onClick={() => setActiveTab('wikimedia')}
          >
            <Search size={16} className="inline mr-2 -mt-1" /> Wikimedia
          </button>
          <button 
            type="button"
            className={`py-4 px-6 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'upload' ? 'border-b-2 border-heraldry-red text-heraldry-blue' : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={16} className="inline mr-2 -mt-1" /> Last opp
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
          {activeTab === 'wikimedia' && (
            <div className="flex flex-col h-full">
              <div className="flex gap-4 mb-8">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Søk etter åpne fritt lisensierte bilder..." 
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 focus:outline-none focus:border-heraldry-blue shadow-sm font-sans"
                />
                <button type="button" onClick={() => handleSearch()} className="px-8 py-3 bg-heraldry-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm">
                  Søk
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                  <div className="text-slate-400 flex flex-col items-center gap-4">
                    <Search className="animate-pulse" size={32} />
                    <span className="text-xs uppercase tracking-widest font-bold">Leter i arkivet...</span>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 pb-12">
                  {searchResults.map((img) => (
                    <div 
                      key={img.id} 
                      className="break-inside-avoid bg-slate-100 rounded overflow-hidden cursor-pointer border-2 border-transparent hover:border-heraldry-blue transition-all group relative"
                      onClick={() => onSelect(img.url)}
                    >
                      <img src={img.thumbUrl} alt={img.title} className="w-full h-auto object-cover" loading="lazy" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 pointer-events-none">
                        <span className="text-white text-xs truncate w-full">{img.title.replace('File:', '')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center py-12">
                  <div className="bg-white p-8 rounded-full shadow-sm mb-6">
                    <ImageIcon size={48} className="text-slate-200" />
                  </div>
                  <p className="text-slate-500 font-sans text-center max-w-sm">Finn og bruk historiske illustrasjoner og høyoppløselige bilder fra Wikipedia sitt åpne bildebibliotek.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="flex-1 flex justify-center items-center py-12">
              <label className="flex flex-col items-center justify-center w-full max-w-xl h-80 bg-white border-2 border-slate-200 border-dashed cursor-pointer hover:bg-slate-50 hover:border-heraldry-blue transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="bg-slate-50 p-6 rounded-full group-hover:bg-heraldry-blue/5 group-hover:text-heraldry-blue transition-colors mb-6">
                    <Upload size={48} className="text-slate-400 group-hover:text-heraldry-blue transition-colors" />
                  </div>
                  <p className="mb-3 text-slate-600 font-sans text-lg"><span className="font-semibold text-heraldry-blue">Klikk for å velge fil</span> eller dra filen hit</p>
                  <p className="text-sm text-slate-400 font-sans text-center max-w-xs">Maksimalt 800 KB (JPEG, PNG). Skaleres ned for å passe inne i databasen.</p>
                </div>
                <input type="file" className="hidden" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handleFileUpload} />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(dialogContent, document.body) : null;
}

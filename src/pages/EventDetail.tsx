import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, updateEvent, deleteEvent } = useData();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '', content: '' });

  useEffect(() => {
    const activeEvent = events.find(e => e.id === eventId);
    if (activeEvent) {
      setEvent(activeEvent);
      setForm({
        title: activeEvent.title || '',
        date: activeEvent.date || '',
        location: activeEvent.location || '',
        description: activeEvent.description || '',
        content: activeEvent.content || ''
      });
    } else {
      // Could handle redirect or 404 here
    }
  }, [events, eventId]);

  if (!event) {
    return <div className="pt-8 min-h-screen bg-heraldry-bg text-center py-24">Laster arrangement...</div>;
  }

  const isAdmin = user?.role === 'admin';

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (eventId) {
      try {
        await updateEvent(eventId, form);
        setIsEditing(false);
      } catch (error: any) {
        alert("Kunne ikke lagre endringer. Sjekk at alle felt er fylt ut riktig.");
        console.error("Error during update:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Er du sikker på at du vil slette dette arrangementet?')) {
      if (eventId) {
        await deleteEvent(eventId);
        navigate('/arrangementer');
      }
    }
  };

  return (
    <div className="pt-8 min-h-screen bg-heraldry-bg">
      <div className="container mx-auto px-6 max-w-4xl py-12">
        <button 
          onClick={() => navigate('/arrangementer')} 
          className="flex items-center text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-8"
        >
          <ArrowLeft size={16} className="mr-2" /> Tilbake til kalender
        </button>

        {!isEditing ? (
          <div className="bg-white p-8 md:p-12 border border-heraldry-gold/30 shadow-sm relative">
            <span className="text-heraldry-red font-sans text-xs uppercase tracking-[0.3em] font-semibold block mb-2">Arrangement</span>
            <h1 className="text-4xl md:text-5xl font-serif text-heraldry-blue font-light mb-6 leading-tight">{event.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-heraldry-gold/20 mb-8">
              <div>
                <span className="block text-[10px] uppercase tracking-widest opacity-60 mb-1">Dato</span>
                <span className="font-semibold text-lg text-heraldry-blue">{new Date(event.date).toLocaleDateString('nn-NO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest opacity-60 mb-1">Stad</span>
                <span className="font-semibold text-lg text-heraldry-blue">{event.location}</span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg font-medium opacity-80 mb-8">{event.description}</p>
              
              {event.content && (
                <div className="mt-8 opacity-80" dangerouslySetInnerHTML={{ __html: event.content }}></div>
              )}
            </div>

            {isAdmin && (
              <div className="mt-12 pt-8 border-t border-heraldry-gold/20 flex gap-4">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-heraldry-blue text-white text-xs uppercase tracking-widest font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Rediger
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-6 py-3 bg-transparent border border-red-200 text-red-600 text-xs uppercase tracking-widest font-bold hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Slett
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 md:p-12 border border-heraldry-gold/30 shadow-lg">
            <h2 className="text-2xl font-serif text-heraldry-blue mb-8">Rediger arrangement</h2>
            <form onSubmit={handleUpdate} className="grid gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Tittel</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} type="text" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 focus:outline-none focus:border-heraldry-red" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Dato</label>
                  <input required value={form.date} onChange={e => setForm({...form, date: e.target.value})} type="date" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 focus:outline-none focus:border-heraldry-red" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Stad / Lokasjon</label>
                  <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} type="text" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 focus:outline-none focus:border-heraldry-red" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Kort Skildring</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 focus:outline-none focus:border-heraldry-red resize-none"></textarea>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Fullt Program / Artikkel for arrangementet</label>
                <RichTextEditor value={form.content} onChange={val => setForm({...form, content: val})} placeholder="Skriv innholdet her..." />
              </div>
              <div className="flex gap-4 mt-4">
                <button type="submit" className="px-8 py-4 bg-heraldry-blue text-white text-xs uppercase tracking-widest font-bold hover:bg-slate-800 transition-colors cursor-pointer">
                  Lagre endringer
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-4 bg-transparent border border-heraldry-blue/20 text-heraldry-blue text-xs uppercase tracking-widest font-bold hover:bg-slate-50 transition-colors cursor-pointer">
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

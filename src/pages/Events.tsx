import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Events() {
  const { events, addEvent } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title && form.date) {
      addEvent(form);
      setForm({ title: '', date: '', location: '', description: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="pt-8 min-h-screen bg-heraldry-bg">
      <div className="container mx-auto px-6 max-w-4xl py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="text-heraldry-red font-sans text-xs uppercase tracking-[0.3em] font-semibold block mb-2">Kalender</span>
            <h1 className="text-4xl md:text-5xl font-serif text-heraldry-blue font-light italic">Arrangementer</h1>
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="mt-6 md:mt-0 px-6 py-3 bg-heraldry-red text-white text-xs uppercase tracking-widest font-bold hover:bg-heraldry-red-dark transition-colors cursor-pointer"
            >
              {showForm ? 'Avbryt' : 'Nytt arrangement'}
            </button>
          )}
        </div>

        {showForm && user?.role === 'admin' && (
          <form onSubmit={handleSubmit} className="bg-white p-8 border border-heraldry-gold/30 shadow-lg mb-12">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-heraldry-gold/20 pb-4">Legg til arrangement</h3>
            <div className="grid gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Tittel</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} type="text" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 focus:outline-none focus:border-heraldry-red" />
              </div>
              <div className="grid grid-cols-2 gap-6">
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
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-2">Skildring</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 focus:outline-none focus:border-heraldry-red resize-none"></textarea>
              </div>
              <button type="submit" className="bg-heraldry-blue text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer">
                Legg til
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-6">
          {events.map((event) => (
            <div 
              key={event.id} 
              onClick={() => navigate(`/arrangementer/${event.id}`)}
              className="bg-white p-6 border-l-4 border-l-heraldry-red border-y border-r border-heraldry-gold/20 shadow-sm flex flex-col md:flex-row gap-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="md:w-32 flex-shrink-0 border-b md:border-b-0 md:border-r border-heraldry-gold/20 pb-4 md:pb-0 md:pr-6 flex flex-col justify-center items-center md:items-start">
                 <span className="text-2xl font-light">{new Date(event.date).getDate()}</span>
                 <span className="text-xs uppercase tracking-widest opacity-60">
                   {new Date(event.date).toLocaleString('nn-NO', { month: 'short', year: 'numeric' })}
                 </span>
              </div>
              <div className="flex-1">
                 <h2 className="text-lg font-bold font-sans uppercase tracking-widest text-heraldry-blue mb-2">{event.title}</h2>
                 <p className="text-[10px] uppercase tracking-widest opacity-60 mb-4">{event.location}</p>
                 <p className="text-sm opacity-80">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

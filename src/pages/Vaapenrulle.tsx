import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shield } from 'lucide-react';

export default function Vaapenrulle() {
  const { user } = useAuth();
  const { arms, addArm, approveArm } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', owner: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.description) {
      addArm(form);
      setForm({ name: '', description: '', owner: '' });
      setShowForm(false);
      alert('Våpen sendt inn til vurdering.');
    }
  };

  const displayedArms = user?.role === 'admin' ? arms : arms.filter(a => a.status === 'approved');

  return (
    <div className="pt-24 min-h-screen bg-heraldry-bg">
      <div className="container mx-auto px-6 max-w-6xl py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="text-heraldry-red font-sans text-xs uppercase tracking-[0.3em] font-semibold block mb-2">Registeret</span>
            <h1 className="text-4xl md:text-5xl font-serif text-heraldry-blue font-light italic">Våpenrullen</h1>
          </div>
          {user && (user.role === 'member' || user.role === 'admin') && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="mt-6 md:mt-0 px-6 py-3 bg-heraldry-red text-white text-xs uppercase tracking-widest font-bold hover:bg-heraldry-red-dark transition-colors cursor-pointer"
            >
              {showForm ? 'Avbryt' : 'Send inn nytt våpen'}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-8 border border-heraldry-gold/30 shadow-lg mb-12">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-heraldry-gold/20 pb-4">Registrer eit nytt våpen</h3>
            <div className="grid gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-sans opacity-60 mb-2">Namn på våpenet</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 text-heraldry-blue focus:outline-none focus:border-heraldry-red" placeholder="Slektsvåpen Hansen" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-sans opacity-60 mb-2">Eigar</label>
                <input required value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} type="text" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 text-heraldry-blue focus:outline-none focus:border-heraldry-red" placeholder="Ola Hansen" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-sans opacity-60 mb-2">Blasonering (Skildring)</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 text-heraldry-blue focus:outline-none focus:border-heraldry-red resize-none" placeholder="I sølv ein raud løve..."></textarea>
              </div>
              <button type="submit" className="bg-heraldry-blue text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer">
                Send inn
              </button>
            </div>
          </form>
        )}

        {(!user || user.role === 'visitor') && (
           <div className="bg-heraldry-surface border border-heraldry-gold/20 p-6 mb-12 text-sm opacity-80 border-l-4 border-l-heraldry-gold">
             Som medlem kan du sende inn dine eigne våpen for vurdering og publisering i Våpenrullen. <a href="/login" className="text-heraldry-red font-bold hover:underline">Logg inn</a> eller sjå <a href="/medlemskap" className="text-heraldry-red font-bold hover:underline">Medlemskap</a>.
           </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {displayedArms.map((arm) => (
            <div key={arm.id} className="bg-white border border-heraldry-gold/20 p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:border-heraldry-gold/60 transition-all">
              <div className="w-20 h-24 mb-6 relative flex items-center justify-center">
                 <Shield className="w-16 h-16 text-heraldry-gold opacity-20 absolute" />
                 <Shield className="w-10 h-10 text-heraldry-blue z-10" />
              </div>
              <h3 className="text-sm font-bold font-sans uppercase tracking-[0.1em] text-heraldry-blue mb-2">{arm.name}</h3>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-4">Eigar: {arm.owner}</p>
              <p className="text-xs opacity-80 line-clamp-3 italic">"{arm.description}"</p>
              
              {user?.role === 'admin' && arm.status === 'pending' && (
                <button onClick={(e) => { e.stopPropagation(); approveArm(arm.id); }} className="mt-4 px-4 py-1 bg-green-700 text-white text-[10px] uppercase tracking-widest font-bold cursor-pointer">
                  Godkjenn
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

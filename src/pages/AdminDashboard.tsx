import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-8 min-h-screen bg-heraldry-bg flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-4xl py-12">
        <div className="bg-white p-8 md:p-12 border border-heraldry-gold/30 shadow-md">
          <h1 className="text-3xl font-serif text-heraldry-blue mb-6">Admin Dashboard</h1>
          <p className="text-sm opacity-80 mb-8 font-sans">
            Velkommen til admin panelet. Herfra kan du administrere artikler, arrangementer, og medlemmer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 p-6 flex flex-col items-start bg-slate-50">
              <h2 className="text-xl font-serif text-heraldry-blue mb-2">Artikler</h2>
              <p className="text-xs opacity-70 mb-4 flex-1">Administrer artikler, legg til nye artikler eller slett eksisterende.</p>
              <a href="/artikler" className="bg-heraldry-blue text-white px-4 py-2 uppercase tracking-widest text-[10px] font-bold hover:bg-slate-800 transition-colors">
                Gå til Artikler
              </a>
            </div>

            <div className="border border-slate-200 p-6 flex flex-col items-start bg-slate-50">
              <h2 className="text-xl font-serif text-heraldry-blue mb-2">Arrangementer</h2>
              <p className="text-xs opacity-70 mb-4 flex-1">Administrer kommende og tidligere arrangementer.</p>
              <a href="/arrangementer" className="bg-heraldry-blue text-white px-4 py-2 uppercase tracking-widest text-[10px] font-bold hover:bg-slate-800 transition-colors">
                Gå til Arrangementer
              </a>
            </div>

            <div className="border border-slate-200 p-6 flex flex-col items-start bg-slate-50">
              <h2 className="text-xl font-serif text-heraldry-blue mb-2">Medlemmenes våpen</h2>
              <p className="text-xs opacity-70 mb-4 flex-1">Administrer våpenrullen for medlemmer.</p>
              <a href="/vaapenrulle" className="bg-heraldry-blue text-white px-4 py-2 uppercase tracking-widest text-[10px] font-bold hover:bg-slate-800 transition-colors">
                Gå til Våpenrulle
              </a>
            </div>
            
            <div className="border border-slate-200 p-6 flex flex-col items-start bg-slate-50">
              <h2 className="text-xl font-serif text-heraldry-blue mb-2">Brukere & Tilgang</h2>
              <p className="text-xs opacity-70 mb-4 flex-1">Administrer brukerkontoer og tilganger (kommer senere).</p>
              <button disabled className="bg-slate-300 text-white px-4 py-2 uppercase tracking-widest text-[10px] font-bold cursor-not-allowed">
                Ikke tilgjengelig
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useAuth, Role } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
      navigate('/');
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  return (
    <div className="pt-8 min-h-screen bg-heraldry-bg flex flex-col items-center justify-center p-6">
      <div className="bg-white p-12 w-full max-w-md border border-heraldry-gold/30 shadow-2xl text-center">
        <h1 className="text-3xl font-serif text-heraldry-blue mb-2 italic">Min Side</h1>
        
        {user ? (
          <div>
            <p className="mb-4 text-sm">Logga inn som <strong className="uppercase">{user.role}</strong> ({user.email})</p>
            <button onClick={logout} className="w-full bg-heraldry-red text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-heraldry-red-dark transition-colors cursor-pointer">
              Logg Ut
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm opacity-80 mb-6">Logg inn med Google for å få tilgang til medlemssider.</p>
            
            <button onClick={handleLogin} className="w-full bg-heraldry-blue text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer">
              Logg inn med Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

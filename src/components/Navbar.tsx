import { Shield, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Forside', path: '/' },
    { name: 'Om oss', path: '/om-oss' },
    { name: 'Medlemskap', path: '/medlemskap' },
    { name: 'Våpenbrevet', path: '/vaapenbrev' },
    { name: 'Våpenrullen', path: '/vaapenrulle' },
    { name: 'Kalender', path: '/arrangementer' },
    { name: 'Artiklar', path: '/artikler' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-heraldry-bg/95 backdrop-blur-md shadow-sm border-b border-heraldry-gold' : 'bg-heraldry-bg border-b border-heraldry-gold/30'}`}>
      <div className="container mx-auto px-6 max-w-[1400px] flex justify-between items-center h-20">
        <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
          <div className="w-10 h-14 bg-heraldry-red flex items-center justify-center border-2 border-heraldry-gold rounded-sm group-hover:bg-heraldry-red-dark transition-colors">
            <Shield className="text-heraldry-gold w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-base md:text-lg tracking-[0.1em] md:tracking-[0.2em] uppercase text-heraldry-blue`}>
              NHF
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] opacity-60 font-sans hidden sm:block">
              Stiftet 1969
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-[10px] xl:text-xs font-sans uppercase tracking-widest font-medium">
          {navLinks.map((link) => (
             <Link 
               key={link.path} 
               to={link.path}
               className={`border-b pb-1 transition-all ${location.pathname === link.path ? 'text-heraldry-red border-heraldry-red' : 'text-heraldry-blue border-transparent hover:text-heraldry-red hover:border-heraldry-gold'}`}
             >
               {link.name}
             </Link>
          ))}
          <Link 
            to="/login"
            className="ml-4 px-4 py-2 border border-heraldry-gold text-heraldry-blue hover:bg-heraldry-red hover:text-white hover:border-heraldry-red transition-colors flex items-center gap-2"
          >
            {user ? `Min Side (${user.role})` : 'Logg Inn'}
          </Link>
        </div>
        
        {/* Mobile menu toggle */}
        <div className="lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-heraldry-blue p-2 cursor-pointer">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-heraldry-bg border-b border-heraldry-gold shadow-xl p-6 flex flex-col gap-6 text-sm font-sans uppercase tracking-widest font-bold">
           {navLinks.map((link) => (
             <Link 
               key={link.path} 
               to={link.path}
               className={`${location.pathname === link.path ? 'text-heraldry-red' : 'text-heraldry-blue'}`}
             >
               {link.name}
             </Link>
          ))}
          <Link 
            to="/login"
            className="mt-4 pt-4 border-t border-heraldry-gold/30 text-heraldry-red"
          >
            {user ? 'Min Side' : 'Logg Inn'}
          </Link>
        </div>
      )}
    </nav>
  );
}

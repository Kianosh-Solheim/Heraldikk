import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Hjem', path: '/' },
    { name: 'Om oss', path: '/om-oss' },
    { name: 'Heraldikk', path: '/artikler' },
    { name: 'Våpenbrevet', path: '/vaapenbrev' },
    { name: 'Medlemmenes våpen', path: '/vaapenrulle' },
    { name: 'Kontakt oss', path: '/medlemskap' },
  ];

  return (
    <nav className="w-full relative z-50 flex flex-col items-center">
      {/* Top half (White block centered) */}
      <div className="w-full flex justify-center bg-transparent">
        <div className="bg-white w-full max-w-[1200px] h-[100px] md:h-[130px] lg:h-[150px] flex justify-center items-center relative z-20">
          
          {/* Overlapping Logo */}
          <div className="absolute left-4 md:left-8 lg:left-12 -bottom-[25px] md:-bottom-[30px] lg:-bottom-[40px] z-30 w-[90px] h-[90px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px]">
            <Link to="/">
              <img 
                src="/NHF_Logo_Segl.png" 
                alt="Norsk Heraldisk Forening Logo" 
                className="w-full h-full object-contain drop-shadow-md"
              />
            </Link>
          </div>

          <Link to="/" className="flex items-center justify-center h-full py-4">
            <img 
              src="/NHF_Logo_tekst.png" 
              alt="Norsk Heraldisk Forening" 
              className="h-[5vw] md:h-12 lg:h-16 object-contain"
            />
          </Link>
        </div>
      </div>
      
      {/* Bottom half (Black) */}
      <div className="bg-black w-full h-[50px] md:h-[60px] flex items-center justify-center shadow-lg relative z-10">
        {/* Mobile menu toggle */}
        <div className="lg:hidden absolute right-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2 cursor-pointer">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex w-full container mx-auto px-6 h-full items-center justify-center">
          <div className="flex items-center gap-6 lg:gap-10 xl:gap-14 text-sm lg:text-base font-serif text-white font-medium">
            {navLinks.map((link) => (
               <Link 
                 key={link.path} 
                 to={link.path}
                 className={`transition-colors hover:text-heraldry-gold ${location.pathname === link.path ? 'text-heraldry-gold' : 'text-white'}`}
               >
                 {link.name}
               </Link>
            ))}
            {user && (
              <Link 
                to="/login"
                className="transition-colors hover:text-heraldry-gold text-white"
              >
                Min Side
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black border-t border-gray-800 shadow-xl p-6 flex flex-col gap-6 text-base font-serif text-white font-medium z-50">
           {navLinks.map((link) => (
             <Link 
               key={link.path} 
               to={link.path}
               className={`hover:text-heraldry-gold transition-colors ${location.pathname === link.path ? 'text-heraldry-gold' : 'text-white'}`}
             >
               {link.name}
             </Link>
          ))}
          <Link 
            to="/login"
            className="pt-4 border-t border-gray-800 hover:text-heraldry-gold transition-colors text-white"
          >
            {user ? 'Min Side' : 'Logg Inn'}
          </Link>
        </div>
      )}
    </nav>
  );
}

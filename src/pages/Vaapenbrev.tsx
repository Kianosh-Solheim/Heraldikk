import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Vaapenbrev() {
  const { user } = useAuth();
  
  if (!user || user.role === 'visitor') {
    return (
      <div className="pt-8 min-h-[70vh] bg-heraldry-bg flex items-center justify-center">
        <div className="text-center bg-white p-12 border border-heraldry-gold/30 shadow-lg max-w-md">
           <h2 className="text-2xl font-serif text-heraldry-blue mb-4 italic">Våpenbrevet</h2>
           <p className="text-sm font-sans mb-8 opacity-80">Du må vere logga inn som medlem for å lese Våpenbrevet.</p>
           <Link to="/login" className="inline-block px-8 py-3 bg-heraldry-red text-heraldry-bg text-xs uppercase tracking-widest font-sans font-bold hover:bg-heraldry-red-dark transition-colors cursor-pointer">Logg Inn</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 min-h-screen bg-heraldry-bg">
      <div className="container mx-auto px-6 max-w-5xl py-12">
        <div className="mb-12">
          <span className="text-heraldry-red font-sans text-xs uppercase tracking-[0.3em] font-semibold block mb-2">Medlemsbladet</span>
          <h1 className="text-4xl md:text-5xl font-serif text-heraldry-blue font-light italic">Våpenbrevet</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white border border-heraldry-gold/20 p-8 flex flex-col items-center text-center">
            <div className="w-32 h-40 bg-heraldry-surface border border-heraldry-gold/50 mb-6 flex items-center justify-center shadow-inner">
               <span className="text-xs uppercase tracking-widest text-heraldry-blue opacity-50">Utgåve 112</span>
            </div>
            <h3 className="text-lg font-bold font-sans text-heraldry-blue uppercase tracking-widest mb-2">Våpenbrevet Nr. 112</h3>
            <p className="text-sm opacity-70 mb-6">Mars 2024</p>
            <button className="px-6 py-2 border border-heraldry-red text-heraldry-red text-xs uppercase tracking-widest font-bold hover:bg-heraldry-red hover:text-white transition-colors cursor-pointer">Last Ned PDF</button>
          </motion.div>

          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="bg-white border border-heraldry-gold/20 p-8 flex flex-col items-center text-center">
            <div className="w-32 h-40 bg-heraldry-surface border border-heraldry-gold/50 mb-6 flex items-center justify-center shadow-inner">
               <span className="text-xs uppercase tracking-widest text-heraldry-blue opacity-50">Utgåve 111</span>
            </div>
            <h3 className="text-lg font-bold font-sans text-heraldry-blue uppercase tracking-widest mb-2">Våpenbrevet Nr. 111</h3>
            <p className="text-sm opacity-70 mb-6">Desember 2023</p>
            <button className="px-6 py-2 border border-heraldry-red text-heraldry-red text-xs uppercase tracking-widest font-bold hover:bg-heraldry-red hover:text-white transition-colors cursor-pointer">Last Ned PDF</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

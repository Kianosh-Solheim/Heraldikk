import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Home() {
  const { articles, events } = useData();
  const pinnedArticles = articles.filter(a => a.isPinned).slice(0, 2);
  const upcomingEvents = events.slice(0, 2);

  return (
    <div className="flex-1 flex flex-col pt-8 min-h-[calc(100vh-6rem)]">
      <section className="flex-1 grid grid-cols-1 md:grid-cols-12 max-w-7xl mx-auto w-full px-6 gap-8 pb-12">
        <div className="col-span-1 md:col-span-8 flex flex-col justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <span className="text-heraldry-red font-sans text-xs uppercase tracking-[0.3em] font-semibold">Vår Misjon</span>
            <h1 className="text-5xl md:text-7xl font-serif text-heraldry-blue font-light leading-tight italic">
              Bevaring av den <br className="hidden md:block"/>
              <span className="font-bold not-italic">heraldiske arv</span> i Noreg
            </h1>
            <p className="text-sm md:text-base text-heraldry-blue opacity-80 max-w-xl font-sans leading-relaxed">
              Foreininga arbeider for å fremje kunnskap om heraldiske våpenmerke, segl, flagg og bumerke. Vi bistår med forsking, dokumentasjon og nyskaping av heraldisk kunst.
            </p>
            
            <div className="flex gap-12 items-end pt-8">
              <div className="space-y-2">
                <div className="text-3xl font-light">300+</div>
                <div className="text-[10px] uppercase tracking-widest font-sans opacity-50">Registrerte Våpen</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-light">1400+</div>
                <div className="text-[10px] uppercase tracking-widest font-sans opacity-50">Boktitlar i arkiv</div>
              </div>
            </div>
            <div className="pt-8">
              <Link to="/medlemskap" className="inline-block px-8 py-4 bg-heraldry-red text-heraldry-bg text-xs uppercase tracking-widest font-sans font-bold hover:bg-heraldry-red-dark shadow-lg transition-colors cursor-pointer">
                Bli Medlem Nå
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Featured Section */}
        <div className="col-span-1 md:col-span-4 border-l-0 md:border-l border-heraldry-gold/30 bg-heraldry-surface p-8 flex flex-col gap-8 h-full shadow-inner">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-heraldry-gold/20 pb-4">
              <h3 className="text-xs uppercase tracking-widest font-bold font-sans">Aktuelt</h3>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-widest text-heraldry-red font-bold">Festa artiklar</h4>
              {pinnedArticles.map((article) => (
                <Link to={`/artikler`} key={article.id} className="block group cursor-pointer">
                   <h4 className="text-sm font-bold leading-snug group-hover:text-heraldry-red transition-colors">{article.title}</h4>
                   <p className="text-[11px] opacity-60 mt-1">{article.date}</p>
                </Link>
              ))}
              <div className="pt-2">
                <Link to="/artikler" className="text-[10px] text-heraldry-red underline font-sans font-bold uppercase tracking-widest hover:text-heraldry-red-dark">Sjå fleire artiklar →</Link>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-heraldry-gold/20">
              <h4 className="text-[10px] uppercase tracking-widest text-heraldry-red font-bold">Komande arrangement</h4>
              {upcomingEvents.map((event) => (
                <Link to={`/arrangementer`} key={event.id} className="block group cursor-pointer">
                  <h4 className="text-sm font-bold leading-snug group-hover:text-heraldry-red transition-colors">{event.title}</h4>
                  <p className="text-[11px] opacity-60 mt-1">{event.date} • {event.location}</p>
                </Link>
              ))}
              <div className="pt-2">
                <Link to="/arrangementer" className="text-[10px] text-heraldry-red underline font-sans font-bold uppercase tracking-widest hover:text-heraldry-red-dark">Sjå fleire arrangement →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Shield, BookOpen, Users, Scroll } from 'lucide-react';
import { motion } from 'motion/react';

export function Hero() {
  return (
    <section id="hjem" className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-heraldry-bg z-0" />
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--color-heraldry-gold)_0%,_transparent_100%)] z-0" />
      
      <div className="container relative z-10 mx-auto px-6 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <span className="text-heraldry-red font-sans text-xs uppercase tracking-[0.3em] font-semibold mb-6 mt-4">Vår Misjon</span>
          
          <h1 className="text-5xl md:text-7xl font-serif text-heraldry-blue font-light leading-tight italic mb-8">
            Bevaring av den <br className="hidden md:block"/>
            <span className="font-bold not-italic">heraldiske arv</span> i Norge
          </h1>
          
          <p className="text-sm md:text-base text-heraldry-blue opacity-80 mb-12 max-w-2xl mx-auto font-sans leading-relaxed">
            Foreningen arbeider for å fremme kunnskap om heraldiske våpenmerker, segl, flagg og bumerker. Vi bistår med forskning, dokumentasjon og nyskaping av heraldisk kunst.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <a href="#avdeling" className="px-8 py-4 bg-heraldry-red text-heraldry-bg text-xs uppercase tracking-widest font-sans font-bold hover:bg-heraldry-red-dark shadow-lg transition-colors cursor-pointer">
              Bli Medlem Nå
            </a>
            <a href="#om-oss" className="px-8 py-4 bg-transparent border border-heraldry-gold text-heraldry-blue text-xs uppercase tracking-widest font-sans font-bold hover:bg-heraldry-gold/10 transition-colors shadow-sm cursor-pointer">
              Lær mer
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

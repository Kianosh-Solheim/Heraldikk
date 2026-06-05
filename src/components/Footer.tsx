import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="h-auto md:h-24 py-8 md:py-0 border-t border-heraldry-gold/30 px-6 md:px-12 flex flex-col md:flex-row gap-6 items-center justify-between bg-heraldry-blue text-heraldry-bg">
      <p className="text-[10px] uppercase tracking-widest opacity-60 font-sans text-center md:text-left">
        © {new Date().getFullYear()} Norsk Heraldisk Forening | Postboks 459, 0105 Oslo
      </p>
      <div className="flex gap-6 text-[10px] uppercase tracking-widest font-sans font-bold flex-wrap justify-center">
        <a href="#" className="hover:text-heraldry-gold transition-colors">Kontakt</a>
        <a href="#" className="hover:text-heraldry-gold transition-colors">Presse</a>
        <a href="#" className="hover:text-heraldry-gold transition-colors">English Summary</a>
      </div>
    </footer>
  );
}

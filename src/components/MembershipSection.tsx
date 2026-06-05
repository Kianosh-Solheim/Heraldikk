import { motion } from 'motion/react';
import { Mail, ChevronRight } from 'lucide-react';

export function MembershipSection() {
  return (
    <section id="avdeling" className="py-24 bg-heraldry-blue text-heraldry-bg relative overflow-hidden">
      {/* Abstract heraldic background elements */}
      <div className="absolute top-0 right-0 opacity-10 w-[600px] h-[600px] border border-heraldry-gold rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 opacity-10 w-[400px] h-[400px] bg-heraldry-red rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-6"
          >
            <span className="text-heraldry-gold font-sans text-xs uppercase tracking-[0.3em] font-semibold mb-6 block">Medlemskap</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight font-light italic">
              Utforsk din indre <br/>
              <span className="text-heraldry-gold font-bold not-italic">våpenbok</span>
            </h2>
            <p className="text-heraldry-bg opacity-70 text-sm mb-10 leading-relaxed font-sans">
              Som medlem får du tilgang til vårt innholdsrike medlemsblad <em>Våpenbrevet</em>, invitasjoner til møter og seminarer i Oslo og regionene, samt mulighet til å benytte vårt heraldiske bibliotek.
            </p>
            <ul className="space-y-4 mb-8 font-sans text-sm">
              {[
                "Årlig kontingent: 450 kr",
                "Tidsskriftet Våpenbrevet, 2-3 utgivelser i året",
                "Tilgang til eksklusive foredrag og utflukter",
                "Hjelp og fellesskap for egne våpenskjold"
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-4 text-heraldry-bg opacity-90 border-b border-heraldry-bg/10 pb-4">
                  <div className="w-1.5 h-1.5 bg-heraldry-gold rotate-45" />
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-6 bg-heraldry-bg p-8 md:p-12 relative border border-heraldry-gold/30 text-heraldry-blue shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xs uppercase tracking-widest font-bold font-sans">Søknad</h3>
               <div className="w-8 h-px bg-heraldry-red"></div>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-sans opacity-60 mb-2">Fullt navn</label>
                <input type="text" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 text-heraldry-blue focus:outline-none focus:border-heraldry-red transition-colors text-sm font-sans rounded-none" placeholder="Ola Nordmann" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-sans opacity-60 mb-2">E-postadresse</label>
                <input type="email" className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 text-heraldry-blue focus:outline-none focus:border-heraldry-red transition-colors text-sm font-sans rounded-none" placeholder="ola@eksempel.no" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-sans opacity-60 mb-2">Melding (Valgfritt)</label>
                <textarea rows={2} className="w-full px-0 py-2 bg-transparent border-b border-heraldry-blue/20 text-heraldry-blue focus:outline-none focus:border-heraldry-red transition-colors text-sm font-sans rounded-none resize-none" placeholder="Kort om din interesse..."></textarea>
              </div>
              <button type="submit" className="w-full bg-heraldry-red text-heraldry-bg text-xs uppercase tracking-widest font-sans font-bold py-4 hover:bg-heraldry-red-dark transition-colors flex justify-center items-center gap-2 mt-4 shadow-md">
                Send Innmelding
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

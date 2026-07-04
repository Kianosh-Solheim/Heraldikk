import React from 'react';
import { ShieldCheck, History, Palette } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const features = [
    {
      icon: <History className="w-8 h-8 text-heraldry-gold" />,
      title: "Historisk forankring",
      description: "Vi studerer og bevarer historiske slektsvåpen, kommunevåpen og riksvåpen. Heraldikken er ein nøkkel til vår fortid."
    },
    {
      icon: <Palette className="w-8 h-8 text-heraldry-red" />,
      title: "Heraldisk Kunst",
      description: "Foreininga er ein møteplass for utøvande heraldiske kunstnarar, og vi rettleier i nyskaping av våpen etter heraldiske reglar."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-heraldry-blue" />,
      title: "Rådgjeving",
      description: "Vi gjev råd til privatpersonar, kommunar og statlege organ om korrekt bruk og utforming av nye våpenskjold."
    }
  ];

  return (
    <div className="pt-8 min-h-screen bg-heraldry-bg">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif text-heraldry-blue mb-4 italic">Om Foreininga</h1>
            <div className="w-16 h-px bg-heraldry-gold mx-auto mb-8"></div>
            <p className="text-sm md:text-base text-heraldry-blue opacity-80 max-w-3xl mx-auto font-sans leading-relaxed">
              Norsk Heraldisk Forening (NHF) samlar alle med interesse for heraldikk, anten det er akademisk forsking, teikning og design, slektsgransking, eller rein kulturell interesse. 
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="group p-8 border border-heraldry-gold/20 bg-heraldry-surface hover:bg-white hover:border-heraldry-gold/60 transition-all duration-300 flex flex-col"
              >
                <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold font-sans uppercase tracking-[0.1em] text-heraldry-blue mb-4">{item.title}</h3>
                <p className="text-sm text-heraldry-blue opacity-70 leading-relaxed font-sans">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

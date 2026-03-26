import { motion } from 'framer-motion';
import FolkDivider from './FolkDivider';
import LanguageSelector from './LanguageSelector';

export default function HeroSection({ t, currentLang, onChangeLang }) {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          alt="Dunajec River Gorge"
          className="w-full h-full object-cover"
          src="https://svatomarianskaput.sk/wp-content/uploads/2021/08/3-17.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-goral-900/70 via-goral-900/50 to-goral-900/90" />
      </div>

      {/* Raftsman image floating */}
      <div className="absolute bottom-8 right-8 sm:right-16 animate-float hidden md:block">
        <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-2xl overflow-hidden border-4 border-goral-300/50 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
          <img
            alt="Pltnik na Dunajci"
            className="w-full h-full object-cover"
            src="https://ipravda.sk/res/2021/08/27/thumbs/pltnik-na-dunajci-nestandard1.jpg"
          />
        </div>
      </div>

      {/* Hero content */}
      <div className="relative max-w-4xl mx-auto px-4 py-20 sm:py-32 text-center z-10 w-full">
        <FolkDivider className="mb-8 opacity-60 justify-center" />

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-water text-5xl sm:text-7xl lg:text-8xl text-white mb-6 leading-tight"
          style={{ textShadow: 'rgba(0,0,0,0.4) 0px 4px 20px' }}
        >
          {t.hero_title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg sm:text-xl text-goral-200 font-body max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {t.hero_desc}
        </motion.p>

        <FolkDivider className="mb-10 opacity-60 justify-center" />

        {/* Info badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          {[
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "~2 hodiny" },
            { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", label: "6 zastavení" },
            { icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129", label: "10 jazykov" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-goral-800/60 backdrop-blur-sm rounded-lg px-5 py-3 border border-goral-500/30">
              <svg className="w-5 h-5 text-goral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="text-goral-100 text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-goral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>


    </section>
  );
}
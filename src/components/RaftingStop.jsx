import { motion } from 'framer-motion';
import AudioButton from './AudioButton';

export default function RaftingStop({ index, title, description, image, lang, t, isRtl }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="relative"
    >
      {/* Connection line */}
      {index > 0 && (
        <div className="absolute left-1/2 -top-8 w-px h-8 bg-gradient-to-b from-transparent to-primary/20" />
      )}

      {/* Stop number badge */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-lg font-bold shadow-lg shadow-primary/20 relative"
        >
          {index + 1}
          {/* Ripple */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
        </motion.div>
      </div>

      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-10 items-center`}>
        {/* Image */}
        <motion.div
          className="w-full md:w-1/2 relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img
              src={image}
              alt={title}
              className="w-full h-56 sm:h-64 md:h-72 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Folklorny dekoracia v rohu */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-white/50 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white/50 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-white/50 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-white/50 rounded-br-lg" />
          </div>
        </motion.div>

        {/* Text */}
        <div className={`w-full md:w-1/2 ${isRtl ? 'text-right' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-3 leading-tight">
            {title}
          </h3>
          <p className="font-body text-muted-foreground leading-relaxed mb-5 text-sm sm:text-base">
            {description}
          </p>
          <AudioButton text={description} lang={lang} t={t} />
        </div>
      </div>
    </motion.div>
  );
}
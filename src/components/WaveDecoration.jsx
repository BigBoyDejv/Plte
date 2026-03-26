import { motion } from 'framer-motion';

export default function WaveDecoration({ className = "", flip = false }) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
          fill="hsl(var(--primary))"
          fillOpacity="0.08"
          initial={{ d: "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" }}
          animate={{
            d: [
              "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z",
              "M0,80 C240,20 480,100 720,40 C960,80 1200,20 1440,80 L1440,120 L0,120 Z",
              "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z",
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,80 C320,40 640,100 960,60 C1120,40 1280,80 1440,70 L1440,120 L0,120 Z"
          fill="hsl(var(--accent))"
          fillOpacity="0.06"
          initial={{ d: "M0,80 C320,40 640,100 960,60 C1120,40 1280,80 1440,70 L1440,120 L0,120 Z" }}
          animate={{
            d: [
              "M0,80 C320,40 640,100 960,60 C1120,40 1280,80 1440,70 L1440,120 L0,120 Z",
              "M0,50 C320,90 640,30 960,70 C1120,90 1280,50 1440,60 L1440,120 L0,120 Z",
              "M0,80 C320,40 640,100 960,60 C1120,40 1280,80 1440,70 L1440,120 L0,120 Z",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
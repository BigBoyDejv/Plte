import React from 'react';

export default function AnimatedRiverWave() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-10 -mt-1 -mb-1">
      <svg
        className="relative block w-full h-12 sm:h-16 lg:h-20 text-goral-900"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"
          fill="currentColor"
          className="opacity-90"
        />
        <path
          d="M0,20 C200,80 450,10 700,60 C950,110 1100,30 1200,50 L1200,120 L0,120 Z"
          fill="currentColor"
          className="opacity-40"
        />
      </svg>
    </div>
  );
}

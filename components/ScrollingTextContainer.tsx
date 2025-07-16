'use client'

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const sentences = [
  "Building the new financial system.",
  "For everyone, by everyone.",
  "Join the revolution."
];

export default function ScrollingTextContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll progress
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Sentence 1: Fade in and stay
  const opacity1 = useTransform(smoothScroll, [0, 0.1], [0, 1]);
  const x1 = useTransform(smoothScroll, [0, 0.1], [-50, 0]);

  // Sentence 2: Fade in after sentence 1, and stay
  const opacity2 = useTransform(smoothScroll, [0.2, 0.3], [0, 1]);
  const x2 = useTransform(smoothScroll, [0.2, 0.3], [-50, 0]);

  // Sentence 3: Fade in after sentence 2, and stay
  const opacity3 = useTransform(smoothScroll, [0.4, 0.5], [0, 1]);
  const x3 = useTransform(smoothScroll, [0.4, 0.5], [-50, 0]);

  // Glimmer effect for all sentences towards the end
  const glimmerColor = useTransform(
    smoothScroll,
    [0.8, 0.9, 1],
    ["hsl(0, 0%, 100%)", "hsl(210, 40%, 80%)", "hsl(0, 0%, 100%)"]
  );

  return (
    <div ref={containerRef} className="h-[300vh] bg-black relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="flex flex-col items-start text-5xl font-bold text-white max-w-4xl space-y-6"
          style={{ color: glimmerColor }}
        >
          <motion.p style={{ opacity: opacity1, x: x1 }}>
            {sentences[0]}
          </motion.p>
          <motion.p style={{ opacity: opacity2, x: x2 }}>
            {sentences[1]}
          </motion.p>
          <motion.p style={{ opacity: opacity3, x: x3 }}>
            {sentences[2]}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

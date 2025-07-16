'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const FADE_UP_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="text-center"
      >
        <motion.h1
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="text-6xl font-bold"
        >
          0xAIF.eu
        </motion.h1>
        <motion.p
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="mt-3 text-2xl"
        >
          The hub for technical AI practitioners to solve real-world problems.
        </motion.p>
        <motion.div
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="mt-8 flex justify-center gap-4"
        >
          <Link href="/login" className="px-8 py-3 font-semibold rounded-md bg-white text-black">
            Join Community
          </Link>
          <Link href="/events" className="px-8 py-3 font-semibold rounded-md border border-gray-600">
            Explore Events
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

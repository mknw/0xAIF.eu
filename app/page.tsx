'use client'

import { motion, Variants, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { useRef, useState } from 'react'
import './animations.css'

/** --------------------------------------------------------------
 *  Page: 0xA1F.eu – Hero + Pinned Animated Sentences + Content
 *
 *  Behaviour requested by user:
 *    1. Hero shows initially; fades / scales away as user scrolls.
 *    2. Next section pins (sticky) while scrolling through its wrapper height.
 *    3. Three sentences animate in SEQUENTIALLY (slide‑in from left + fade‑in),
 *       stacking vertically and remaining fixed in place.
 *    4. Once all three are visible, they briefly "neon" highlight.
 *    5. Group then fades out; normal vertical scrolling resumes to content.
 *
 *  Implementation notes:
 *    • Uses native CSS sticky instead of imperative scroll‑lock.
 *    • Scroll progress normalised via useScroll(target, offset) per section.
 *    • useTransform maps the 0→1 progress to per‑sentence opacity/x.
 *    • Neon is a class toggle triggered by a threshold in the pinned section's progress.
 *    • Tailwind utility classes are used for layout; see minimal CSS additions below.
 *
 *  CSS additions (append to animations.css or global CSS):
 *  ------------------------------------------------------------------
 *  .neon-active li {
 *    color: #fff !important;
 *    text-shadow:
 *      0 0 4px #0ff,
 *      0 0 10px #0ff,
 *      0 0 20px #0ff,
 *      0 0 40px #00e8ff;
 *    animation: neon-flicker 1.5s infinite alternate;
 *  }
 *  @keyframes neon-flicker {
 *    0%   { opacity: 0.85; }
 *    49%  { opacity: 0.90; }
 *    50%  { opacity: 1; }
 *    100% { opacity: 0.88; }
 *  }
 *  ------------------------------------------------------------------
 */

/* ------------------------------------------------------------------
 *  Small reusable UI bits
 * ------------------------------------------------------------------ */
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700 rounded-lg p-6 h-full">
    <h3 className="text-2xl font-bold text-indigo-400 mb-4">{title}</h3>
    <div className="text-gray-300 space-y-3">{children}</div>
  </div>
)

const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <svg
      className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      ></path>
    </svg>
    <span>{children}</span>
  </li>
)

/* ------------------------------------------------------------------
 *  Hero Section (scroll‑reactive fade / scale)
 * ------------------------------------------------------------------ */
function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null)

  // Normalised progress while hero is scrolled out: 0 when top hits top, 1 when bottom leaves bottom.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  // Fade stays 1 until 10%, then drops to 0 by 15%.
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9])

  const FADE_UP_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  }

  return (
    <motion.div
      ref={heroRef}
      style={{ opacity: heroOpacity, scale: heroScale }}
      className="h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 sticky top-0"
    >
      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
        className="relative z-10"
      >
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-gray-400 text-lg">
          0xA1F.eu
        </motion.div>
        <motion.h1
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="text-4xl md:text-6xl font-bold tracking-tighter mt-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
        >
          AI Founders for Europe
        </motion.h1>
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mt-6 h-8 md:h-10">
          <TypeAnimation
            sequence={['> Coding sessions_', 1500, '> Debugging together_', 1500, '> Solving for reality_', 1500, '> Collaborating across Europe_', 1500]}
            wrapper="span"
            speed={50}
            className="text-xl md:text-2xl text-green-400 font-mono"
            repeat={Infinity}
          />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-2">
        <span>Scroll</span>
        <div className="mouse-icon"></div>
      </div>

      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute bottom-0 left-[-20%] right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
        <div className="absolute bottom-[-40%] right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------
 *  Pinned Sentences Section
 * ------------------------------------------------------------------ */
const SENTENCES = [
  'A community for those who code, research, and launch the next generation of AI solutions—side by side.',
  'At 0xAIF, founders and engineers don’t just talk about the future.',
  'We prototype it, ship it, and push it into production.'
]

function PinnedSentences() {
  const pinRef = useRef<HTMLDivElement | null>(null)
  // const [neon, setNeon] = useState(false)

  // progress 0 when top of wrapper hits viewport top; 1 when bottom leaves viewport bottom
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  })

  // per‑sentence ranges (tweak to taste)
  const makeRange = (i: number): [number, number] => [i * 0.1, 0.15 + i * 0.5]

  const xs = SENTENCES.map((_, i) => useTransform(scrollYProgress, makeRange(i), [-80, 0]))
  const ops = SENTENCES.map((_, i) => useTransform(scrollYProgress, makeRange(i), [0, 1]))

  // neon phase once all visible
  // const neonPhase = useTransform(scrollYProgress, [0.55, 0.60], [0, 1])
  // useMotionValueEvent(neonPhase, 'change', (v) => {
  //   // threshold ~1 => fully neon; <1 remove
  //   setNeon(v >= 1)
  // })

  // fade out whole stack (restore scroll) 0.70→0.90
  const stackOpacity = useTransform(scrollYProgress, [0.70, 0.90], [1, 0])

  return (
    <div ref={pinRef} className="h-[260vh] relative">
      <motion.ul
        style={{ opacity: stackOpacity }}
        className={`sticky top-0 h-screen flex flex-col items-center justify-center gap-8 px-4 text-lg md:text-xl leading-relaxed text-center text-gray-300 transition-colors duration-300`} //${neon ? 'neon-active' : ''}`}
      >
        {SENTENCES.map((txt, i) => (
          console.log('x:', xs[i], '\nops:', ops[i]),
          <motion.li key={i} style={{ x: xs[i], opacity: ops[i] }} className="max-w-3xl">
            {txt}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

/* ------------------------------------------------------------------
 *  Main Content (unchanged except for being pulled into a component)
 * ------------------------------------------------------------------ */
function MainContent({ FADE_UP_ANIMATION_VARIANTS }: { FADE_UP_ANIMATION_VARIANTS: Variants }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
      className="container mx-auto px-4 md:px-8 py-16 md:py-24 space-y-16"
    >
      {/* Connect, Collaborate, Solve */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <SectionCard title="Connect">
            <p>Meet technical founders, ML engineers, and applied researchers from across Europe.</p>
            <p>Share practical knowledge, open-source tools, and code snippets.</p>
          </SectionCard>
        </motion.div>
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <SectionCard title="Collaborate">
            <p>Spin up AI projects with peers—anything from micro-agents to full product launches.</p>
            <p>Find co-founders, contributors, or reviewers who speak your language (and stack).</p>
          </SectionCard>
        </motion.div>
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <SectionCard title="Solve Real Problems">
            <p>Tackle challenges from climate, health, industry, mobility, and more—together.</p>
            <p>Host and join hackathons, “problem jams”, and themed build weeks.</p>
            <p>Bring AI out of the lab, into real deployments.</p>
          </SectionCard>
        </motion.div>
      </div>

      {/* Community Features */}
      <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Community Features</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto text-left text-lg text-gray-300">
          <FeatureItem>
            <strong>Live coding sessions</strong> — Pair-programming, workshops, and build-alongs.
          </FeatureItem>
          <FeatureItem>
            <strong>Technical discussions & resource sharing</strong> — Real architectures, open source, and debugging help.
          </FeatureItem>
          <FeatureItem>
            <strong>Community events</strong> — Meetups, demo days, and founder circles.
          </FeatureItem>
          <FeatureItem>
            <strong>Open to AI-curious domain experts</strong> — If you have a real problem, you’re welcome.
          </FeatureItem>
          <FeatureItem>
            <strong>Opportunity board</strong> <em>(coming soon)</em>
          </FeatureItem>
          <FeatureItem>
            <strong>Partnered matchmaking</strong> <em>(coming soon)</em>
          </FeatureItem>
        </ul>
      </motion.div>

      {/* Partners */}
      <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Partners</h2>
        <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
          <div className="text-xl font-medium text-gray-400">AI Community Brussels</div>
          <div className="text-xl font-medium text-gray-400">North Star AI</div>
          <div className="text-xl font-medium text-gray-400">Langchain Meetup Event</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------
 *  Page component
 * ------------------------------------------------------------------ */
export default function Home() {
  const FADE_UP_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  }

  return (
    <div className="w-full bg-black text-white overflow-x-hidden">
      {/* Hero */}
      <Hero />

      {/* Pinned Sentences */}
      <PinnedSentences />

      {/* Rest of the content */}
      <div className="relative z-10 bg-black">
        <MainContent FADE_UP_ANIMATION_VARIANTS={FADE_UP_ANIMATION_VARIANTS} />
      </div>
    </div>
  )
}

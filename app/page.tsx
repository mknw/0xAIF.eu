'use client'

/**
 * 0xA1F.eu ‑ Home
 * ————————————————————————————————————————————————————————————————
 *  Spec (2025‑07‑18, rev‑2):
 *   1. Three sentences animate independently, sliding L→R & fading in.
 *   2. All three must finish before page continues; afterwards they neon‑glow
 *      briefly, fade up, then scroll resumes.
 *   3. Sticky‑pin kept **simple**: browser native `position:sticky` with tall
 *      wrapper.  If a browser still glitches, removing sticky will not break
 *      the timeline because we also drive opacity and x‑offset via scroll.
 *
 *  Extras delivered in this version
 *   • Restored “Connect / Collaborate / Solve” grid + feature list + partners.
 *   • Added subtle neon flicker to the sentences (CSS keyframes).
 *   • Polished timing & easing; hero blurs + parallax blobs for depth.
 */

import {
  motion,
  Variants,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { useRef } from 'react'
import './animations.css'

/* ——————————————————  small reusable bits  —————————————————— */
const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
}

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700 rounded-lg p-6 h-full">
    <h3 className="text-2xl font-bold text-indigo-400 mb-4">{title}</h3>
    <div className="text-gray-300 space-y-3">{children}</div>
  </div>
)
const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
    <span>{children}</span>
  </li>
)

const SENTENCES = [
  'A community for those who code, research, and launch the next generation of AI solutions—side by side.',
  'At 0xAIF, founders and engineers don’t just talk about the future.',
  'We prototype it, ship it, and push it into production.',
] as const

/* ———————————————————  component  ———————————————————— */
export default function Home() {
  /* HERO ------------------------------------------------------------------ */
  const rootRef = useRef(null)
  const { scrollYProgress: rootProg } = useScroll({
    target: rootRef,
    offset: ['start start', 'end end'],
  })
  const heroOpacity = useTransform(rootProg, [0, 0.1, 0.14], [1, 1, 0])
  const heroScale   = useTransform(rootProg, [0, 0.14], [1, 0.9])

  /* SENTENCES ------------------------------------------------------------- */
  const pinRef = useRef(null)
  const { scrollYProgress: pinProg } = useScroll({
    target: pinRef,
    offset: ['start end', 'end start'], // key offset per user discovery
  })
  const sentenceRange = (i: number): [number, number] => [0.1 + i * 0.15, 0.28 + i * 0.15]
  const xs   = SENTENCES.map((_, i) => useTransform(pinProg, sentenceRange(i), [-140, 0]))
  const ops  = SENTENCES.map((_, i) => useTransform(pinProg, sentenceRange(i), [0, 1]))

  /* neon flicker once fully visible (≥0.6) -------------------------------- */
  const neonOn = useTransform(pinProg, [0.6, 0.65], [0, 1])
  useMotionValueEvent(neonOn, 'change', v => {
    document.body.classList.toggle('neon-active', v >= 1)
  })

  /* fade whole stack out 0.75‑→0.9 --------------------------------------- */
  const stackOpacity = useTransform(pinProg, [0.75, 0.9], [1, 0])

  /* RENDER ================================================================ */
  return (
    <div ref={rootRef} className="w-full bg-black text-white overflow-x-hidden">
      {/* ─── Hero ─── */}
      <motion.header style={{ opacity: heroOpacity, scale: heroScale }} className="h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 sticky top-0">
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }} className="relative z-10">
          <motion.div variants={FADE_UP} className="text-gray-400 text-lg">0xA1F.eu</motion.div>
          <motion.h1 variants={FADE_UP} className="text-4xl md:text-6xl font-bold tracking-tighter mt-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">AI Founders for Europe</motion.h1>
          <motion.div variants={FADE_UP} className="mt-6 h-8 md:h-10">
            <TypeAnimation
              sequence={[
                '> Coding sessions_', 1500,
                '> Debugging together_', 1500,
                '> Solving for reality_', 1500,
                '> Collaborating across Europe_', 1500,
              ]}
              wrapper="span"
              speed={50}
              className="text-xl md:text-2xl text-green-400 font-mono"
              repeat={Infinity}
            />
          </motion.div>
        </motion.div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-2">
          <span>Scroll</span>
          <div className="mouse-icon" />
        </div>
        {/* decorative blobs */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute -left-1/4 top-1/4 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),transparent)]" />
          <div className="absolute right-[-15%] bottom-[-20%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,255,255,.15),transparent)]" />
        </div>
      </motion.header>

      {/* ─── Pinned Sentences ─── */}
      <div ref={pinRef} className="h-[90vh] relative">
        <motion.ul style={{ opacity: stackOpacity }} className="sticky top-0 h-screen flex flex-col items-center justify-center gap-8 px-4 text-lg md:text-xl leading-relaxed text-center text-gray-300 pointer-events-none">
          {SENTENCES.map((txt, i) => (
            <motion.li key={i} style={{ x: xs[i], opacity: ops[i] }} className="max-w-3xl select-none py-12 text-2xl md:text-3xl">
              {txt}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* ─── Main Content ─── */}
      <motion.main initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }} className="container mx-auto px-4 md:px-8 py-20 md:py-28 space-y-24 bg-black">
        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={FADE_UP}><SectionCard title="Connect"><p>Meet technical founders, ML engineers, and applied researchers from across Europe.</p><p>Share practical knowledge, open‑source tools, and code snippets.</p></SectionCard></motion.div>
          <motion.div variants={FADE_UP}><SectionCard title="Collaborate"><p>Spin up AI projects with peers—anything from micro‑agents to full product launches.</p><p>Find co‑founders, contributors, or reviewers who speak your language (and stack).</p></SectionCard></motion.div>
          <motion.div variants={FADE_UP}><SectionCard title="Solve Real Problems"><p>Tackle challenges from climate, health, industry, mobility, and more.</p><p>Host and join hackathons, “problem jams”, and themed build weeks.</p><p>Bring AI out of the lab, into real deployments.</p></SectionCard></motion.div>
        </div>

        {/* features */}
        <motion.section variants={FADE_UP} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Community Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto text-left text-lg text-gray-300">
            <FeatureItem><strong>Live coding sessions</strong> — Pair‑programming, workshops, build‑alongs.</FeatureItem>
            <FeatureItem><strong>Technical discussions & resource sharing</strong> — Real architectures, open source, debugging help.</FeatureItem>
            <FeatureItem><strong>Community events</strong> — Meetups, demo days, founder circles.</FeatureItem>
            <FeatureItem><strong>Open to AI‑curious domain experts</strong> — If you have a real problem, you’re welcome.</FeatureItem>
            <FeatureItem><strong>Opportunity board</strong> <em>(coming soon)</em></FeatureItem>
            <FeatureItem><strong>Partnered matchmaking</strong> <em>(coming soon)</em></FeatureItem>
          </ul>
        </motion.section>

        {/* partners */}
        <motion.section variants={FADE_UP} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Our Partners</h2>
          <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap text-xl font-medium text-gray-400">
            <span>AI Community Brussels</span>
            <span>North Star AI</span>
            <span>Langchain Meetup Event</span>
          </div>
        </motion.section>
      </motion.main>
    </div>
  )
}

/* ——————————————————  Neon CSS (animations.css)  —————————————————— */
/*
.neon-active li {
  color: #fff;
  text-shadow:
    0 0 6px #0ff,
    0 0 12px #0ff,
    0 0 20px #0ff,
    0 0 30px #08f,
    0 0 40px #08f,
    0 0 55px #08f,
    0 0 75px #08f;
  animation: flicker 1.6s linear infinite alternate;
}
@keyframes flicker {
 	from { opacity: 0.92; }
  50%  { opacity: 1;    }
  to   { opacity: 0.93; }
}
*/



// 'use client'

// import {
//   motion,
//   Variants,
//   useScroll,
//   useTransform,
//   useMotionValueEvent,
// } from 'framer-motion'
// import { TypeAnimation } from 'react-type-animation'
// import { useRef } from 'react'
// import './animations.css'

// /**
//  * ---------------------------------------------------------------------------
//  *  0xA1F.eu – Home page   (React + Framer Motion v11)
//  *
//  *  Spec (2025‑07‑18):
//  *   1. Three sentences animate **independently** (slide in L→R, fade‑in).
//  *   2. They appear while the stack is **pinned** (position:sticky) – vertical
//  *      scroll is effectively paused until all three are fully visible.
//  *   3. Only after the final line completes do we fade the stack out, then the
//  *      normal page flow resumes.
//  *
//  *  Approach
//  *   - A tall wrapper (260 vh) provides scroll distance.
//  *   - The UL inside is sticky top‑0 / h‑screen, so it stays centred while the
//  *     wrapper scrolls beneath – no explicit scroll‑lock needed.
//  *   - `useScroll` (target: wrapper) gives 0→1 progress for the wrapper.
//  *   - `useTransform` maps progress to x & opacity for each sentence.
//  *   - Another transform cross‑fades the entire stack out once all lines are in.
//  *
//  *  NB:  The pattern mirrors the “progress‑circle” example in motion.dev – we
//  *       rely on the browser’s native sticky behaviour rather than toggling
//  *       body overflow.
//  * ---------------------------------------------------------------------------
//  */

// /* ───────────────────────────  helpers  ────────────────────────── */
// const FADE_UP: Variants = {
//   hidden: { opacity: 0, y: 10 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { type: 'spring', stiffness: 100 },
//   },
// }

// const SENTENCES = [
//   'A community for those who code, research, and launch the next generation of AI solutions—side by side.',
//   'At 0xAIF, founders and engineers don’t just talk about the future.',
//   'We prototype it, ship it, and push it into production.',
// ] as const

// /* ─────────────────────────────  page  ─────────────────────────── */
// export default function Home() {
//   /* hero transforms ------------------------------------------------ */
//   const rootRef   = useRef(null)
//   const { scrollYProgress: rootProg } = useScroll({
//     target:         rootRef,
//     offset:         ['start start', 'end end'],
//   })
//   const heroOpacity = useTransform(rootProg, [0, 0.1, 0.14], [1, 1, 0])
//   const heroScale   = useTransform(rootProg, [0, 0.14], [1, 0.9])

//   /* pinned‑sentences ------------------------------------------------ */
//   const pinRef = useRef(null)
//   const { scrollYProgress: pinProg } = useScroll({
//     target: pinRef,
//     offset: ['start end', 'end start'], // 0 when wrapper top hits viewport top; 1 when bottom leaves
//   })

//   /* per‑sentence transforms (slide in L→R, fade‑in) */
//   const makeRange = (i: number): [number, number] => [0.1 + i * 0.10, 0.22 + i * 0.22]
//   const xs        = SENTENCES.map((_, i) => useTransform(pinProg, makeRange(i), [-120, 0]))
//   const opacs     = SENTENCES.map((_, i) => useTransform(pinProg, makeRange(i), [0, 1]))
//   console.log('xs', xs)
//   console.log('opacs', opacs)

//   /* fade whole stack out once everything is fully in (0.75‑>0.92) */
//   const stackOpacity = useTransform(pinProg, [0.75, 0.92], [1, 0])

//   /* ───────────────────────────  render  ────────────────────────── */
//   return (
//     <div ref={rootRef} className="w-full bg-black text-white overflow-x-hidden">
//       {/* ─── Hero ─── */}
//       <motion.header
//         style={{ opacity: heroOpacity, scale: heroScale }}
//         className="h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 sticky top-0"
//       >
//         <motion.div
//           initial="hidden"
//           animate="show"
//           variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
//           className="relative z-10"
//         >
//           <motion.div variants={FADE_UP} className="text-gray-400 text-lg">
//             0xA1F.eu
//           </motion.div>
//           <motion.h1
//             variants={FADE_UP}
//             className="text-4xl md:text-6xl font-bold tracking-tighter mt-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
//           >
//             AI Founders for Europe
//           </motion.h1>
//           <motion.div variants={FADE_UP} className="mt-6 h-8 md:h-10">
//             <TypeAnimation
//               sequence={[
//                 '> Coding sessions_',
//                 1500,
//                 '> Debugging together_',
//                 1500,
//                 '> Solving for reality_',
//                 1500,
//                 '> Collaborating across Europe_',
//                 1500,
//               ]}
//               wrapper="span"
//               speed={50}
//               className="text-xl md:text-2xl text-green-400 font-mono"
//               repeat={Infinity}
//             />
//           </motion.div>
//         </motion.div>
//         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-2">
//           <span>Scroll</span>
//           <div className="mouse-icon" />
//         </div>
//         {/* subtle radial blobs */}
//         <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
//           <div className="absolute bottom-0 left-[-20%] right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
//           <div className="absolute bottom-[-40%] right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
//         </div>
//       </motion.header>

//       {/* ─── Pinned Animated Sentences ─── */}
//       <div ref={pinRef} className="h-[100vh] flex">
//         <motion.ul
//           style={{ opacity: stackOpacity }}
//           className="sticky top-24 h-screen flex flex-col items-center justify-center gap-8 px-4 text-lg md:text-xl leading-relaxed text-center text-gray-300"
//         >
//           {SENTENCES.map((text, i) => (
//             <motion.li
//               key={i}
//               style={{ x: xs[i], opacity: opacs[i] }}
//               className="max-w-3xl my-12 text-2xl md:text-3xl"
//             >
//               {text}
//             </motion.li>
//           ))}
//         </motion.ul>
//       </div>

//       {/* ─── Rest of content (placeholder) ─── */}
//       <section className="min-h-[120vh] px-4 md:px-8 py-24 bg-black">
//         <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
//           More to explore soon …
//         </h2>
//         <p className="max-w-2xl mx-auto text-gray-400 text-center text-lg">
//           This section is a stub. Plug your long‑form content, feature grid, or
//           partner list here – it will appear only after the pinned headline
//           has finished.
//         </p>
//       </section>
//     </div>
//   )
// }
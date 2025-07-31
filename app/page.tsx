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
  MotionValue,
} from 'framer-motion'
import { Terminal, MessagesSquare, Calendar, BrainCircuit, Briefcase, HeartHandshake } from 'lucide-react'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import {TypeAnimation} from 'react-type-animation'

const BlueprintHero = dynamic(() => import('../components/BlueprintHero'), { ssr: false })
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
const FeatureItem = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
  <li className="flex items-start gap-4">
    <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mt-1">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="pt-0.5">{children}</span>
  </li>
)

const SENTENCES = [
  'A community for those who code, research, and launch the next generation of AI solutions—side by side.',
  'At 0xAIF, founders and engineers don’t just talk about the future.',
  'We prototype it, ship it, and push it into production.',
] as const

function Sentence({
  i,
  pinProg,
  children,
}: {
  i: number
  pinProg: MotionValue<number>
  children: React.ReactNode
}) {
  const sentenceRange = (i: number): [number, number] => [
    0.1 + i * 0.15,
    0.28 + i * 0.15,
  ]
  const x = useTransform(pinProg, sentenceRange(i), [-140, 0])
  const opacity = useTransform(pinProg, sentenceRange(i), [0, 1])

  return (
    <motion.li style={{ x, opacity }} className="max-w-3xl my-12 text-2xl md:text-3xl">
      {children}
    </motion.li>
  )
}

/* ———————————————————  component  ———————————————————— */
export default function Home() {


  /* SENTENCES ------------------------------------------------------------- */
  const pinRef = useRef(null)
  const { scrollYProgress: pinProg } = useScroll({
    target: pinRef,
    offset: ['start end', 'end start'], // key offset per user discovery
  })


  /* neon flicker once fully visible (≥0.6) -------------------------------- */
  const neonOn = useTransform(pinProg, [0.6, 0.65], [0, 1])
  useMotionValueEvent(neonOn, 'change', (v: number) => {
    document.body.classList.toggle('neon-active', v >= 1)
  })

  /* fade whole stack out 0.75‑→0.9 --------------------------------------- */
  const stackOpacity = useTransform(pinProg, [0.75, 0.9], [1, 0])

  /* RENDER ================================================================ */
  return (
    <div className="w-full bg-black text-white overflow-x-hidden">
      {/* ─── Hero ─── */}
      <header className="h-screen flex flex-col items-center justify-center text-center px-4 md:px-8">
        <BlueprintHero />

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

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-2 pointer-events-none">
          <span>Scroll</span>
          <div className="mouse-icon" />
        </div>
        {/* decorative blobs */}
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
          <div className="absolute left-[-20%] top-[-30%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,255,.15),transparent)]" />
          <div className="absolute right-[-15%] bottom-[-20%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,255,255,.15),transparent)]" />
        </div>
      </header>

      {/* ─── Pinned Sentences ─── */}
      <div ref={pinRef} className="h-[90vh] relative">
        <motion.ul style={{ opacity: stackOpacity }} className="sticky top-0 h-screen flex flex-col items-center justify-center gap-8 px-4 text-lg md:text-xl leading-relaxed text-center text-gray-300 pointer-events-none">
          {SENTENCES.map((txt, i) => (
            <Sentence key={i} i={i} pinProg={pinProg}>
              {txt}
            </Sentence>
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
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl mx-auto text-left text-lg text-gray-300">
            <FeatureItem icon={Terminal}><strong>Live coding sessions</strong> — Pair‑programming, workshops, build‑alongs.</FeatureItem>
            <FeatureItem icon={MessagesSquare}><strong>Technical discussions & resource sharing</strong> — Real architectures, open source, debugging help.</FeatureItem>
            <FeatureItem icon={Calendar}><strong>Community events</strong> — Meetups, demo days, founder circles.</FeatureItem>
            <FeatureItem icon={BrainCircuit}><strong>Open to AI‑curious domain experts</strong> — If you have a real problem, you’re welcome.</FeatureItem>
            <FeatureItem icon={Briefcase}><strong>Opportunity board</strong> <em>(coming soon)</em></FeatureItem>
            <FeatureItem icon={HeartHandshake}><strong>Partnered matchmaking</strong> <em>(coming soon)</em></FeatureItem>
          </ul>
        </motion.section>

        {/* partners */}
        <motion.section variants={FADE_UP} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Our Partners</h2>
          <div className="flex justify-center items-center gap-4 md:gap-6 flex-wrap text-lg text-gray-300">
            <a href="#" target="https://www.meetup.com/data-science-community-meetup/" rel="noopener noreferrer" className="bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700 rounded-full px-6 py-3 transition-colors">AI Community Belgium</a>
            <a href="#" target="https://www.ns2agi.com/" rel="noopener noreferrer" className="bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700 rounded-full px-6 py-3 transition-colors">North Star AI</a>
            {/* <a href="#" target="_blank" rel="noopener noreferrer" className="bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700 rounded-full px-6 py-3 transition-colors">Langchain Meetup</a> */}
            <a href="https://commonshub.brussels" target="_blank" rel="noopener noreferrer" className="bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700 rounded-full px-6 py-3 transition-colors">Commons Hub Brussels</a>
          </div>
        </motion.section>
      </motion.main>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-gray-900/80 to-black" />
    </div>
  )
}

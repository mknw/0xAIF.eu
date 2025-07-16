'use client'

import { motion, Variants, useReducedMotion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { TypeAnimation } from 'react-type-animation'
import Link from 'next/link'
import { Users, Code, Rocket, BrainCircuit, Zap, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'


const SectionCard = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
  <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700 rounded-lg p-6 h-full">
    <div className="flex items-center gap-4 mb-4">
      <div className="text-indigo-400">{icon}</div>
      <h3 className="text-2xl font-bold text-indigo-400">{title}</h3>
    </div>
    <div className="text-gray-300 space-y-3">{children}</div>
  </div>
);

const FeatureItem = ({ icon, children }: { icon: ReactNode, children: ReactNode }) => (
  <li className="flex items-start gap-3">
    <div className="text-indigo-400 flex-shrink-0 mt-1">{icon}</div>
    <span>{children}</span>
  </li>
);



export default function Home() {
  const shouldReduceMotion = useReducedMotion()
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y1 = useTransform(heroScroll, [0, 1], ['0%', '50%'])
  const y2 = useTransform(heroScroll, [0, 1], ['0%', '-150%'])

  const FADE_UP_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  }

  return (
    <div className="w-full bg-black text-white overflow-x-hidden">
      <main ref={heroRef} className="flex min-h-screen flex-col items-center justify-center text-center px-4 md:px-8 relative overflow-hidden">
        <motion.div initial="hidden" animate="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }} className="relative z-10">
          <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            0xA1F.eu
          </motion.h1>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-gray-400 text-lg md:text-xl mt-2">
            AI Founders for Europe
          </motion.div>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mt-6 h-8 md:h-10">
            <TypeAnimation sequence={['> Coding sessions_', 1500, '> Debugging together_', 1500, '> Solving for reality_', 1500, '> Collaborating across Europe_', 1500]} wrapper="span" speed={50} className="text-xl md:text-2xl text-green-400 font-mono" repeat={Infinity} />
          </motion.div>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex justify-center gap-4 mt-12">
            <Link href="/login" className="px-8 py-3 font-semibold rounded-md bg-white text-black transition-transform duration-300 ease-in-out hover:scale-105">Join Community</Link>
            <Link href="/events" className="px-8 py-3 font-semibold rounded-md border border-gray-600 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gray-800/50">Explore Events</Link>
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 z-0 opacity-20">
          <motion.div style={{ y: shouldReduceMotion ? 0 : y1 }} className="absolute bottom-0 left-[-20%] right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></motion.div>
          <motion.div style={{ y: shouldReduceMotion ? 0 : y2 }} className="absolute bottom-[-40%] right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(90,0,255,.15),rgba(255,255,255,0))]"></motion.div>
        </div>
      </main>

      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-6 text-2xl md:text-3xl font-medium">
          <p>A community for those who code, research, and launch the next generation of AI solutions—side by side.</p>
          <p>At 0xAIF, founders and engineers don’t just talk about the future.</p>
          <p>We prototype it, ship it, and push it into production.</p>
        </div>
      </div>

      <motion.div initial="hidden" whileInView={shouldReduceMotion ? undefined : 'show'} viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }} className="container mx-auto px-4 md:px-8 py-16 md:py-24 space-y-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS}><SectionCard title="Connect" icon={<Users size={24}/>}><p>Meet technical founders, ML engineers, and applied researchers from across Europe.</p><p>Share practical knowledge, open-source tools, and code snippets.</p></SectionCard></motion.div>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS}><SectionCard title="Collaborate" icon={<Code size={24}/>}><p>Spin up AI projects with peers—anything from micro-agents to full product launches.</p><p>Find co-founders, contributors, or reviewers who speak your language (and stack).</p></SectionCard></motion.div>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS}><SectionCard title="Solve Real Problems" icon={<Rocket size={24}/>}><p>Tackle challenges from climate, health, industry, mobility, and more—together.</p><p>Host and join hackathons, “problem jams”, and themed build weeks.</p><p>Bring AI out of the lab, into real deployments.</p></SectionCard></motion.div>
        </div>

        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Community Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto text-left text-lg text-gray-300">
            <FeatureItem icon={<Zap size={20}/>}><strong>Live coding sessions</strong> — Pair-programming, workshops, and build-alongs.</FeatureItem>
            <FeatureItem icon={<BrainCircuit size={20}/>}><strong>Technical discussions & resource sharing</strong> — Real architectures, open source, and debugging help.</FeatureItem>
            <FeatureItem icon={<Users size={20}/>}><strong>Community events</strong> — Meetups, demo days, and founder circles.</FeatureItem>
            <FeatureItem icon={<Wrench size={20}/>}><strong>Open to AI-curious domain experts</strong> — If you have a real problem, you’re welcome.</FeatureItem>
            <FeatureItem icon={<Rocket size={20}/>}><strong>Opportunity board</strong> <em>(coming soon)</em></FeatureItem>
            <FeatureItem icon={<Code size={20}/>}><strong>Partnered matchmaking</strong> <em>(coming soon)</em></FeatureItem>
          </ul>
        </motion.div>

        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Partners</h2>
          <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
            {[ 'AI Community Brussels', 'North Star AI', 'Langchain Meetup Event' ].map((partner) => (
              <motion.div key={partner} whileHover={shouldReduceMotion ? {} : { scale: 1.05, filter: 'drop-shadow(0 0 0.5rem #ffffff40)' }} transition={{ type: 'spring', stiffness: 300 }} className="text-xl font-medium text-gray-400 cursor-pointer">{partner}</motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

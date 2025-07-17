'use client'

import { motion, Variants, useScroll, useTransform } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { useRef } from 'react'
import './animations.css'

// A reusable component for section cards with glassmorphism
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700 rounded-lg p-6 h-full">
    <h3 className="text-2xl font-bold text-indigo-400 mb-4">{title}</h3>
    <div className="text-gray-300 space-y-3">{children}</div>
  </div>
);

// A reusable component for feature list items
const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
    <span>{children}</span>
  </li>
);

export default function Home() {
  const FADE_UP_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  }

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9])

  const sentence1Opacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1])
  const sentence2Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1])
  const sentence3Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])

  return (
    <div ref={containerRef} className="w-full bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
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
          <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-4xl md:text-6xl font-bold tracking-tighter mt-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            AI Founders for Europe
          </motion.h1>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mt-6 h-8 md:h-10">
            <TypeAnimation
              sequence={[
                '> Coding sessions_',
                1500,
                '> Debugging together_',
                1500,
                '> Solving for reality_',
                1500,
                '> Collaborating across Europe_',
                1500,
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
          <div className="mouse-icon"></div>
        </div>
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute bottom-0 left-[-20%] right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
          <div className="absolute bottom-[-40%] right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
        </div>
      </motion.div>

      {/* Animated Sentences Section */}
      <div className="h-[180vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed text-center">
            <motion.p style={{ opacity: sentence1Opacity }}>
              A community for those who code, research, and launch the next generation of AI solutions—side by side.
            </motion.p>
            <motion.p style={{ opacity: sentence2Opacity }} className="mt-8">
              At 0xAIF, founders and engineers don’t just talk about the future.
            </motion.p>
            <motion.p style={{ opacity: sentence3Opacity }} className="mt-8">
              We prototype it, ship it, and push it into production.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="relative z-10 bg-black">
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
              <FeatureItem><strong>Live coding sessions</strong> — Pair-programming, workshops, and build-alongs.</FeatureItem>
              <FeatureItem><strong>Technical discussions & resource sharing</strong> — Real architectures, open source, and debugging help.</FeatureItem>
              <FeatureItem><strong>Community events</strong> — Meetups, demo days, and founder circles.</FeatureItem>
              <FeatureItem><strong>Open to AI-curious domain experts</strong> — If you have a real problem, you’re welcome.</FeatureItem>
              <FeatureItem><strong>Opportunity board</strong> <em>(coming soon)</em></FeatureItem>
              <FeatureItem><strong>Partnered matchmaking</strong> <em>(coming soon)</em></FeatureItem>
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
      </div>
    </div>
  );
}

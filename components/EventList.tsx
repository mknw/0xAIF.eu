'use client'

import { motion, Variants } from 'framer-motion'
import EventCard from '@/components/EventCard'

// This type definition should ideally be shared across components
type Rsvp = {
  user_id: string
}
type EventWithRsvps = {
  id: number;
  created_at: string;
  name: string;
  description: string | null;
  event_date: string;
  location: string | null;
  organizer_id: string | null;
  rsvps: Rsvp[];
}

const FADE_UP_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
}

export default function EventList({ events, userId }: { events: EventWithRsvps[], userId: string | undefined }) {
  return (
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {events.map((event) => (
        <motion.div key={event.id} variants={FADE_UP_ANIMATION_VARIANTS}>
          <EventCard event={event} userId={userId} />
        </motion.div>
      ))}
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Trash2 } from 'lucide-react'
import { deleteEvent } from '@/app/events/actions'

// Define the types manually for now.
// In a real-world scenario, these would be generated from your Supabase schema.
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

export default function EventCard({ event, userId, canCreateEvents }: { event: EventWithRsvps, userId: string | undefined, canCreateEvents: boolean }) {
  const supabase = createClient()
  const [isRsvpd, setIsRsvpd] = useState(() => {
    if (!userId) return false
    return event.rsvps.some(rsvp => rsvp.user_id === userId)
  })
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    const result = await deleteEvent(event.id)
    if (result?.error) {
      alert('Error deleting event: ' + result.error)
      setLoading(false)
    }
    // On success, the action will revalidate and redirect, so no need to setLoading(false) here.
  }

  const handleRsvp = async () => {
    if (!userId) {
      alert('You must be logged in to RSVP.')
      return
    }

    setLoading(true)
    if (isRsvpd) {
      // Delete RSVP
      const { error } = await supabase.from('rsvps').delete().match({ event_id: event.id, user_id: userId })
      if (error) {
        alert('Error removing RSVP: ' + error.message)
      } else {
        // Manually update the count for immediate feedback
        event.rsvps = event.rsvps.filter(r => r.user_id !== userId)
        setIsRsvpd(false)
      }
    } else {
      // Insert RSVP
      const { error } = await supabase.from('rsvps').insert({ event_id: event.id, user_id: userId })
      if (error) {
        alert('Error adding RSVP: ' + error.message)
      } else {
        // Manually update the count for immediate feedback
        event.rsvps.push({ user_id: userId })
        setIsRsvpd(true)
      }
    }
    setLoading(false)
  }

  const eventDate = new Date(event.event_date)

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
      <div className="p-6">
        <p className="text-sm text-indigo-400 font-semibold">{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h3 className="text-2xl font-bold text-white mt-2">{event.name}</h3>
        <p className="text-gray-400 mt-1">{event.location || 'Location TBD'}</p>
        <p className="text-gray-300 mt-4 h-24 overflow-hidden text-ellipsis">{event.description}</p>
        <div className="mt-6 flex justify-between items-center">
          <span className="text-gray-400">{event.rsvps.length} going</span>
          <div className="flex items-center gap-2">
            {userId && canCreateEvents && (
              <>
                <Link
                  href={`/events/${event.id}/edit`}
                  className="px-4 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="p-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                  aria-label="Delete event"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={handleRsvp}
              disabled={loading || !userId}
              className={`px-4 py-2 rounded-md font-semibold text-white transition-colors ${
                isRsvpd
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? '...' : isRsvpd ? 'Cancel RSVP' : 'RSVP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

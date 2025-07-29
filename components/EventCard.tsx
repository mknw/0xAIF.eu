'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { deleteEvent } from '@/app/events/actions'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Define the types based on your table structure
export type Event = {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string | null;
  organizer_id: string;
  created_at: string;
}

export type Rsvp = {
  user_id: string;
}

export type EventWithRsvps = Event & {
  rsvps: Rsvp[];
}

export default function EventCard({ event, userId, canCreateEvents }: { event: EventWithRsvps, userId: string | undefined, canCreateEvents: boolean }) {
  const supabase = createClient()
  const router = useRouter()
  const [isRsvpd, setIsRsvpd] = useState(() => {
    if (!userId) return false
    return event.rsvps.some(rsvp => rsvp.user_id === userId)
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Stop propagation for button clicks to prevent navigating
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleRsvp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonClick(e)
    if (!userId) return
    setLoading(true)

    if (isRsvpd) {
      const { error } = await supabase.from('rsvps').delete().match({ event_id: event.id, user_id: userId })
      if (!error) setIsRsvpd(false)
    } else {
      const { error } = await supabase.from('rsvps').insert({ event_id: event.id, user_id: userId })
      if (!error) setIsRsvpd(true)
    }
    setLoading(false)
    router.refresh() // Refresh data on the page
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonClick(e)
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }
    setDeleting(true)
    await deleteEvent(event.id)
    setDeleting(false)
    // The page should be refreshed by the server action's revalidatePath
  }
  
  const handleEditClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleButtonClick(e);
    router.push(`/events/${event.id}/edit`);
  };

  const eventDate = new Date(event.event_date)

  return (
    <Link href={`/events/${event.id}`} className="block h-full group">
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-4 flex flex-col justify-between h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/20">
        <div>
          <p className="text-sm text-indigo-400 font-semibold">{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <h3 className="text-xl font-bold text-white mt-2">{event.name}</h3>
          <p className="text-gray-400 mt-1 text-sm">{event.location || 'Location TBD'}</p>
          <p className="text-gray-300 mt-4 text-sm h-20 overflow-hidden text-ellipsis">{event.description}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-400 text-sm">{event.rsvps.length} going</span>
          <div className="flex items-center gap-2">
            {userId && canCreateEvents && (
              <>
                <Link
                  href={`/events/${event.id}/edit`}
                  onClick={handleEditClick}
                  className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                  aria-label="Delete event"
                >
                  {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </>
            )}
            <button
              onClick={handleRsvp}
              disabled={loading || !userId}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold text-white transition-colors ${isRsvpd ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? '...' : isRsvpd ? 'Cancel' : 'RSVP'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

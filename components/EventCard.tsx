'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { deleteEvent } from '@/app/events/actions'
import { Trash2, Video, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { EventCategory, RsvpStatus } from '@/types/database'

// Extended event type with categories and new fields
export type EventWithDetails = {
  id: number
  name: string
  description: string | null
  event_date: string
  location: string | null
  organizer_id: string | null
  created_at: string
  status?: string
  is_online?: boolean
  meeting_url?: string | null
  actual_attendees?: number | null
  rsvps: { user_id: string; status?: RsvpStatus }[]
  event_category_mappings?: {
    category_id: number
    event_categories: EventCategory
  }[]
}

interface EventCardProps {
  event: EventWithDetails
  userId: string | undefined
  canCreateEvents: boolean
}

export default function EventCard({ event, userId, canCreateEvents }: EventCardProps) {
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
    e.stopPropagation()
    e.preventDefault()
  }

  const handleRsvp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonClick(e)
    if (!userId) return
    setLoading(true)

    if (isRsvpd) {
      const { error } = await supabase.from('rsvps').delete().match({ event_id: event.id, user_id: userId })
      if (!error) setIsRsvpd(false)
    } else {
      const { error } = await supabase.from('rsvps').insert({ event_id: event.id, user_id: userId, status: 'going' })
      if (!error) setIsRsvpd(true)
    }
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonClick(e)
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }
    setDeleting(true)
    await deleteEvent(event.id.toString()!)
    setDeleting(false)
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonClick(e)
    router.push(`/events/${event.id}/edit`)
  }

  const eventDate = new Date(event.event_date)
  const goingCount = event.rsvps.filter(r => !r.status || r.status === 'going').length
  const interestedCount = event.rsvps.filter(r => r.status === 'interested').length

  return (
    <Link href={`/events/${event.id}`} className="block h-full group">
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-4 flex flex-col justify-between h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/20">
        <div>
          {/* Category badges */}
          {event.event_category_mappings && event.event_category_mappings.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {event.event_category_mappings.map((mapping) => (
                <span
                  key={mapping.category_id}
                  className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                  style={{ backgroundColor: mapping.event_categories.color || '#6366f1' }}
                >
                  {mapping.event_categories.name}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm text-indigo-400 font-semibold">
            {eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h3 className="text-xl font-bold text-white mt-2">{event.name}</h3>

          {/* Location or Online indicator */}
          <p className="text-gray-400 mt-1 text-sm flex items-center gap-1.5">
            {event.is_online ? (
              <>
                <Video className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400">Online Event</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                {event.location || 'Location TBD'}
              </>
            )}
          </p>

          <p className="text-gray-300 mt-4 text-sm h-20 overflow-hidden text-ellipsis">{event.description}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {goingCount} going
            </span>
            {interestedCount > 0 && (
              <span className="text-yellow-500">{interestedCount} interested</span>
            )}
            {canCreateEvents && event.actual_attendees !== null && event.actual_attendees !== undefined && (
              <span className="text-green-400 text-xs">({event.actual_attendees} attended)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {userId && canCreateEvents && (
              <>
                <button
                  onClick={handleEditClick}
                  className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
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

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Video, MapPin, ExternalLink, Users } from 'lucide-react'
import EventComments from '@/components/EventComments'
import AdminAttendanceForm from '@/components/AdminAttendanceForm'
import RsvpStatusButtons from '@/components/RsvpStatusButtons'
import type { CommentWithProfile, RsvpStatus } from '@/types/database'

type AttendeeProfile = {
  id: string
  full_name: string | null
  avatar_url: string | null
}

type Attendee = {
  user_id: string
  status: RsvpStatus
  profiles: AttendeeProfile | null
}

type CategoryMapping = {
  category_id: number
  event_categories: {
    id: number
    name: string
    color: string | null
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is admin
  let canCreateEvents = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('can_create_events')
      .eq('id', user.id)
      .single()
    canCreateEvents = profile?.can_create_events || false
  }

  // Fetch event with categories
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select(`
      *,
      event_category_mappings(
        category_id,
        event_categories(id, name, color)
      )
    `)
    .eq('id', id)
    .single()

  if (eventError || !event) {
    console.log(`[Error while fetching event ${id}:`, eventError)
    notFound()
  }

  // Fetch attendees with status
  const { data: attendees, error: rsvpError } = await supabase
    .from('rsvps')
    .select('user_id, status, profiles(id, full_name, avatar_url)')
    .eq('event_id', id)

  if (rsvpError) {
    console.log(`[Error while fetching RSVPs for event ${id}:`, rsvpError)
  }

  // Fetch comments with profiles
  const { data: comments, error: commentsError } = await supabase
    .from('event_comments')
    .select('*, profiles(username, full_name, avatar_url)')
    .eq('event_id', id)
    .order('created_at', { ascending: true })

  if (commentsError) {
    console.log(`[Error while fetching comments for event ${id}:`, commentsError)
  }

  const eventDate = new Date(event.event_date)
  const typedAttendees = (attendees || []) as unknown as Attendee[]
  const goingAttendees = typedAttendees.filter(a => !a.status || a.status === 'going')
  const interestedAttendees = typedAttendees.filter(a => a.status === 'interested')
  const userRsvp = user ? typedAttendees.find(a => a.user_id === user.id) : null
  const categoryMappings = (event.event_category_mappings || []) as CategoryMapping[]

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Event Card */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Category badges */}
            {categoryMappings.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryMappings.map((mapping) => (
                  <span
                    key={mapping.category_id}
                    className="px-3 py-1 text-sm font-medium rounded-full text-white"
                    style={{ backgroundColor: mapping.event_categories.color || '#6366f1' }}
                  >
                    {mapping.event_categories.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              {event.name}
            </h1>

            <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 text-gray-300 mb-6 text-lg">
              <span>
                <strong>Date:</strong> {eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span>
                <strong>Time:</strong> {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>

            {/* Location or Online indicator */}
            <div className="flex items-center gap-2 text-gray-300 mb-6">
              {event.is_online ? (
                <>
                  <Video className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Online Event</span>
                  {event.meeting_url && (
                    <a
                      href={event.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Join Meeting <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </>
              ) : event.location && (
                <>
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </>
              )}
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-gray-200 whitespace-pre-wrap">
              {event.description}
            </div>

            {/* RSVP Section */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                RSVP
              </h3>
              <RsvpStatusButtons
                eventId={parseInt(id)}
                currentStatus={userRsvp?.status || null}
                isLoggedIn={!!user}
              />
            </div>
          </div>

          {/* Attendees Section */}
          {typedAttendees.length > 0 && (
            <div className="bg-white/5 p-6 sm:p-8 md:p-10 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">
                Attendees ({goingAttendees.length} going{interestedAttendees.length > 0 && `, ${interestedAttendees.length} interested`})
              </h2>

              {/* Going */}
              {goingAttendees.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-green-400 mb-3">Going</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {goingAttendees.map((attendee) => (
                      attendee.profiles && (
                        <div key={attendee.profiles.id} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                          <span className="text-sm text-gray-300 truncate">{attendee.profiles.full_name || 'Anonymous'}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Interested */}
              {interestedAttendees.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-yellow-400 mb-3">Interested</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {interestedAttendees.map((attendee) => (
                      attendee.profiles && (
                        <div key={attendee.profiles.id} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                          <span className="text-sm text-gray-300 truncate">{attendee.profiles.full_name || 'Anonymous'}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Section - Actual Attendance */}
        {canCreateEvents && (
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Admin: Actual Attendance</h3>
            <AdminAttendanceForm
              eventId={parseInt(id)}
              currentCount={event.actual_attendees}
            />
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <EventComments
            eventId={parseInt(id)}
            comments={(comments || []) as CommentWithProfile[]}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </div>
  )
}

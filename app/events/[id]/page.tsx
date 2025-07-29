import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { useRouter } from 'next/navigation'
// Define types for clarity
type AttendeeProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

type Attendee = {
  profiles: AttendeeProfile | null;
}

export default async function EventDetailPage( {params} : {params: Promise<{ id: string }>}) {
  const {id} = await params
  const supabase = await createClient()


  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    console.log(`[Error while fetching event ${id}:`, eventError)
    notFound()
  }

  const { data: attendees, error: rsvpError } = await supabase
    .from('rsvps')
    .select('profiles(id, full_name, avatar_url)')
    .eq('event_id', id)

  if (rsvpError || !attendees) {
    console.log(`[Error while fetching event ${id}:`, )
    console.log(rsvpError)
  }
  const eventDate = new Date(event.event_date)

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden">
        <div className="p-6 sm:p-8 md:p-10">
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
            {event.location && (
              <span>
                <strong>Location:</strong> {event.location}
              </span>
            )}
          </div>
          <div className="prose prose-invert prose-lg max-w-none text-gray-200">
            <p>{event.description}</p>
          </div>
        </div>

        {attendees && attendees.length > 0 && (
          <div className="bg-white/5 p-6 sm:p-8 md:p-10 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Attendees ({attendees.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(attendees as unknown as Attendee[]).map((attendee) => (
                attendee.profiles && (
                  <div key={attendee.profiles.id} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                    {/* Avatar component is disabled until installation is fixed
                    <Avatar className="w-10 h-10 border-2 border-purple-500/50">
                      <AvatarImage src={attendee.profiles.avatar_url || ''} alt={attendee.profiles.full_name || 'User'} />
                      <AvatarFallback>{attendee.profiles.full_name ? attendee.profiles.full_name.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                    */}
                    <span className="text-sm text-gray-300 truncate">{attendee.profiles.full_name}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

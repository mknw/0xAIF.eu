import { createClient } from '@/lib/supabase/server'
import EventList from '@/components/EventList'
import Link from 'next/link'

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch events and user profile in parallel for efficiency
  const [eventsResult, profileResult] = await Promise.all([
    supabase
      .from('events')
      .select(`*, rsvps(user_id)`)
      .order('event_date', { ascending: false }),
    user ? supabase.from('profiles').select('can_create_events').eq('id', user.id).single() : Promise.resolve({ data: null, error: null })
  ]);

  const { data: events, error } = eventsResult;
  const { data: profile } = profileResult;

  if (error) {
    console.error('Error fetching events:', error)
    return <p className="text-center text-red-500">Could not fetch events.</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Upcoming Events</h1>
        {user && profile?.can_create_events && (
          <Link href="/events/create" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Create Event
          </Link>
        )}
      </div>
      <EventList events={events} userId={user?.id} canCreateEvents={profile?.can_create_events ?? false} />
    </div>
  )
}

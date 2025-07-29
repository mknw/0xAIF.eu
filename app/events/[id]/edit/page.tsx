import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditEventForm from '@/components/EditEventForm'

export default async function EditEventPage( {params} : {params: Promise<{ id: string }>}) {
  const {id} = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?message=You must be logged in to edit an event.')
  }

  // Fetch event and user profile in parallel
  const [eventResult, profileResult] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.from('profiles').select('can_create_events').eq('id', user.id).single(),
  ])

  const { data: event, error: eventError } = eventResult
  const { data: profile, error: profileError } = profileResult

  if (eventError || !event) {
    notFound()
  }

  if (profileError || !profile || !profile.can_create_events) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
        <p className="mt-4 text-white">You are not authorized to edit this event.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Edit Event</h1>
      <EditEventForm event={event} />
    </div>
  )
}

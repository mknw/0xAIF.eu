'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(prevState: { error: string | null }, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to create an event.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('can_create_events')
    .eq('id', user.id)
    .single()

  if (!profile?.can_create_events) {
    return { error: 'You do not have permission to create events.' }
  }

  const eventData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    event_date: formData.get('event_date') as string,
    location: formData.get('location') as string,
    organizer_id: user.id,
  }

  // Basic validation
  if (!eventData.name || !eventData.event_date) {
    return { error: 'Event name and date are required.' }
  }

  const { error } = await supabase.from('events').insert(eventData)

  if (error) {
    console.error('Error creating event:', error)
    return { error: 'Could not create the event. Please try again.' }
  }

  revalidatePath('/events')
  redirect('/events')
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

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

  if (!profile || !profile.can_create_events) {
    return { error: 'You are not authorized to create events.' }
  }

  const event = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    event_date: formData.get('event_date') as string,
    location: formData.get('location') as string,
    organizer_id: user.id,
  }

  // Basic validation
  if (!event.name || !event.event_date) {
    return { error: 'Event name and date are required.' }
  }

  const { error } = await supabase.from('events').insert(event)

  if (error) {
    console.error('Error creating event:', error)
    return { error: 'Could not create event. Please try again.' }
  }

  revalidatePath('/events')
  redirect('/events')
}

export async function updateEvent(prevState: { error: string | null }, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to update an event.' }
  }

  const formSchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    event_date: z.string().datetime(),
    location: z.string().optional(),
  })

  const result = formSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success) {
    return { error: result.error.issues.map((e) => e.message).join(', ') }
  }

  const { id, ...eventData } = result.data

  // Verify that the user has permission to edit events
  const { data: profile } = await supabase.from('profiles').select('can_create_events').eq('id', user.id).single()

  if (!profile || !profile.can_create_events) {
    return { error: 'You are not authorized to update this event.' }
  }

  const { error: updateError } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)

  if (updateError) {
    console.error('Error updating event:', updateError)
    return { error: 'Could not update event. Please try again.' }
  }

  revalidatePath('/events')
  revalidatePath(`/events/${id}/edit`)
  redirect('/events')
}

export async function deleteEvent(eventId: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to delete an event.' }
  }

  // Verify that the user has permission to delete events
  const { data: profile } = await supabase.from('profiles').select('can_create_events').eq('id', user.id).single()

  if (!profile || !profile.can_create_events) {
    return { error: 'You are not authorized to delete this event.' }
  }

  // Also delete all RSVPs for the event
  const { error: rsvpError } = await supabase.from('rsvps').delete().eq('event_id', eventId)
  if (rsvpError) {
    console.error('Error deleting RSVPs:', rsvpError)
    return { error: 'Could not delete event RSVPs. Please try again.' }
  }

  const { error: eventError } = await supabase.from('events').delete().eq('id', eventId)
  if (eventError) {
    console.error('Error deleting event:', eventError)
    return { error: 'Could not delete event. Please try again.' }
  }

  revalidatePath('/events')
  redirect('/events')
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { EventCategory, RsvpStatus } from '@/types/database'

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

// Get all event categories
export async function getEventCategories(): Promise<{ data: EventCategory[] | null; error: string | null }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('event_categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return { data: null, error: 'Could not fetch categories.' }
  }

  return { data, error: null }
}

// Enhanced createEvent with categories and online support
export async function createEventEnhanced(prevState: { error: string | null }, formData: FormData) {
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

  const categoryIds = formData.getAll('category_ids').map(id => parseInt(id as string)).filter(id => !isNaN(id))

  const event = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    event_date: formData.get('event_date') as string,
    location: formData.get('location') as string || null,
    organizer_id: user.id,
    status: (formData.get('status') as string) || 'upcoming',
    is_online: formData.get('is_online') === 'true',
    meeting_url: formData.get('meeting_url') as string || null,
  }

  if (!event.name || !event.event_date) {
    return { error: 'Event name and date are required.' }
  }

  const { data: newEvent, error: eventError } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single()

  if (eventError) {
    console.error('Error creating event:', eventError)
    return { error: 'Could not create event. Please try again.' }
  }

  // Insert category mappings
  if (newEvent && categoryIds.length > 0) {
    const mappings = categoryIds.map(cat_id => ({
      event_id: newEvent.id,
      category_id: cat_id
    }))
    const { error: mappingError } = await supabase.from('event_category_mappings').insert(mappings)
    if (mappingError) {
      console.error('Error creating category mappings:', mappingError)
      // Don't fail the whole operation, event is created
    }
  }

  revalidatePath('/events')
  redirect('/events')
}

// Update RSVP status
export async function updateRsvpStatus(eventId: number, status: RsvpStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('rsvps')
    .upsert(
      {
        event_id: eventId,
        user_id: user.id,
        status,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'event_id,user_id' }
    )

  if (error) {
    console.error('Error updating RSVP:', error)
    return { error: 'Could not update RSVP.' }
  }

  revalidatePath('/events')
  revalidatePath(`/events/${eventId}`)
  return { error: null }
}

// Remove RSVP
export async function removeRsvp(eventId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error removing RSVP:', error)
    return { error: 'Could not remove RSVP.' }
  }

  revalidatePath('/events')
  revalidatePath(`/events/${eventId}`)
  return { error: null }
}

// Add comment to event
export async function addEventComment(eventId: number, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'You must be logged in to comment.' }

  if (!content.trim()) return { error: 'Comment cannot be empty.' }

  const { error } = await supabase
    .from('event_comments')
    .insert({ event_id: eventId, user_id: user.id, content: content.trim() })

  if (error) {
    console.error('Error adding comment:', error)
    return { error: 'Could not add comment. Please try again.' }
  }

  revalidatePath(`/events/${eventId}`)
  return { error: null }
}

// Delete comment (user can only delete their own)
export async function deleteEventComment(commentId: number, eventId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('event_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting comment:', error)
    return { error: 'Could not delete comment.' }
  }

  revalidatePath(`/events/${eventId}`)
  return { error: null }
}

// Admin: Update actual attendees count
export async function updateActualAttendees(eventId: number, count: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Verify user is admin (can_create_events = true)
  const { data: profile } = await supabase
    .from('profiles')
    .select('can_create_events')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.can_create_events) {
    return { error: 'Not authorized to update attendance.' }
  }

  const { error } = await supabase
    .from('events')
    .update({ actual_attendees: count })
    .eq('id', eventId)

  if (error) {
    console.error('Error updating attendance:', error)
    return { error: 'Could not update attendance count.' }
  }

  revalidatePath('/events')
  revalidatePath(`/events/${eventId}`)
  return { error: null }
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

export async function deleteEvent(eventId: string) {
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

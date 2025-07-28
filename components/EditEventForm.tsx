'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateEvent } from '@/app/events/actions'
import { DateTimePicker } from '@/components/ui/DateTimePicker'

// In a real-world scenario, this would be generated from your Supabase schema.
type Event = {
  id: number;
  name: string;
  description: string | null;
  event_date: string;
  location: string | null;
}

const initialState: { error: string | null } = {
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50">
      {pending ? 'Updating Event...' : 'Update Event'}
    </button>
  )
}

export default function EditEventForm({ event }: { event: Event }) {
  const [state, formAction] = useActionState(updateEvent, initialState)
  const [eventDate, setEventDate] = useState(new Date(event.event_date))

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={event.id} />
      <input type="hidden" name="event_date" value={eventDate.toISOString()} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Event Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={event.name}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={event.description || ''}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Event Date and Time</label>
        <DateTimePicker value={eventDate} onChange={setEventDate} />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          defaultValue={event.location || ''}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <SubmitButton />
      </div>
      {state?.error && (
        <p className="text-red-500 text-sm mt-2">{state.error}</p>
      )}
    </form>
  )
}

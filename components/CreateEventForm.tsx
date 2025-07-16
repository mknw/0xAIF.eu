'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createEvent } from '@/app/events/actions'

const initialState: { error: string | null } = {
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50">
      {pending ? 'Creating Event...' : 'Create Event'}
    </button>
  )
}

export default function CreateEventForm() {
  const [state, formAction] = useActionState(createEvent, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Event Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="event_date" className="block text-sm font-medium text-gray-300">Event Date and Time</label>
        <input
          id="event_date"
          name="event_date"
          type="datetime-local"
          required
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
        <input
          id="location"
          name="location"
          type="text"
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

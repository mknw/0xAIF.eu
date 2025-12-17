'use client'

import { useActionState, useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { createEventEnhanced, getEventCategories } from '@/app/events/actions'
import { DateTimePicker } from '@/components/ui/DateTimePicker'
import type { EventCategory } from '@/types/database'

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
  const [state, formAction] = useActionState(createEventEnhanced, initialState)
  const [eventDate, setEventDate] = useState(new Date())
  const [isOnline, setIsOnline] = useState(false)
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  useEffect(() => {
    async function loadCategories() {
      const { data } = await getEventCategories()
      if (data) {
        setCategories(data)
      }
    }
    loadCategories()
  }, [])

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="event_date" value={eventDate.toISOString()} />
      <input type="hidden" name="is_online" value={isOnline.toString()} />
      {selectedCategories.map(id => (
        <input key={id} type="hidden" name="category_ids" value={id} />
      ))}

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
        <label className="block text-sm font-medium text-gray-300 mb-1">Event Date and Time</label>
        <DateTimePicker value={eventDate} onChange={setEventDate} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategories.includes(cat.id)
                  ? 'text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={selectedCategories.includes(cat.id) ? { backgroundColor: cat.color || '#6366f1' } : undefined}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={(e) => setIsOnline(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-300">Online Event</span>
        </label>
      </div>

      {isOnline && (
        <div>
          <label htmlFor="meeting_url" className="block text-sm font-medium text-gray-300">Meeting URL</label>
          <input
            id="meeting_url"
            name="meeting_url"
            type="url"
            placeholder="https://meet.google.com/..."
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

      {!isOnline && (
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

      <div>
        <SubmitButton />
      </div>
      {state?.error && (
        <p className="text-red-500 text-sm mt-2">{state.error}</p>
      )}
    </form>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { updateActualAttendees } from '@/app/events/actions'
import { Users } from 'lucide-react'

interface AdminAttendanceFormProps {
  eventId: number
  currentCount: number | null
}

export default function AdminAttendanceForm({ eventId, currentCount }: AdminAttendanceFormProps) {
  const [count, setCount] = useState<string>(currentCount?.toString() || '')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const numCount = parseInt(count)
    if (isNaN(numCount) || numCount < 0) {
      setError('Please enter a valid number')
      return
    }

    startTransition(async () => {
      const result = await updateActualAttendees(eventId, numCount)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-400" />
        <label htmlFor="actual_attendees" className="text-gray-300 text-sm">
          Actual attendees:
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="actual_attendees"
          type="number"
          min="0"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="Enter count"
          className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">Saved!</p>}
    </form>
  )
}

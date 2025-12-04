'use client'

import { useState, useTransition } from 'react'
import { updateRsvpStatus, removeRsvp } from '@/app/events/actions'
import { Check, Star, X } from 'lucide-react'
import type { RsvpStatus } from '@/types/database'

interface RsvpStatusButtonsProps {
  eventId: number
  currentStatus: RsvpStatus | null
  isLoggedIn: boolean
}

export default function RsvpStatusButtons({ eventId, currentStatus, isLoggedIn }: RsvpStatusButtonsProps) {
  const [status, setStatus] = useState<RsvpStatus | null>(currentStatus)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = async (newStatus: RsvpStatus) => {
    if (!isLoggedIn) return

    startTransition(async () => {
      if (status === newStatus) {
        // Toggle off - remove RSVP
        const result = await removeRsvp(eventId)
        if (!result.error) {
          setStatus(null)
        }
      } else {
        // Set new status
        const result = await updateRsvpStatus(eventId, newStatus)
        if (!result.error) {
          setStatus(newStatus)
        }
      }
    })
  }

  if (!isLoggedIn) {
    return (
      <p className="text-gray-400 text-sm">Log in to RSVP for this event.</p>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => handleStatusChange('going')}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          status === 'going'
            ? 'bg-green-600 text-white ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        } disabled:opacity-50`}
      >
        <Check className="w-4 h-4" />
        Going
      </button>

      <button
        onClick={() => handleStatusChange('interested')}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          status === 'interested'
            ? 'bg-yellow-600 text-white ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        } disabled:opacity-50`}
      >
        <Star className="w-4 h-4" />
        Interested
      </button>

      <button
        onClick={() => handleStatusChange('not_going')}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          status === 'not_going'
            ? 'bg-red-600 text-white ring-2 ring-red-400 ring-offset-2 ring-offset-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        } disabled:opacity-50`}
      >
        <X className="w-4 h-4" />
        Not Going
      </button>

      {status && (
        <span className="flex items-center text-sm text-gray-400 ml-2">
          {isPending ? 'Updating...' : `You're ${status === 'going' ? 'going' : status === 'interested' ? 'interested' : 'not going'}`}
        </span>
      )}
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { addEventComment, deleteEventComment } from '@/app/events/actions'
import { Trash2, Send, MessageSquare } from 'lucide-react'
import type { CommentWithProfile } from '@/types/database'

interface EventCommentsProps {
  eventId: number
  comments: CommentWithProfile[]
  currentUserId?: string
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function EventComments({ eventId, comments, currentUserId }: EventCommentsProps) {
  const [newComment, setNewComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setError(null)
    startTransition(async () => {
      const result = await addEventComment(eventId, newComment)
      if (result.error) {
        setError(result.error)
      } else {
        setNewComment('')
      }
    })
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    startTransition(async () => {
      const result = await deleteEventComment(commentId, eventId)
      if (result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
        <MessageSquare className="w-5 h-5" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={isPending}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isPending || !newComment.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      ) : (
        <p className="text-gray-400 text-sm">Log in to leave a comment.</p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white truncate">
                      {comment.profiles.full_name || comment.profiles.username || 'Anonymous'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                </div>
                {currentUserId === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={isPending}
                    className="text-gray-500 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

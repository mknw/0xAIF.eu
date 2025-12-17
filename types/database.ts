// Event and RSVP status types
export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type RsvpStatus = 'going' | 'interested' | 'not_going'

// Event Category
export interface EventCategory {
  id: number
  name: string
  color: string | null
  created_at: string
}

// Event Category Mapping (junction table)
export interface EventCategoryMapping {
  event_id: number
  category_id: number
  event_categories?: EventCategory
}

// Base Event interface
export interface Event {
  id: number
  created_at: string
  name: string
  description: string | null
  event_date: string
  location: string | null
  organizer_id: string | null
  status: EventStatus
  is_online: boolean
  meeting_url: string | null
  image_url: string | null
  actual_attendees: number | null
}

// RSVP
export interface Rsvp {
  event_id: number
  user_id: string
  status: RsvpStatus
  created_at: string
  updated_at: string | null
}

// Event Comment
export interface EventComment {
  id: number
  event_id: number
  user_id: string
  content: string
  created_at: string
  updated_at: string | null
}

// Profile (for relations)
export interface Profile {
  id: string
  updated_at: string | null
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  can_create_events: boolean
}

// Profile subset for display
export interface ProfilePreview {
  username: string | null
  full_name: string | null
  avatar_url: string | null
}

// Event with all relations for detail pages
export interface EventWithDetails extends Event {
  rsvps: Rsvp[]
  event_category_mappings?: (EventCategoryMapping & {
    event_categories: EventCategory
  })[]
  profiles?: ProfilePreview
  event_comments?: (EventComment & {
    profiles?: ProfilePreview
  })[]
}

// Event for listing (lighter version)
export interface EventListItem extends Event {
  rsvps: { user_id: string; status: RsvpStatus }[]
  event_category_mappings?: (EventCategoryMapping & {
    event_categories: EventCategory
  })[]
  profiles?: ProfilePreview
}

// Comment with profile for display
export interface CommentWithProfile extends EventComment {
  profiles: ProfilePreview
}

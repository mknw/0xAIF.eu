# Changelog

All notable changes to 0xAIF Europe are documented in this file.

## [Unreleased]

### Added

#### Events System Enhancements
- **Event Categories**: Events can now be tagged with multiple categories (Hackathon, Workshop, Meetup, Demo Day, Coding Session) displayed as color-coded badges
- **Online Event Support**: New `is_online` flag and `meeting_url` field for virtual events with video link icon indicator
- **Enhanced RSVP System**: Three-state RSVPs (going/interested/not_going) with toggle buttons and visual feedback
- **Event Comments**: Authenticated users can add comments to events; users can delete their own comments
- **Admin Attendance Tracking**: Organizers can record actual attendee counts after events (`actual_attendees` field)
- **Bulk Events**: Created 13 weekly Monday coding sessions (Aug 11 - Nov 3, 2025) at Commons Hub Brussels
- **Sample Attendance Data**: All 14 coding sessions populated with random attendance counts (5-25 attendees each)

#### New Components
- `RsvpStatusButtons.tsx` - Interactive going/interested/not_going button group with optimistic UI updates
- `EventComments.tsx` - Comments section with relative timestamps, add form, and delete functionality
- `AdminAttendanceForm.tsx` - Admin-only form for recording actual attendance

#### Database Schema
- `event_categories` table with 5 default categories and color codes
- `event_category_mappings` junction table for many-to-many event-category relationships
- `event_comments` table with event and user foreign keys
- Added columns to `events`: `status`, `is_online`, `meeting_url`, `image_url`, `actual_attendees`
- Added columns to `rsvps`: `status` (going/interested/not_going), `created_at`, `updated_at`
- Row Level Security (RLS) policies for all new tables

#### Server Actions (`app/events/actions.ts`)
- `getEventCategories()` - Fetch all available categories
- `createEventEnhanced()` - Create events with categories and online support
- `updateRsvpStatus()` - Update RSVP with three-state status
- `removeRsvp()` - Remove RSVP entirely
- `addEventComment()` - Add comment to event
- `deleteEventComment()` - Delete own comment
- `updateActualAttendees()` - Admin-only attendance update

#### TypeScript Types (`types/database.ts`)
- `EventStatus` type union
- `RsvpStatus` type union
- `EventCategory` interface
- `EventCategoryMapping` interface
- `EventComment` interface
- `EventWithDetails` extended interface
- Updated `Event` and `Rsvp` interfaces with new fields

### Changed

#### Hero Section
- **Typewriter Positioning**: Moved rotating slogans from `bottom-48` to `top-20 md:top-24 lg:top-28`
  - Resolves overlap with "Founders" annotation
  - Improved responsive behavior on mobile and desktop
  - Added `text-center` for proper centering

#### CreateEventForm
- Added category multi-select checkboxes
- Added online event toggle switch
- Added conditional meeting URL input field

#### EventCard
- Displays category badges with colors
- Shows online event indicator (video icon)
- Shows RSVP count breakdown by status

#### Event Detail Page (`app/events/[id]/page.tsx`)
- Integrated EventComments component
- Added RsvpStatusButtons for interactive RSVPs
- Shows meeting URL link for online events
- Admin section for attendance tracking
- Enhanced query includes categories and comments

#### Events Listing (`app/events/page.tsx`)
- Updated query to include RSVPs with status and category mappings

### Documentation
- Updated `docs/SPEC.MD` with new database schema and project structure
- Updated `docs/ROADMAP.md` with completed features and next steps
- Created `docs/CHANGELOG.md` (this file)

---

## Version History

### Pre-Enhancement (Before This Update)
- Basic events system with create, list, view, edit, delete
- Simple RSVP (binary going/not going)
- User authentication via Supabase
- Blueprint-style hero with scroll animations
- Responsive dark theme design

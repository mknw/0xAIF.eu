# 0xAIF Europe - Development Roadmap

## Completed ✅

### Authentication & User Management
- ✅ Email/Password authentication via Supabase
- ✅ OAuth providers (GitHub, Google)
- ✅ Protected routes with middleware
- ✅ User profile management
- ✅ Role-based access control (can_create_events flag)

### Events System (Basic)
- ✅ Create events (authorized users only)
- ✅ List and view events
- ✅ Basic RSVP functionality
- ✅ Event editing and deletion
- ✅ Organizer association

### UI/UX
- ✅ Hero section with blueprint-style title
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark theme with gradient accents
- ✅ Framer Motion animations
- ✅ Scroll-triggered sentence animations
- ✅ Typewriter slogan positioned above title (no overlap with annotations)

### Events System (Enhanced)
- ✅ Event categories with color-coded badges (Hackathon, Workshop, Meetup, Demo Day, Coding Session)
- ✅ Online event support with meeting URL field
- ✅ Enhanced RSVP statuses (going/interested/not_going)
- ✅ Event comments system for authenticated users
- ✅ Admin attendance tracking (actual_attendees field)
- ✅ Bulk event creation (13 weekly Monday events: Aug 11 - Nov 3, 2025)

### New Components Created
- ✅ `RsvpStatusButtons.tsx` - Going/Interested/Not Going toggle buttons
- ✅ `EventComments.tsx` - Comments list with add/delete functionality
- ✅ `AdminAttendanceForm.tsx` - Admin-only attendance input

### Database Enhancements
- ✅ `event_categories` table with default categories
- ✅ `event_category_mappings` junction table (many-to-many)
- ✅ `event_comments` table with user association
- ✅ Enhanced `events` table (status, is_online, meeting_url, image_url, actual_attendees)
- ✅ Enhanced `rsvps` table (status field with going/interested/not_going)
- ✅ Row Level Security (RLS) policies for all new tables

---

## In Progress 🚧

### Hero Section Fix ✅
**Issue:** Typewriter slogan overlapping with "Founder" annotation
**Solution:** Move typewriter above the title

- [x] Update TypeAnimation positioning in `app/page.tsx`
  - Changed from `bottom-48` to `top-20 md:top-24 lg:top-28`
  - Adjusted font size: `text-lg md:text-xl lg:text-2xl`
  - Added `text-center` for proper centering
- [x] Verified positioning on desktop and mobile
  - Typewriter now appears above the blueprint title
  - No overlap with annotations at any breakpoint

### Events System Enhancement ✅

All core features implemented. See Completed section for details.

**Remaining Enhancements (Phase 2):**
- [ ] Display category filters on events listing page

---

## Upcoming 📋

### Event Features (Phase 2)
- [ ] Event search functionality
  - Full-text search on name/description
  - Filter by category
  - Filter by date range
  - Filter by location (online vs in-person)
- [ ] Calendar view
  - Month grid layout
  - Week view
  - Day view with timeline
- [ ] Event image uploads
  - S3/Supabase Storage integration
  - Image cropping/resizing
  - Default placeholder images
- [ ] Email notifications
  - RSVP confirmations
  - Event reminders (1 day before)
  - Event updates/changes
  - Event cancellations
- [ ] Event sharing
  - Social media share buttons
  - Unique shareable URLs
  - Open Graph meta tags
  - QR code generation
- [ ] Recurring events
  - Weekly/monthly patterns
  - Custom recurrence rules
  - Exception dates handling

### Community Features
- [ ] Member directory
  - Profile listing with filters
  - Skill tags and interests
  - Member search
  - Connection requests
- [ ] Discussion forums
  - Topic-based threads
  - Markdown support
  - File attachments
  - Reactions and voting
- [ ] Resource sharing
  - Code snippets
  - Tutorial links
  - Tools and libraries
  - Project showcases
- [ ] Opportunity board
  - Job postings
  - Collaboration requests
  - Project partnerships
  - Mentorship opportunities
- [ ] Partnered matchmaking
  - Co-founder matching
  - Skill-based pairing
  - Project contributor matching

### Technical Improvements
- [ ] Performance optimization
  - Database query optimization
  - Image lazy loading
  - Code splitting
  - Server-side caching
- [ ] Analytics integration
  - Google Analytics / Plausible
  - Event attendance tracking
  - User engagement metrics
  - Conversion funnels
- [ ] SEO improvements
  - Dynamic meta tags
  - Sitemap generation
  - Structured data (JSON-LD)
  - Canonical URLs
- [ ] Progressive Web App (PWA)
  - Service worker
  - Offline functionality
  - Install prompts
  - Push notifications
- [ ] Accessibility audit
  - WCAG 2.1 AA compliance
  - Screen reader testing
  - Keyboard navigation
  - Color contrast fixes

### Admin Features
- [ ] Admin dashboard
  - User management
  - Event moderation
  - Analytics overview
  - System health monitoring
- [ ] Content moderation
  - Flag inappropriate content
  - Review system for events
  - Comment moderation queue
- [ ] Batch operations
  - Bulk event creation/updates
  - Mass email notifications
  - User role management

---

## Future Ideas 💡

- AI-powered event recommendations
- Integration with calendar apps (Google Calendar, Outlook)
- Video conferencing integration (Zoom, Google Meet)
- Live streaming support for events
- Event recording and playback
- Gamification (badges, points, leaderboards)
- Multi-language support (i18n)
- API for third-party integrations
- Mobile apps (iOS/Android)
- Event sponsorship features
- Ticketing and payment integration

---

## Technical Debt & Maintenance

- [ ] Update dependencies regularly
- [ ] Security audit of RLS policies
- [ ] Database backup strategy
- [ ] Error monitoring (Sentry)
- [ ] Logging infrastructure
- [ ] CI/CD pipeline improvements
- [ ] Automated testing suite
  - Unit tests
  - Integration tests
  - E2E tests with Playwright

---

## Documentation Needs

- [ ] API documentation
- [ ] Component library documentation (Storybook?)
- [ ] Database migration guide
- [ ] Deployment guide
- [ ] Contributing guidelines
- [ ] Code of conduct
- [ ] User onboarding guide

---

## Notes

**Development Principles:**
- Iterate quickly, ship frequently
- User feedback drives priorities
- Security and privacy first
- Performance matters
- Accessibility is non-negotiable

**Current Tech Stack:**
- Next.js 15.4.1 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3.3.0
- Supabase (Auth + Database)
- Framer Motion (Animations)
- Radix UI (Components)

**Key Files:**
- `/app/page.tsx` - Hero and landing page
- `/app/events/*` - Events functionality
- `/components/*` - Reusable UI components
- `/lib/supabase/*` - Database client setup
- `/docs/*` - Project documentation

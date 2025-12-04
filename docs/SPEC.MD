# 0xAIF Europe - Project Specification

## Overview
0xAIF Europe is a community platform for AI founders, engineers, and researchers across Europe to connect, collaborate, and build the next generation of AI solutions together.

## Technical Stack

### Core Technologies
- **Frontend Framework**: Next.js 15.4.1 (with App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.3.0 with custom animations
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript 5
- **Build Tool**: Turbopack

### Key Dependencies
- **UI Components**:
  - Radix UI (Dialog, Dropdown Menu, Slot)
  - Lucide React (Icons)
  - Class Variance Authority (Styling utilities)
- **Authentication**:
  - @supabase/auth-helpers-nextjs
  - @supabase/auth-ui-react
- **Form Handling**:
  - React Hook Form
  - Zod (Schema validation)
- **Animation**:
  - Framer Motion
  - React Type Animation
- **Utilities**:
  - Tailwind Merge
  - Clsx
  - React Dropzone (for file uploads)

## Project Structure

```
0xaif-eu/
├── app/                          # App Router directory
│   ├── (auth)/                   # Authentication related routes
│   │   └── callback/             # Auth callback route
│   ├── events/                   # Events feature
│   │   ├── [id]/                 # Dynamic event pages
│   │   │   ├── page.tsx          # Event detail page
│   │   │   └── edit/             # Event editing
│   │   ├── create/               # Event creation
│   │   ├── actions.ts            # Server actions for events
│   │   └── page.tsx              # Events listing
│   ├── login/                    # Login page
│   ├── account/                  # User account page
│   ├── animations.css            # Custom CSS animations
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (hero section)
├── components/                   # Reusable UI components
│   ├── AccountForm.tsx           # User account management
│   ├── AdminAttendanceForm.tsx   # Admin attendance tracking
│   ├── BlueprintHero.tsx         # Blueprint-style title component
│   ├── CreateEventForm.tsx       # Event creation form with categories
│   ├── EventCard.tsx             # Event display card with badges
│   ├── EventComments.tsx         # Event comments section
│   ├── EventList.tsx             # Events grid listing
│   ├── RsvpStatusButtons.tsx     # RSVP status selection
│   └── ui/                       # UI primitives
│       └── DateTimePicker.tsx    # Date/time input component
├── lib/                          # Utility functions
│   └── supabase/                 # Supabase client setup
│       ├── client.ts             # Browser client
│       └── server.ts             # Server client
├── types/                        # TypeScript type definitions
│   └── database.ts               # Database types and interfaces
├── public/                       # Static assets
└── docs/                         # Project documentation
    ├── SPEC.MD                   # Technical specification
    ├── ROADMAP.md                # Development roadmap
    └── CHANGELOG.md              # Version history
```


## Features

### 1. Authentication
- Email/Password authentication
- OAuth providers (GitHub, Google)
- Protected routes
- Session management
- User profile management

### 2. Events System
- Create and manage events with categories
- Enhanced RSVP functionality (going/interested/not_going)
- Event details with comments
- Online event support with meeting URLs
- Admin attendance tracking
- Category-based organization

### 3. User Profiles
- Profile creation and editing
- Avatar uploads
- Event history
- Role-based access control

### 4. Community Features
- Member directory
- Discussion forums (planned)
- Resource sharing (planned)

## Environment Variables

The following environment variables are required:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```


## DB Schema

```sql
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  updated_at timestamp with time zone,
  username text UNIQUE CHECK (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  website text,
  can_create_events boolean NOT NULL DEFAULT false,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name text NOT NULL,
  description text,
  event_date timestamp with time zone NOT NULL,
  location text,
  organizer_id uuid,
  status text DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled')),
  is_online boolean DEFAULT false,
  meeting_url text,
  image_url text,
  actual_attendees integer,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.profiles(id)
);

CREATE TABLE public.event_categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  color text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.event_category_mappings (
  event_id bigint NOT NULL,
  category_id bigint NOT NULL,
  CONSTRAINT event_category_mappings_pkey PRIMARY KEY (event_id, category_id),
  CONSTRAINT event_category_mappings_event_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT event_category_mappings_category_fkey FOREIGN KEY (category_id) REFERENCES public.event_categories(id) ON DELETE CASCADE
);

CREATE TABLE public.rsvps (
  event_id bigint NOT NULL,
  user_id uuid NOT NULL,
  status text DEFAULT 'going' CHECK (status IN ('going', 'interested', 'not_going')),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone,
  CONSTRAINT rsvps_pkey PRIMARY KEY (event_id, user_id),
  CONSTRAINT rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT rsvps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.event_comments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id bigint NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone,
  CONSTRAINT event_comments_event_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT event_comments_user_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX event_comments_event_id_idx ON public.event_comments(event_id);
CREATE INDEX event_comments_created_at_idx ON public.event_comments(created_at DESC);
```

## Row Level Security (RLS) Policies

All tables have RLS enabled to ensure data security:

**Events:** Publicly readable, only users with `can_create_events=true` can create events, organizers can update/delete their own events.

**RSVPs:** All authenticated users can view RSVPs, users can only manage their own RSVPs.

**Event Comments:** Publicly readable, authenticated users can create comments, users can only update/delete their own comments.

**Event Categories:** Publicly readable, organizers can manage category mappings for their events.

## Event Categories

Default categories available:
- **Hackathon** (#22d3ee - cyan)
- **Workshop** (#3b82f6 - blue)
- **Meetup** (#8b5cf6 - purple)
- **Demo Day** (#f59e0b - amber)
- **Coding Session** (#10b981 - emerald)

Events can have multiple categories for better organization and filtering.

## Implementation Notes & Best Practices

### Component Architecture

**Server Components (Default):**
- Used for data fetching and static content
- Examples: Event listings, profile pages
- Benefits: Better performance, smaller bundle size

**Client Components ('use client'):**
- Used for interactivity and browser APIs
- Examples: Forms, animations, auth buttons
- Required for: useState, useEffect, event handlers, Framer Motion

### Data Fetching Patterns

**Server-Side Fetching:**
```typescript
// In page.tsx or server components
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data, error } = await supabase
  .from('events')
  .select('*')
  .order('event_date', { ascending: true })
```

**Client-Side Fetching:**
```typescript
// In client components when needed
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase
  .from('events')
  .select('*')
```

**Best Practice:** Prefer server-side fetching for initial data, use client-side for user interactions.

### Form Handling with Server Actions

**Pattern:**
```typescript
// In actions.ts
'use server'

export async function createEvent(prevState: { error: string | null }, formData: FormData) {
  // Validation
  // Authentication check
  // Database operation
  // Revalidate paths
  // Redirect or return error
}
```

**Usage in Components:**
```typescript
'use client'
import { useFormState } from 'react-dom'

const [state, formAction] = useFormState(createEvent, { error: null })
```

**Benefits:** Type-safe, secure, automatic revalidation.

### Authentication Patterns

**Check Authentication:**
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  return { error: 'Not authenticated' }
}
```

**Check Authorization:**
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('can_create_events')
  .eq('id', user.id)
  .single()

if (!profile || !profile.can_create_events) {
  return { error: 'Not authorized' }
}
```

### Database Query Optimization

**Use Select with Relations:**
```typescript
// Good - fetch related data in one query
const { data } = await supabase
  .from('events')
  .select(`
    *,
    profiles(username, full_name),
    rsvps(user_id, status),
    event_category_mappings(
      category_id,
      event_categories(name, color)
    )
  `)
```

**Avoid N+1 Queries:**
```typescript
// Bad - multiple queries
const events = await getEvents()
for (const event of events) {
  const rsvps = await getRsvps(event.id) // N+1 problem!
}

// Good - single query with join
const events = await supabase
  .from('events')
  .select('*, rsvps(*)')
```

### Styling Conventions

**Tailwind Class Order:**
1. Layout (flex, grid, block)
2. Positioning (absolute, relative)
3. Sizing (w-, h-, max-w-)
4. Spacing (m-, p-, gap-)
5. Typography (text-, font-)
6. Visual (bg-, border-, shadow-)
7. Interactive (hover:, focus:)
8. Responsive (md:, lg:)

**Example:**
```tsx
<div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 py-6 text-lg font-medium bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 md:px-8">
```

### Animation Best Practices

**Framer Motion Variants:**
```typescript
const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
}

// Usage
<motion.div variants={FADE_UP} initial="hidden" animate="show">
```

**Performance:** Use `transform` and `opacity` for animations (GPU-accelerated).

### Error Handling

**Pattern:**
```typescript
try {
  const { data, error } = await supabase.from('events').insert(event)

  if (error) {
    console.error('Database error:', error)
    return { error: 'User-friendly message' }
  }

  return { data, error: null }
} catch (error) {
  console.error('Unexpected error:', error)
  return { error: 'Something went wrong' }
}
```

**Important:** Log technical errors, return user-friendly messages.

### TypeScript Best Practices

**Use Interface for Objects:**
```typescript
interface Event {
  id: number
  name: string
  description: string | null
}
```

**Use Type for Unions:**
```typescript
type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
```

**Avoid 'any':** Always type your variables and parameters.

### Security Considerations

**Input Validation:**
- Always validate form inputs (use Zod)
- Sanitize user-generated content
- Use parameterized queries (Supabase handles this)

**RLS Policies:**
- Enable RLS on all tables
- Test policies with different user roles
- Default to restrictive, open up as needed

**Environment Variables:**
- Never commit secrets to git
- Use NEXT_PUBLIC_ prefix for client-accessible vars
- Keep Supabase service key server-side only

### Performance Tips

**Image Optimization:**
- Use Next.js Image component
- Specify width and height
- Use appropriate formats (WebP)

**Code Splitting:**
- Use dynamic imports for heavy components
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), { ssr: false })
```

**Database Indexes:**
- Index foreign keys
- Index frequently queried columns
- Use partial indexes where appropriate

### Common Fixes & Solutions

**Issue: Hydration Mismatch**
- Cause: Server and client render differently
- Fix: Use `suppressHydrationWarning` or ensure consistent rendering
- Alternative: Use `useEffect` for client-only code

**Issue: Authentication Not Persisting**
- Cause: Missing Supabase middleware
- Fix: Ensure middleware.ts is properly configured
- Check: Cookie settings in Supabase client

**Issue: RLS Policy Blocking Reads**
- Cause: Missing SELECT policy or wrong conditions
- Fix: Add explicit SELECT policy with `TO authenticated, anon`
- Debug: Check Supabase logs for policy violations

**Issue: Form Not Revalidating After Submission**
- Cause: Missing `revalidatePath()` in server action
- Fix: Call `revalidatePath('/your-path')` before redirect
- Example: `revalidatePath('/events')`

**Issue: Responsive Layout Breaking**
- Cause: Fixed pixel values or missing breakpoints
- Fix: Use Tailwind responsive prefixes (sm:, md:, lg:)
- Test: Check on actual devices or browser dev tools

### Development Workflow

**Local Development:**
1. Run `pnpm dev` for Next.js development server
2. Run `pnpm build` to build for production
3. Supabase local dev: `npx supabase start` (optional)
4. Use .env.local for environment variables

**Database Changes:**
1. Make schema changes in Supabase dashboard or SQL editor
2. Document in SPEC.MD
3. Consider creating migration files for version control

**Code Review Checklist:**
- [ ] TypeScript types are correct
- [ ] Error handling is present
- [ ] RLS policies are tested
- [ ] Responsive design works
- [ ] Accessibility considerations
- [ ] Performance impact assessed

### Useful Supabase Patterns

**Upsert (Insert or Update):**
```typescript
const { error } = await supabase
  .from('rsvps')
  .upsert({ event_id: 1, user_id: userId, status: 'going' })
  .eq('event_id', 1)
  .eq('user_id', userId)
```

**Conditional Queries:**
```typescript
let query = supabase.from('events').select('*')

if (category) {
  query = query.eq('category', category)
}

if (startDate) {
  query = query.gte('event_date', startDate)
}

const { data } = await query
```

**Counting Related Records:**
```typescript
const { data } = await supabase
  .from('events')
  .select('*, rsvps(count)')
```

### Git Workflow

**Branch Naming:**
- feature/description
- fix/description
- docs/description

**Commit Messages:**
- Use imperative mood: "Add feature" not "Added feature"
- Keep first line under 50 chars
- Add detailed description if needed

**Example:**
```
Add event categories support

- Create event_categories table
- Add category mappings
- Update CreateEventForm with category selection
- Add category badges to EventCard
```

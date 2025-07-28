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

0xaif-eu/ 
├── app/ # App Router directory 
│ ├── (auth)/ # Authentication related routes 
│ │ └── callback/ # Auth callback route 
│ ├── events/ # Events feature 
│ │ ├── [id]/ # Dynamic event pages 
│ │ └── create/ # Event creation 
│ ├── login/ # Login page 
│ ├── layout.tsx # Root layout 
│ └── page.tsx # Home page 
├── components/ # Reusable UI components 
│ ├── AccountForm.tsx # User account management 
│ ├── CreateEventForm.tsx # Event creation form 
│ ├── EventCard.tsx # Event display card 
│ └── EventList.tsx # Events listing 
├── lib/ # Utility functions 
│ └── supabase/ # Supabase client setup 
├── public/ # Static assets 
└── types/ # TypeScript type definitions


## Features

### 1. Authentication
- Email/Password authentication
- OAuth providers (GitHub, Google)
- Protected routes
- Session management
- User profile management

### 2. Events System
- Create and manage events
- RSVP functionality
- Event details and listing
- Filtering and sorting

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

CREATE TABLE public.events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name text NOT NULL,
  description text,
  event_date timestamp with time zone NOT NULL,
  location text,
  organizer_id uuid,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.profiles(id)
);
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
CREATE TABLE public.rsvps (
  event_id bigint NOT NULL,
  user_id uuid NOT NULL,
  CONSTRAINT rsvps_pkey PRIMARY KEY (event_id, user_id),
  CONSTRAINT rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT rsvps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
```

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
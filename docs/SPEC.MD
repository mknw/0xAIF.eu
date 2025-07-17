# SPEC.MD

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




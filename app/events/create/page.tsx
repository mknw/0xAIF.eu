import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateEventForm from '@/components/CreateEventForm'

export default async function CreateEventPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?message=You must be logged in to create an event.')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white">Create a New Event</h1>
        <CreateEventForm />
      </div>
    </div>
  )
}

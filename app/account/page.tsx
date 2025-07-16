import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AccountForm from '@/components/AccountForm'

export default async function Account() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows were found, which is fine for a new user.
    console.error('Error fetching profile:', error)
    // Optionally, handle this error more gracefully in the UI
  }

  return <AccountForm user={user} profile={profile} />
}

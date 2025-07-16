'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { type User } from '@supabase/supabase-js'

// Define the type for the profile data
type Profile = {
  username: string | null
  website: string | null
  full_name: string | null
}

export default function AccountForm({ user, profile }: { user: User, profile: Profile | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFullname(profile.full_name)
      setUsername(profile.username)
      setWebsite(profile.website)
    }
    setLoading(false)
  }, [profile])

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullname,
      username,
      website,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      alert('Error updating the data: ' + error.message)
    } else {
      alert('Profile updated successfully!')
    }
    setLoading(false)
  }

  return (
    <div className="form-widget max-w-lg mx-auto p-8 bg-gray-800 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-white">Your Profile</h1>
      <p className="text-gray-400 mb-6">Manage your public profile information.</p>
      <form id="profile-form" onSubmit={updateProfile} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input id="email" type="text" value={user?.email} disabled className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed" />
        </div>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-300">Website</label>
          <input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </form>

      <div className="flex items-center space-x-4 pt-4 border-t border-gray-700 mt-6">
        <button type="submit" form="profile-form" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
        <form action="/auth/signout" method="post">
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500" type="submit">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}

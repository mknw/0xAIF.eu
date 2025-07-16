import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AuthButton() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return user ? (
    <div className="flex items-center gap-4 text-white">
      <Link href="/account" className="py-2 px-3 flex rounded-md no-underline hover:bg-gray-800">
        Hey, {user.email}!
      </Link>
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md bg-red-500 hover:bg-red-600">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-4 rounded-md bg-white text-black font-semibold"
    >
      Login
    </Link>
  )
}

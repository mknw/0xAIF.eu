import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Authentication Error</h1>
        <p className="mt-3 text-lg">Something went wrong during authentication.</p>
        <p className="mt-2 text-md">Please try again.</p>
        <Link href="/login" className="mt-8 inline-block px-8 py-3 font-semibold rounded-md bg-white text-black">
          Back to Login
        </Link>
      </div>
    </div>
  )
}

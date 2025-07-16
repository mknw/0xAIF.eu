export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold">
          0xAIF.eu
        </h1>
        <p className="mt-3 text-2xl">
          The hub for technical AI practitioners to solve real-world problems.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="px-8 py-3 font-semibold rounded-md bg-white text-black">
            Join Community
          </button>
          <button className="px-8 py-3 font-semibold rounded-md border border-gray-600">
            Explore Events
          </button>
        </div>
      </div>
    </main>
  );
}

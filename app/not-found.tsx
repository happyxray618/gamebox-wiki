import Link from "next/link"

export default function NotFound() {
  return <main className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-6 text-center text-white">
    <p className="text-sm tracking-[0.3em] text-zinc-400">404 / GAMEBOX.WIKI</p>
    <h1 className="mt-5 text-5xl font-black">PAGE NOT FOUND.</h1>
    <p className="mt-6 text-zinc-400">This page is missing. Your next great game is still out there.</p>
    <Link href="/games" className="mt-8 rounded-full bg-white px-6 py-3 font-bold text-black">Explore the game database</Link>
  </main>
}

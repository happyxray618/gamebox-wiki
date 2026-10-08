import Link from "next/link"
import SiteHeader from "@/components/site-header"

export default function NotFound() {
  return <div className="min-h-screen bg-[#09090b] text-white"><SiteHeader /><main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
    <p className="text-sm tracking-[0.3em] text-zinc-400">404 / GAMEBOX.WIKI</p>
    <h1 className="mt-5 text-5xl font-black">PAGE NOT FOUND.</h1>
    <p className="mt-6 text-zinc-400">This page is missing. Your next great game is still out there.</p>
    <Link href="/games" className="mt-8 rounded-full bg-white px-6 py-3 font-bold text-black">Explore the game database</Link>
  </main></div>
}

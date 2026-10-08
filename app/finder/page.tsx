import GameCatalog from "@/components/game-catalog"
import SiteHeader from "@/components/site-header"
import { pageMetadata } from "@/lib/metadata"
import { Suspense } from "react"

export const metadata = pageMetadata("Game Finder", "Find your next game by genre, platform, difficulty, mood, gameplay and release era.", "/finder")

export default function FinderPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <SiteHeader active="/finder" />
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">
        <p className="text-sm font-bold tracking-[0.3em] text-zinc-500">GAME DISCOVERY ENGINE</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">FIND YOUR<br />NEXT GAME.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">Tell GAMEBOX what you want to play. Combine filters to discover games that match your mood.</p>
      </section>
      <Suspense fallback={<p className="mx-auto max-w-7xl px-6 py-10 text-zinc-400">Loading game finder…</p>}><GameCatalog advanced /></Suspense>
      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-zinc-500">GAMEBOX.WIKI — DISCOVER. REMEMBER. PLAY.</footer>
    </main>
  )
}

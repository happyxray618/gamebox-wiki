import GameCatalog from "@/components/game-catalog"
import SiteHeader from "@/components/site-header"
import { pageMetadata } from "@/lib/metadata"
import { Suspense } from "react"

export const metadata = pageMetadata("Game Finder", "Discover games by mood, gameplay, pacing, perspective and structure, with explained match scores.", "/finder")

export default function FinderPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <SiteHeader active="/finder" />
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">
        <p className="text-sm font-bold tracking-[0.3em] text-zinc-500">GAME DISCOVERY ENGINE</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">FIND YOUR<br />NEXT GAME.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">Choose the Game DNA you want to play. Discover exact and partial matches, with a clear reason for every recommendation.</p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Search and platform narrow the archive. Game DNA expresses your preferences; match scores show how closely each game fits them.</p>
      </section>
      <Suspense fallback={<p className="mx-auto max-w-7xl px-6 py-10 text-zinc-400">Loading game finder…</p>}><GameCatalog advanced /></Suspense>
      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-zinc-500">GAMEBOX.WIKI — DISCOVER. REMEMBER. PLAY.</footer>
    </main>
  )
}

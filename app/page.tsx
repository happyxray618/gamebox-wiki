"use client"

import SiteHeader from "@/components/site-header"

import { useState } from "react"
import Link from "next/link"
import { games } from "@/data/games"
import { emptyFilters, filterGames } from "@/lib/discovery"

export default function Home() {
  const [search, setSearch] = useState("")

  const searchResults = search.trim()
    ? filterGames(games, { ...emptyFilters, query: search }).slice(0, 6)
    : []

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <SiteHeader />

      {/* Hero */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">
          <p className="mb-6 text-sm font-bold tracking-[0.35em] text-zinc-500">
            GLOBAL GAME DISCOVERY
          </p>

          <h1 className="max-w-5xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-8xl">
            DISCOVER.
            <br />
            REMEMBER.
            <br />
            PLAY.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
            Discover great games across generations.
            Explore classics, cult favorites and hidden gems.
          </p>

          {/* Search */}
          <div className="relative mt-12 max-w-3xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-5 pr-6 text-lg text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

            {/* Search Results */}
            {search.trim() && (
              <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#111113] shadow-2xl">
                {searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((game) => (
                      <Link
                        key={game.id}
                        href={`/games/${game.slug}`}
                        onClick={() => setSearch("")}
                        className="flex items-center justify-between border-b border-white/5 px-6 py-5 transition hover:bg-white/[0.05]"
                      >
                        <div>
                          <div className="font-bold">
                            {game.title}
                          </div>

                          <div className="mt-1 text-sm text-zinc-500">
                            {game.year} · {game.developer}
                          </div>
                        </div>

                        <div className="text-sm font-bold">
                          {game.gameboxScore}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-6 text-sm text-zinc-500">
                    No games found.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-5 text-sm text-zinc-600">
            Try searching for: Silent Hill, Dark Souls, Deus Ex
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
              FEATURED
            </p>

            <h2 className="mt-3 text-3xl font-black">
              ESSENTIAL GAMES
            </h2>
          </div>

          <Link
            href="/games"
            className="hidden text-sm text-zinc-500 hover:text-white md:block"
          >
            VIEW ALL GAMES →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {games.slice(0, 4).map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06]"
            >
              <div className="flex justify-between text-xs text-zinc-600">
                <span>{game.year}</span>
                <span>{game.gameboxScore}</span>
              </div>

              <h3 className="mt-6 text-xl font-black">
                {game.title}
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                {game.developer}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {game.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-zinc-500"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Finder */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
            DISCOVERY ENGINE
          </p>

          <h2 className="mt-3 text-4xl font-black">
            FIND YOUR NEXT GAME.
          </h2>

          <p className="mt-5 max-w-2xl text-zinc-500">
            Find games by genre, platform and difficulty.
            Discover something you might have missed.
          </p>

          <Link
            href="/finder"
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            OPEN GAME FINDER →
          </Link>
        </div>
      </section>

      {/* Retro */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
          RETRO VAULT
        </p>

        <h2 className="mt-3 text-4xl font-black">
          GAMES WORTH REMEMBERING.
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {["PS1", "PS2", "Dreamcast", "Xbox", "Arcade"].map(
            (platform) => (
              <Link
                key={platform}
                href={`/retro/${platform.toLowerCase()}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center font-bold transition hover:border-white/30 hover:bg-white/[0.06]"
              >
                {platform}
              </Link>
            )
          )}
        </div>
      </section>

      {/* Hidden Gems */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
            CULT & HIDDEN GEMS
          </p>

          <h2 className="mt-3 text-4xl font-black">
            GAMES YOU MAY HAVE MISSED.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[...games]
  .sort((a, b) => b.hiddenGemScore - a.hiddenGemScore)
  .slice(0, 4)
  .map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/30"
                >
                  <div className="text-xs text-zinc-600">
                    HIDDEN GEM {game.hiddenGemScore}
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    {game.title}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    {game.tags.slice(0, 2).join(" · ")}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section
        id="newsletter"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-16">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
            GAMEBOX NEWSLETTER
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            ONE GREAT GAME.
            <br />
            EVERY WEEK.
          </h2>

          <p className="mt-6 max-w-xl text-zinc-500">
            Hidden gems, forgotten classics, retro discoveries
            and games worth playing.
          </p>

          <p className="mt-8 text-sm text-zinc-400">Coming soon. Newsletter subscriptions are not open yet.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-zinc-600">
          GAMEBOX.WIKI — DISCOVER. REMEMBER. PLAY.
        </div>
      </footer>
    </main>
  )
}

"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { games } from "@/data/games"

export default function FinderPage() {
  const [genre, setGenre] = useState("All")
  const [platform, setPlatform] = useState("All")
  const [difficulty, setDifficulty] = useState("All")

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const genreMatch =
        genre === "All" || game.genres.includes(genre)

      const platformMatch =
        platform === "All" || game.platforms.includes(platform)

      const difficultyMatch =
        difficulty === "All" || game.difficulty === difficulty

      return genreMatch && platformMatch && difficultyMatch
    })
  }, [genre, platform, difficulty])

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-widest"
          >
            GAMEBOX.WIKI
          </Link>

          <nav className="flex gap-6 text-sm text-zinc-400">
            <Link href="/games" className="hover:text-white">
              GAMES
            </Link>

            <Link href="/finder" className="text-white">
              FINDER
            </Link>

            <Link href="/retro" className="hover:text-white">
              RETRO
            </Link>

            <Link href="/hidden-gems" className="hover:text-white">
              HIDDEN GEMS
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">
        <p className="text-sm font-bold tracking-[0.3em] text-zinc-500">
          GAME DISCOVERY ENGINE
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
          FIND YOUR
          <br />
          NEXT GAME.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Tell GAMEBOX what you want to play.
          We&apos;ll find games that match.
        </p>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Genre */}
            <div>
              <label className="mb-3 block text-xs font-bold tracking-[0.2em] text-zinc-500">
                GENRE
              </label>

              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-4 text-white outline-none"
              >
                <option value="All">All Genres</option>
                <option value="Horror">Horror</option>
                <option value="Survival Horror">
                  Survival Horror
                </option>
                <option value="Action RPG">
                  Action RPG
                </option>
                <option value="RPG">RPG</option>
                <option value="Immersive Sim">
                  Immersive Sim
                </option>
                <option value="Stealth">Stealth</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="mb-3 block text-xs font-bold tracking-[0.2em] text-zinc-500">
                PLATFORM
              </label>

              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-4 text-white outline-none"
              >
                <option value="All">All Platforms</option>
                <option value="PS1">PS1</option>
                <option value="PS2">PS2</option>
                <option value="PS3">PS3</option>
                <option value="Xbox">Xbox</option>
                <option value="Xbox 360">Xbox 360</option>
                <option value="PC">PC</option>
                <option value="Dreamcast">Dreamcast</option>
                <option value="GameCube">GameCube</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="mb-3 block text-xs font-bold tracking-[0.2em] text-zinc-500">
                DIFFICULTY
              </label>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-4 text-white outline-none"
              >
                <option value="All">Any Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Very Hard">Very Hard</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
              MATCHING GAMES
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {filteredGames.length} GAMES FOUND
            </h2>
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-10 text-center text-zinc-500">
            No games match your current filters.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">
                    {game.year}
                  </span>

                  <span className="font-bold">
                    {game.gameboxScore}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black">
                  {game.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  {game.developer}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {game.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-zinc-600">
          GAMEBOX.WIKI — DISCOVER. REMEMBER. PLAY.
        </div>
      </footer>
    </main>
  )
}
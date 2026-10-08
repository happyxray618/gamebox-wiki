"use client"

import { useState } from "react"
import Link from "next/link"
import { games } from "@/data/games"
import { emptyFilters, filterGames, gameEra, type Filters } from "@/lib/discovery"

const options = {
  genre: [...new Set(games.flatMap((game) => game.genres))].sort(),
  platform: [...new Set(games.flatMap((game) => game.platforms))].sort(),
  difficulty: [...new Set(games.map((game) => game.difficulty))].sort(),
  mood: [...new Set(games.flatMap((game) => game.mood))].sort(),
  gameplay: [...new Set(games.flatMap((game) => game.gameplay))].sort(),
  era: [...new Set(games.map((game) => gameEra(game.year)))].sort(),
}

export default function GameCatalog({ advanced = false }: { advanced?: boolean }) {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [sort, setSort] = useState("score")
  const fields = advanced
    ? ["genre", "platform", "difficulty", "mood", "gameplay", "era"] as const
    : ["genre", "platform", "era"] as const
  const results = filterGames(games, filters).sort((a, b) =>
    sort === "title" ? a.title.localeCompare(b.title) :
    sort === "newest" ? b.year - a.year :
    sort === "oldest" ? a.year - b.year : b.gameboxScore - a.gameboxScore
  )
  const controlClass = "w-full rounded-xl border border-white/15 bg-[#111113] px-4 py-3 text-white outline-none focus-visible:border-white/60"

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <label htmlFor="catalog-search" className="mb-2 block text-xs font-bold tracking-widest text-zinc-400">SEARCH GAMES</label>
        <input id="catalog-search" type="search" value={filters.query}
          onChange={(event) => setFilters({ ...filters, query: event.target.value })}
          placeholder="Title, developer, genre or keyword" className={controlClass} />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <div key={field}>
              <label htmlFor={`filter-${field}`} className="mb-2 block text-xs font-bold tracking-widest text-zinc-400">{field.toUpperCase()}</label>
              <select id={`filter-${field}`} value={filters[field]} className={controlClass}
                onChange={(event) => setFilters({ ...filters, [field]: event.target.value })}>
                <option value="">Any {field}</option>
                {options[field].map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => { setFilters(emptyFilters); setSort("score") }}
          className="mt-6 rounded-full border border-white/20 px-5 py-2 text-sm text-zinc-300 hover:bg-white/10">Reset filters</button>
      </div>
      <div className="my-8 flex flex-wrap items-center justify-between gap-4">
        <h2 aria-live="polite" aria-atomic="true" className="text-2xl font-black">{results.length} GAMES FOUND</h2>
        <div className="flex items-center gap-3">
          <label htmlFor="catalog-sort" className="text-sm text-zinc-400">Sort by</label>
          <select id="catalog-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-white/15 bg-[#111113] px-3 py-2">
            <option value="score">Gamebox score</option><option value="title">Title A–Z</option>
            <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>
      {results.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-10 text-center">
          <p className="text-zinc-400">No games match your current filters.</p>
          <button onClick={() => setFilters(emptyFilters)} className="mt-4 font-bold underline underline-offset-4">Browse all games</button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((game) => (
            <Link key={game.id} href={`/games/${game.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06]">
              <div className="flex justify-between text-xs text-zinc-400"><span>{game.year}</span><span>GAMEBOX {game.gameboxScore}</span></div>
              <h3 className="mt-5 text-xl font-black">{game.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{game.developer}</p>
              <div className="mt-5 flex flex-wrap gap-2">{game.genres.map((genre) => <span key={genre} className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-400">{genre}</span>)}</div>
              <p className="mt-5 border-t border-white/10 pt-4 text-xs text-zinc-400">{game.platforms.join(" · ")}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

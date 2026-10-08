"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { games } from "@/data/games"
import { filterGames, filterOptions as options, parseCatalogParams, catalogQuery, type Filters, type CatalogSort } from "@/lib/discovery"
import { rankGames, scoreGame, intentFromFilters } from "@/lib/ranking"

export default function GameCatalog({ advanced = false }: { advanced?: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchEditing = useRef(false)
  useEffect(() => {
    const stopEditing = () => { searchEditing.current = false }
    window.addEventListener("popstate", stopEditing)
    return () => window.removeEventListener("popstate", stopEditing)
  }, [])
  const defaultSort = advanced ? "match" : "score"
  const { filters, sort } = parseCatalogParams(searchParams, defaultSort)
  function update(nextFilters: Filters, nextSort: CatalogSort = sort, replace = false) {
    const query = catalogQuery(nextFilters, nextSort, defaultSort)
    const url = pathname + (query ? `?${query}` : "")
    // Next.js native History integration keeps useSearchParams and back/forward in sync.
    // Read from the URL directly; there is no duplicate local filter state to drift.
    if (replace) window.history.replaceState(null, "", url)
    else window.history.pushState(null, "", url)
  }
  function setFilters(nextFilters: Filters) { searchEditing.current = false; update(nextFilters) }
  function reset() { searchEditing.current = false; window.history.pushState(null, "", pathname) }
  const fields = advanced
    ? ["genre", "platform", "difficulty", "mood", "gameplay", "era", "pacing", "perspective", "structure"] as const
    : ["genre", "platform", "era"] as const
  const intent = intentFromFilters(filters)
  const results = advanced ? rankGames(games, intent, undefined, sort) :
    filterGames(games, filters).sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title, "en") :
      sort === "newest" ? b.year - a.year :
      sort === "oldest" ? a.year - b.year : b.gameboxScore - a.gameboxScore
    ).map((game) => scoreGame(game, intent))
  const controlClass = "w-full rounded-xl border border-white/15 bg-[#111113] px-4 py-3 text-white outline-none focus-visible:border-white/60"

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <label htmlFor="catalog-search" className="mb-2 block text-xs font-bold tracking-widest text-zinc-400">SEARCH GAMES</label>
        <input id="catalog-search" type="search" value={filters.query}
          maxLength={200} onBlur={() => { searchEditing.current = false }}
          onChange={(event) => {
            update({ ...filters, query: event.target.value.slice(0, 200) }, sort, searchEditing.current)
            searchEditing.current = true
          }}
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
        <button type="button" onClick={reset}
          className="mt-6 rounded-full border border-white/20 px-5 py-2 text-sm text-zinc-300 hover:bg-white/10">Reset filters</button>
      </div>
      <div className="my-8 flex flex-wrap items-center justify-between gap-4">
        <h2 aria-live="polite" aria-atomic="true" className="text-2xl font-black">{results.length} GAMES FOUND</h2>
        <div className="flex items-center gap-3">
          <label htmlFor="catalog-sort" className="text-sm text-zinc-400">{advanced ? "Break ties by" : "Sort by"}</label>
          <select id="catalog-sort" value={sort} onChange={(event) => update(filters, event.target.value as CatalogSort)} className="rounded-lg border border-white/15 bg-[#111113] px-3 py-2">
            <option value="match">Best match</option><option value="score">Gamebox score</option><option value="title">Title A–Z</option>
            <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>
      {advanced && results.length > 0 && <p className="mb-8 text-sm leading-6 text-zinc-400">{results.some((result) => result.hasIntent) ? "Results are ranked by your preferences. Partial matches show which preferences are missing; sorting only breaks relevance ties." : "Browse all games, or choose preferences to see match scores and explanations."}</p>}
      {results.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-10 text-center">
          <p className="text-zinc-400">No games match your current filters.</p>
          <button onClick={reset} className="mt-4 font-bold underline underline-offset-4">Browse all games</button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map(({ game, hasIntent, totalMatchScore, matchedDNA, explanation, unmetPreferences, factors }) => (
            <article key={game.id} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06]">
              <div className="flex justify-between text-xs text-zinc-400"><span>{game.year}</span><span>GAMEBOX {game.gameboxScore}</span></div>
              <h3 className="mt-5 break-words text-xl font-black"><Link href={`/games/${game.slug}`} className="inline-flex min-h-11 items-center hover:underline focus-visible:underline">{game.title}</Link></h3>
              <p className="mt-2 text-sm text-zinc-400">{game.developer}</p>
              {advanced && hasIntent && <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xs font-bold tracking-widest text-zinc-400">MATCH SCORE</p>
                <p className="mt-2 text-2xl font-black">{totalMatchScore}% MATCH</p>
                {matchedDNA.length > 0 && <p className="mt-3 text-sm text-zinc-300">{matchedDNA.join(" · ")}</p>}
                <h4 className="mt-4 text-xs font-bold tracking-widest">WHY IT MATCHES</h4>
                <p className="mt-2 break-words text-sm leading-6 text-zinc-400">{explanation}</p>
                {unmetPreferences.length > 0 && <p className="mt-3 text-xs leading-5 text-zinc-400">Not matched: {unmetPreferences.join(" · ")}</p>}
                <details className="mt-4 text-xs text-zinc-400">
                  <summary className="min-h-8 cursor-pointer">Match breakdown</summary>
                  <ul className="mt-2 space-y-2">{factors.map((factor) => <li key={factor.dimension} className="flex flex-wrap justify-between gap-2"><span>{factor.dimension}: {factor.matched.length ? factor.matched.join(", ") : "Not matched"}</span><span>{Number(factor.contribution.toFixed(2))} / {factor.weight} points</span></li>)}</ul>
                </details>
              </div>}
              <div className="mt-5 flex flex-wrap gap-2">{game.genres.map((genre) => <span key={genre} className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-400">{genre}</span>)}</div>
              <p className="mt-5 border-t border-white/10 pt-4 text-xs text-zinc-400">{game.platforms.join(" · ")}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

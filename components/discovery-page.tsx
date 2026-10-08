import Link from "next/link"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/site-header"
import { discoveryGames, discoveryValue, discoveryValues, type DiscoveryKind } from "@/lib/taxonomy"
import { catalogQuery, emptyFilters } from "@/lib/discovery"
import { pageMetadata } from "@/lib/metadata"

const filterKeys = { genres: "genre", platforms: "platform", moods: "mood", gameplay: "gameplay" } as const
const labels = { genres: "GENRE", platforms: "PLATFORM", moods: "MOOD", gameplay: "GAMEPLAY" }

export function discoveryMetadata(kind: DiscoveryKind, slug: string) {
  const item = discoveryValue(kind, slug)
  if (!item) notFound()
  return pageMetadata(`${item.value} Games`, `Discover ${item.value} games in the GAMEBOX archive. Browse curated recommendations and find your next game.`, `/${kind}/${item.slug}`)
}

export default function DiscoveryPage({ kind, slug }: { kind: DiscoveryKind; slug: string }) {
  const item = discoveryValue(kind, slug)
  if (!item) notFound()
  const games = discoveryGames(kind, item.value)
  const finderQuery = catalogQuery({ ...emptyFilters, [filterKeys[kind]]: item.value })
  return <main className="min-h-screen bg-[#09090b] text-white">
    <SiteHeader />
    <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">
      <p className="text-sm font-bold tracking-[0.3em] text-zinc-400">DISCOVER BY {labels[kind]}</p>
      <h1 className="mt-4 break-words text-4xl font-black tracking-tight md:text-7xl">{item.value.toUpperCase()} GAMES.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">Explore {games.length} {item.value} games from our curated archive. Find a familiar favorite or discover something new.</p>
      <Link href={`/finder?${finderQuery}`} className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 font-bold hover:bg-white/10">Refine in Game Finder →</Link>
    </section>
    <section aria-label={`${item.value} games`} className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => <Link key={game.slug} href={`/games/${game.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/30">
        <div className="flex justify-between text-xs text-zinc-400"><span>{game.year}</span><span>GAMEBOX {game.gameboxScore}</span></div>
        <h2 className="mt-5 break-words text-xl font-black">{game.title}</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{game.description}</p>
        <p className="mt-5 text-xs text-zinc-400">{game.platforms.join(" · ")}</p>
      </Link>)}
    </section>
    <section className="mx-auto max-w-7xl border-t border-white/10 px-6 py-10">
      <h2 className="mb-5 text-xl font-black">EXPLORE MORE</h2>
      <div className="flex flex-wrap gap-3">{discoveryValues(kind).filter((value) => value.slug !== slug).map((value) => <Link key={value.slug} href={`/${kind}/${value.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm text-zinc-300 hover:border-white/40">{value.value}</Link>)}</div>
    </section>
  </main>
}

import Link from "next/link"
import SiteHeader from "@/components/site-header"
import { games } from "@/data/games"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata("Hidden Gems", "Rediscover cult favorites and overlooked games, ranked by the GAMEBOX Hidden Gem score.", "/hidden-gems")

export default function HiddenGemsPage() {
  const hiddenGems = [...games].filter((game) => game.hiddenGemScore >= 90)
    .sort((a, b) => b.hiddenGemScore - a.hiddenGemScore || b.gameboxScore - a.gameboxScore)
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <SiteHeader active="/hidden-gems" />
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">
        <p className="text-sm font-bold tracking-[0.3em] text-zinc-500">CULT FAVORITES & OVERLOOKED CLASSICS</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">HIDDEN GEMS.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">Discover games that deserve another look. Strange worlds, bold ideas and adventures worth remembering.</p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">{hiddenGems.length} games with a Hidden Gem score of 90 or higher. Scores are provisional GAMEBOX editorial ratings, rather than sales or popularity measurements.</p>
      </section>
      <section aria-label="Hidden gem games" className="mx-auto grid max-w-7xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {hiddenGems.map((game) => (
          <Link key={game.id} href={`/games/${game.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/30">
            <div className="flex justify-between text-xs text-zinc-400"><span>{game.year}</span><span>HIDDEN GEM {game.hiddenGemScore}</span></div>
            <h2 className="mt-5 text-2xl font-black">{game.title}</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">{game.whyPlay}</p>
            <p className="mt-6 text-xs text-zinc-400">{game.platforms.join(" · ")}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}

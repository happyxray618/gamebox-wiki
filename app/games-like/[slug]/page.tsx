import Link from "next/link"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SimilarGameCards from "@/components/similar-game-cards"
import { games } from "@/data/games"
import { dnaValues, experienceDefinitions, type DNADimension } from "@/lib/game-dna"
import { pageMetadata } from "@/lib/metadata"
import { similarityWeights } from "@/lib/similarity"

import { discoveryJourney } from "@/lib/discovery-experience"
import { traitDistinctiveness } from "@/lib/distinctiveness"

type Props = { params: Promise<{ slug: string }> }
export const dynamicParams = false
export function generateStaticParams() { return games.map(game => ({ slug: game.slug })) }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const game = games.find(item => item.slug === slug)
  if (!game) notFound()
  return pageMetadata(`Games Like ${game.title}`, `What makes a game feel like ${game.title}? Explore shared Game DNA and explained similar games.`, `/games-like/${game.slug}`)
}
export default async function GamesLikePage({ params }: Props) {
  const { slug } = await params
  const game = games.find(item => item.slug === slug)
  if (!game) notFound()
  const journey = discoveryJourney(game, games)
  const dimensions = Object.keys(similarityWeights) as DNADimension[]
  const defining = dimensions.slice().sort((a, b) => similarityWeights[b] - similarityWeights[a]).slice(0, 5)
  const distinctive = (["experience", "mood", "genre"] as const).flatMap(dimension => dnaValues(game, dimension).map(value => ({ dimension, value, rarity: traitDistinctiveness(dimension, value) })))
    .sort((a, b) => b.rarity - a.rarity || a.value.localeCompare(b.value, "en")).slice(0, 5)
  return <main className="min-h-screen bg-[#09090b] text-white">
    <SiteHeader active="/games" />
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link href={`/games/${game.slug}`} className="inline-flex min-h-11 items-center text-sm text-zinc-400 hover:text-white">View {game.title} game details</Link>
      <p className="mt-8 text-xs font-bold tracking-widest text-zinc-400">GAMES LIKE</p>
      <h1 className="mt-4 break-words text-4xl font-black sm:text-5xl">What makes {game.title} distinctive?</h1>
      <p className="mt-6 max-w-3xl leading-7 text-zinc-300">Start with its Game DNA: {defining.map(dimension => `${dnaValues(game, dimension).join(" / ")} ${dimension}`).join("; ")}. These recorded characteristics shape the comparisons below.</p>
      <p className="mt-4 max-w-3xl leading-7 text-zinc-300">Its experience centers on {game.experience.map(value => experienceDefinitions[value]).join("; ")}. Mood describes the atmosphere; Experience describes how you engage with the game.</p>
      <p className="mt-6 text-xs font-bold tracking-widest text-zinc-400">LESS COMMON DNA IN OUR LIBRARY</p>
      <ul className="mt-3 flex flex-wrap gap-3">{distinctive.map(trait => <li key={`${trait.dimension}-${trait.value}`} className="rounded-full border border-white/15 px-4 py-2 text-sm">{trait.value} <span className="text-zinc-400">· {trait.dimension}</span></li>)}</ul>
      <section className="mt-12" aria-labelledby="source-dna">
        <h2 id="source-dna" className="text-2xl font-black">{game.title} — GAME DNA</h2>
        <details className="mt-4"><summary className="min-h-11 cursor-pointer py-3 text-zinc-300">View complete Game DNA</summary><dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{dimensions.map(dimension => <div key={dimension} className="min-w-0 rounded-xl border border-white/10 p-5">
          <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">{dimension}</dt><dd className="mt-3 text-sm leading-6">{dnaValues(game, dimension).join(" · ")}</dd>
        </div>)}</dl></details>
      </section>
      {journey.honesty && <aside className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-6" aria-label="Match confidence notice"><p className="leading-7 text-amber-100">{journey.honesty}</p></aside>}
      {([
        { id: "best-match", title: "BEST MATCH", pick: journey.bestMatch, empty: "No similar game is available in the current library." },
        { id: "hidden-gem", title: "HIDDEN GEM", pick: journey.hiddenGem, empty: "No Hidden Gem clears the relevance requirement for this game. We will not substitute an unrelated high-rated game." },
        { id: "surprise-me", title: "SURPRISE ME", pick: journey.surpriseMe, empty: "No relevant surprise clears the shared distinctive DNA requirement yet." },
      ]).map(section => <section key={section.id} className="mt-14" aria-labelledby={section.id} data-discovery-mode={section.id}>
        <h2 id={section.id} className="text-3xl font-black">{section.title}</h2>
        {section.pick ? <><p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">{section.pick.reason}</p><SimilarGameCards recommendations={[section.pick.match]} /></>
          : <p className="mt-4 max-w-3xl leading-7 text-zinc-400">{section.empty}</p>}
      </section>)}
      <section className="mt-14" aria-labelledby="more-dna">
        <h2 id="more-dna" className="text-3xl font-black">MORE GAMES WITH THIS DNA</h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">Continue exploring shared identity, interaction and context. Similarity describes recorded DNA overlap, not a probability that you will enjoy a game.</p>
        <SimilarGameCards recommendations={journey.more} />
      </section>
    </div>
    <footer className="border-t border-white/10 px-6 py-10 text-sm text-zinc-500">GAMEBOX.WIKI — DISCOVER. REMEMBER. PLAY.</footer>
  </main>
}

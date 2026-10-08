import Link from "next/link"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SimilarGameCards from "@/components/similar-game-cards"
import { games } from "@/data/games"
import { dnaValues, experienceDefinitions, type DNADimension } from "@/lib/game-dna"
import { pageMetadata } from "@/lib/metadata"
import { recommendSimilarGames, similarityWeights } from "@/lib/similarity"

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
  const dimensions = Object.keys(similarityWeights) as DNADimension[]
  const defining = dimensions.slice().sort((a, b) => similarityWeights[b] - similarityWeights[a]).slice(0, 5)
  return <main className="min-h-screen bg-[#09090b] text-white">
    <SiteHeader active="/games" />
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link href={`/games/${game.slug}`} className="inline-flex min-h-11 items-center text-sm text-zinc-400 hover:text-white">View {game.title} game details</Link>
      <p className="mt-8 text-xs font-bold tracking-widest text-zinc-400">GAMES LIKE</p>
      <h1 className="mt-4 break-words text-4xl font-black sm:text-5xl">What makes a game feel like {game.title}?</h1>
      <p className="mt-6 max-w-3xl leading-7 text-zinc-300">Start with its Game DNA: {defining.map(dimension => `${dnaValues(game, dimension).join(" / ")} ${dimension}`).join("; ")}. These recorded characteristics shape the comparisons below.</p>
      <p className="mt-4 max-w-3xl leading-7 text-zinc-300">Its experience centers on {game.experience.map(value => experienceDefinitions[value]).join("; ")}. Mood describes the atmosphere; Experience describes how you engage with the game.</p>
      <section className="mt-12" aria-labelledby="source-dna">
        <h2 id="source-dna" className="text-2xl font-black">{game.title} — GAME DNA</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{dimensions.map(dimension => <div key={dimension} className="min-w-0 rounded-xl border border-white/10 p-5">
          <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">{dimension}</dt><dd className="mt-3 text-sm leading-6">{dnaValues(game, dimension).join(" · ")}</dd>
        </div>)}</dl>
      </section>
      <section className="mt-14" aria-labelledby="similar-games">
        <h2 id="similar-games" className="text-3xl font-black">DISCOVER SIMILAR GAMES</h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">Similarity considers identity, interaction and context across nine DNA dimensions. Experience and atmosphere carry more weight, and distinctive shared traits matter more than common ones. Ratings have no influence. The strongest match stays first; close alternatives may follow earlier for variety. Percentages measure shared recorded characteristics, not a promise that you will enjoy a game.</p>
        <SimilarGameCards recommendations={recommendSimilarGames(game, games, 12)} />
      </section>
    </div>
    <footer className="border-t border-white/10 px-6 py-10 text-sm text-zinc-500">GAMEBOX.WIKI — DISCOVER. REMEMBER. PLAY.</footer>
  </main>
}

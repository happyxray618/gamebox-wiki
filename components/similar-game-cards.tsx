import Link from "next/link"
import type { SimilarGame } from "@/lib/similarity"

export default function SimilarGameCards({ recommendations }: { recommendations: readonly SimilarGame[] }) {
  if (!recommendations.length) return <p className="mt-6 text-zinc-400">No shared DNA found in the current archive. <Link href="/finder" className="underline">Explore the Finder</Link>.</p>
  return <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {recommendations.map(match => <article key={match.game.slug} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs text-zinc-400">{match.game.year}</p>
      <h3 className="mt-3 break-words text-xl font-black"><Link href={`/games/${match.game.slug}`} className="inline-flex min-h-11 items-center hover:underline">{match.game.title}</Link></h3>
      <p className="mt-4 text-2xl font-black text-emerald-300">{match.similarityPercentage}% SIMILAR</p>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{match.strongestSharedDNA.flatMap(factor => factor.values).join(" · ")}</p>
      <h4 className="mt-5 text-xs font-bold tracking-widest text-zinc-400">WHY IT&apos;S SIMILAR</h4>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{match.explanation}</p>
      {match.diversityAdjusted && <p className="mt-3 text-xs leading-5 text-zinc-400">A close match offering a different series or DNA profile.</p>}
      <details className="mt-4 text-sm text-zinc-400">
        <summary className="min-h-11 cursor-pointer py-3">Similarity breakdown</summary>
        <ul className="space-y-3">{match.breakdown.map(factor => <li key={factor.dimension}>
          <span className="capitalize">{factor.dimension}</span>: {factor.shared.join(" · ") || "No shared values"}
          <span className="block text-xs">{Math.round(factor.score * 100)}% distinctive overlap · {factor.contribution.toFixed(1)} / {factor.effectiveWeight.toFixed(1)} points</span>
        </li>)}</ul>
      </details>
    </article>)}
  </div>
}

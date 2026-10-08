import SiteHeader from "@/components/site-header"
import Link from "next/link"
import { notFound } from "next/navigation"
import { games } from "@/data/games"
import { pageMetadata } from "@/lib/metadata"
import { slugify } from "@/lib/taxonomy"
import { dnaValues, dnaVocabulary, type DNADimension } from "@/lib/game-dna"

type Props = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const game = games.find((item) => item.slug === slug)
  if (!game) notFound()
  return pageMetadata(game.title, game.description, `/games/${game.slug}`)
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params

  const game = games.find((item) => item.slug === slug)

  if (!game) {
    notFound()
  }

  const similarGames = games
    .filter(
      (item) =>
        item.id !== game.id &&
        item.genres.some((genre) => game.genres.includes(genre))
    )
    .slice(0, 4)

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <SiteHeader active="/games" />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Link
          href="/games"
          className="text-sm text-zinc-500 hover:text-white"
        >
          ← BACK TO GAME DATABASE
        </Link>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            {/* Genres */}
            <div className="mb-6 flex flex-wrap gap-2">
              {game.genres.map((genre) => (
                <Link href={`/genres/${slugify(genre)}`}
                  key={genre}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold tracking-wider text-zinc-400"
                >
                  {genre.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="max-w-4xl break-words text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              {game.title}
            </h1>

            {/* Year */}
            <p className="mt-5 text-lg text-zinc-500">
              {game.year} · {game.developer}
            </p>

            {/* Description */}
            <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-300">
              {game.description}
            </p>

            {/* Platforms */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-bold tracking-[0.2em] text-zinc-600">
                PLATFORMS
              </p>

              <div className="flex flex-wrap gap-2">
                {game.platforms.map((platform) => (
                  <Link href={`/platforms/${slugify(platform)}`}
                    key={platform}
                    className="rounded-lg bg-white/5 px-4 py-2 text-sm text-zinc-300"
                  >
                    {platform}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-start justify-start lg:justify-end">
            <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:max-w-[280px]">
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
                GAMEBOX SCORE
              </p>

              <div className="mt-4 text-7xl font-black">
                {game.gameboxScore}
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-400">Provisional GAMEBOX editorial ratings. These are not verified facts or aggregate review scores.</p>

              <p className="mt-2 text-sm text-zinc-500">
                / 100
              </p>

              <div className="mt-8 h-px bg-white/10" />

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    Retro Score
                  </span>

                  <span className="font-bold">
                    {game.retroScore}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    Hidden Gem
                  </span>

                  <span className="font-bold">
                    {game.hiddenGemScore}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    Revival Potential
                  </span>

                  <span className="font-bold">
                    {game.revivalPotential}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game DNA */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
            GAME DNA
          </p>

          <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(dnaVocabulary) as DNADimension[]).map((dimension) => <div key={dimension} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">{dimension}</dt>
              <dd className="mt-3 text-sm text-zinc-300">{dnaValues(game, dimension).join(" · ")}</dd>
            </div>)}
          </dl>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <h2 className="text-xl font-black">DISCOVER BY GAME DNA</h2>
        <p className="mt-3 text-sm text-zinc-400">Game DNA is GAMEBOX editorial classification; era comes from the sourced release year. Ratings are separate editorial judgements.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {game.mood.map((mood) => <Link key={`mood-${mood}`} href={`/moods/${slugify(mood)}`} className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm text-zinc-300">{mood}</Link>)}
          {game.gameplay.map((gameplay) => <Link key={`gameplay-${gameplay}`} href={`/gameplay/${slugify(gameplay)}`} className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm text-zinc-300">{gameplay}</Link>)}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <div>
            <h2 className="text-3xl font-black">
              ABOUT THE GAME
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-9 text-zinc-400">
              {game.description}
            </p>

            <p className="mt-6 max-w-3xl text-lg leading-9 text-zinc-400">
              {game.whyPlay}
            </p>

            {/* Where To Play */}
            <div className="mt-16">
              <h2 className="text-3xl font-black">
                WHERE CAN I PLAY IT?
              </h2>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-zinc-400">
                  Availability information will be added to the
                  GAMEBOX database.
                </p>

                <p className="mt-3 text-sm text-zinc-600">
                  We only list legal and officially available
                  platforms and services.
                </p>
              </div>
            </div>

            {/* Retro History */}
            <div className="mt-16">
              <h2 className="text-3xl font-black">
                RETRO HISTORY
              </h2>
              <p className="mt-6 leading-8 text-zinc-400">{game.retroHistory}</p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-sm text-zinc-500">
                  ORIGINAL RELEASE
                </div>

                <div className="mt-2 text-xl font-bold">
                  {game.year}
                </div>

                <div className="mt-4 text-sm text-zinc-500">
                  Developer
                </div>

                <div className="mt-1 text-zinc-300">
                  {game.developer}
                </div>

                <div className="mt-4 text-sm text-zinc-500">
                  Publisher
                </div>

                <div className="mt-1 text-zinc-300">
                  {game.publisher}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-sm font-bold tracking-widest">FACTS & SOURCES</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-400">Verified fields: title, earliest listed release year, development credits, publishing credits and listed platforms. Platform lists may include ports and remasters; current store availability is not verified.</p>
              <p className="mt-3 text-xs text-zinc-400">Checked {game.facts.verification?.verifiedAt || "Not yet verified"}.</p>
              <ul className="mt-4 space-y-3">{game.facts.sources?.map((source) => <li key={source.url}><a href={source.revisionId ? `https://en.wikipedia.org/w/index.php?oldid=${source.revisionId}` : source.url} className="break-words text-sm underline underline-offset-4 hover:text-zinc-300">{source.label}</a></li>)}</ul>
            </div>
            <div className="sticky top-8">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-bold tracking-[0.2em] text-zinc-600">
                  GAME INFO
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-xs text-zinc-600">
                      RELEASE YEAR
                    </p>

                    <p className="mt-1 font-bold">
                      {game.year}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-600">
                      DEVELOPER
                    </p>

                    <p className="mt-1 font-bold">
                      {game.developer}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-600">
                      PUBLISHER
                    </p>

                    <p className="mt-1 font-bold">
                      {game.publisher}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-600">
                      DIFFICULTY
                    </p>

                    <p className="mt-1 font-bold">
                      {game.difficulty}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Similar Games */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
            DISCOVER MORE
          </p>

          <h2 className="mt-3 text-3xl font-black">
            SIMILAR GAMES
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similarGames.map((similar) => (
              <Link
                key={similar.id}
                href={`/games/${similar.slug}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/30"
              >
                <div className="text-xs text-zinc-600">
                  {similar.year}
                </div>

                <h3 className="mt-3 text-lg font-black">
                  {similar.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  {similar.genres.join(" · ")}
                </p>

                <div className="mt-6 text-sm font-bold">
                  SCORE {similar.gameboxScore}
                </div>
              </Link>
            ))}
          </div>
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

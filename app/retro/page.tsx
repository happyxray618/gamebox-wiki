import SiteHeader from "@/components/site-header"
import Link from "next/link"
import { games } from "@/data/games"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata("Retro Vault", "Explore classic games across PlayStation, Dreamcast, Xbox, GameCube and arcade platforms.", "/retro")

const platforms = [
  "PS1",
  "PS2",
  "Dreamcast",
  "Xbox",
  "GameCube",
  "Arcade",
]

export default function RetroPage() {
  const retroGames = [...games]
    .sort((a, b) => b.retroScore - a.retroScore)

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* Header */}
      <SiteHeader active="/retro" />


      {/* Hero */}
      <section className="border-b border-white/10">

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">

          <p className="text-xs font-bold tracking-[0.35em] text-zinc-600">
            RETRO GAMING ARCHIVE
          </p>

          <h1 className="mt-5 max-w-5xl text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
            RETRO
            <br />
            VAULT.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
            Explore the games that shaped generations.
            Discover classics, cult favorites and forgotten masterpieces.
          </p>

        </div>

      </section>


      {/* Platforms */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
          BROWSE BY PLATFORM
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">

          {platforms.map((platform) => {
  const count = games.filter((game) =>
    game.platforms.includes(platform)
  ).length

  return (
    <Link
      key={platform}
      href={`/retro/${platform.toLowerCase()}`}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06]"
    >
      <div className="text-lg font-black">
        {platform}
      </div>

      <div className="mt-2 text-sm text-zinc-600">
        {count} games
      </div>
    </Link>
  )
})}

        </div>

      </section>


      {/* Retro Games */}
      <section className="border-y border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="flex flex-wrap items-end justify-between gap-4">

            <div>

              <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
                THE ARCHIVE
              </p>

              <h2 className="mt-3 text-4xl font-black">
                GAMES WORTH REMEMBERING.
              </h2>

            </div>

            <div className="text-sm text-zinc-600">
              {retroGames.length} games indexed
            </div>

          </div>


          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {retroGames.map((game) => (

              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06]"
              >

                <div className="flex justify-between text-xs text-zinc-600">

                  <span>
                    {game.year}
                  </span>

                  <span>
                    RETRO {game.retroScore}
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-black">
                  {game.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  {game.developer}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">

                  {game.platforms.slice(0, 3).map((platform) => (

                    <span
                      key={platform}
                      className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-zinc-500"
                    >
                      {platform}
                    </span>

                  ))}

                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-500">
                  {game.description}
                </p>

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

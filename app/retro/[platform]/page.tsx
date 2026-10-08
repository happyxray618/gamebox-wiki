import Link from "next/link"
import { notFound } from "next/navigation"
import { games } from "@/data/games"
import { pageMetadata } from "@/lib/metadata"

const platformNames: Record<string, string> = {
  ps1: "PS1",
  ps2: "PS2",
  dreamcast: "Dreamcast",
  xbox: "Xbox",
  gamecube: "GameCube",
  arcade: "Arcade",
}

const platformDescriptions: Record<string, string> = {
  ps1: "Explore the games that defined the original PlayStation era, from iconic classics to forgotten cult favorites.",
  ps2: "Explore the games that defined the PlayStation 2 era, from legendary classics to forgotten cult favorites.",
  dreamcast: "Discover the bold, experimental and unforgettable games that made the Dreamcast unique.",
  xbox: "Explore influential Xbox games, cult favorites and overlooked classics from the early Xbox generation.",
  gamecube: "Discover memorable GameCube adventures, cult classics and games that still deserve to be played today.",
  arcade: "Explore influential arcade games, timeless classics and forgotten machines from the golden age of arcades.",
}

export function generateStaticParams() {
  return Object.keys(platformNames).map((platform) => ({ platform }))
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params
  const key = platform.toLowerCase()
  if (!Object.hasOwn(platformNames, key)) notFound()
  return pageMetadata(`${platformNames[key]} Games`, platformDescriptions[key], `/retro/${key}`)
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ platform: string }>
}) {
  const { platform } = await params

  const platformName = Object.hasOwn(platformNames, platform.toLowerCase()) ? platformNames[platform.toLowerCase()] : undefined

  if (!platformName) {
    notFound()
  }

  const platformGames = [...games]
  .filter((game) => game.platforms.includes(platformName))
  .sort((a, b) => b.retroScore - a.retroScore)

const bestGames = [...platformGames]
  .sort((a, b) => b.gameboxScore - a.gameboxScore)
  .slice(0, 4)

const hiddenGems = [...platformGames]
  .sort((a, b) => b.hiddenGemScore - a.hiddenGemScore)
  .slice(0, 4)

const memorableGames = [...platformGames]
  .sort((a, b) => b.retroScore - a.retroScore)
  .slice(0, 4)

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-widest"
          >
            GAMEBOX.WIKI
          </Link>

          <nav className="hidden gap-6 text-sm text-zinc-400 md:flex">
            <Link href="/games" className="hover:text-white">
              GAMES
            </Link>

            <Link href="/finder" className="hover:text-white">
              FINDER
            </Link>

            <Link href="/retro" className="text-white">
              RETRO
            </Link>

            <Link href="/hidden-gems" className="hover:text-white">
              HIDDEN GEMS
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">
          <Link
            href="/retro"
            className="text-xs font-bold tracking-[0.25em] text-zinc-600 hover:text-white"
          >
            ← RETRO VAULT
          </Link>

          <p className="mt-10 text-xs font-bold tracking-[0.35em] text-zinc-600">
            RETRO PLATFORM ARCHIVE
          </p>

          <h1 className="mt-5 text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
            {platformName}
            <br />
            GAMES.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
  {platformDescriptions[platform.toLowerCase()]}
</p>

          <div className="mt-8 text-sm text-zinc-600">
            {platformGames.length} games indexed
          </div>
        </div>
      </section>
<section className="border-y border-white/10 bg-white/[0.02]">
  <div className="mx-auto max-w-7xl px-6 py-16">
    <p className="text-xs font-bold tracking-[0.25em] text-zinc-600">
      PLATFORM HIGHLIGHTS
    </p>

    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs font-bold tracking-[0.2em] text-zinc-600">
          BEST GAMES
        </p>

        <div className="mt-5 space-y-4">
          {bestGames.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="flex items-center justify-between gap-4 hover:text-zinc-300"
            >
              <span className="font-bold">
                {game.title}
              </span>

              <span className="text-sm text-zinc-600">
                {game.gameboxScore}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs font-bold tracking-[0.2em] text-zinc-600">
          HIDDEN GEMS
        </p>

        <div className="mt-5 space-y-4">
          {hiddenGems.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="flex items-center justify-between gap-4 hover:text-zinc-300"
            >
              <span className="font-bold">
                {game.title}
              </span>

              <span className="text-sm text-zinc-600">
                {game.hiddenGemScore}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs font-bold tracking-[0.2em] text-zinc-600">
          MOST MEMORABLE
        </p>

        <div className="mt-5 space-y-4">
          {memorableGames.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="flex items-center justify-between gap-4 hover:text-zinc-300"
            >
              <span className="font-bold">
                {game.title}
              </span>

              <span className="text-sm text-zinc-600">
                {game.retroScore}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
      <section className="mx-auto max-w-7xl px-6 py-20">
        {platformGames.length === 0 && (
          <div className="mb-8 rounded-2xl border border-white/10 p-8 text-zinc-400">
            <p>No {platformName} games have been indexed yet. More games are coming to the archive.</p>
            <Link href="/retro" className="mt-4 inline-block font-bold text-white hover:underline">Browse other platforms →</Link>
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {platformGames.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06]"
            >
              <div className="flex justify-between text-xs text-zinc-600">
                <span>{game.year}</span>
                <span>RETRO {game.retroScore}</span>
              </div>

              <h2 className="mt-6 text-xl font-black">
                {game.title}
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                {game.developer}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {game.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-zinc-500"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-500">
                {game.description}
              </p>

              <div className="mt-6 text-xs font-bold tracking-widest text-zinc-600 group-hover:text-white">
                VIEW GAME →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-zinc-600">
          GAMEBOX.WIKI — DISCOVER. REMEMBER. PLAY.
        </div>
      </footer>
    </main>
  )
}

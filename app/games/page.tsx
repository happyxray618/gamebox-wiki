import Link from "next/link"
import { games } from "@/data/games"

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-widest"
          >
            GAMEBOX.WIKI
          </Link>

          <nav className="flex gap-6 text-sm text-zinc-400">
            <Link href="/games" className="text-white">
              GAMES
            </Link>

            <Link href="/finder" className="hover:text-white">
              FINDER
            </Link>

            <Link href="/retro" className="hover:text-white">
              RETRO
            </Link>

            <Link href="/hidden-gems" className="hover:text-white">
              HIDDEN GEMS
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">
        <p className="mb-3 text-sm font-bold tracking-[0.3em] text-zinc-500">
          GAME DATABASE
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          GAMES
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Explore games across generations, genres and platforms.
          Discover classics, cult favorites and hidden gems.
        </p>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap gap-3 border-y border-white/10 py-6">
          <button className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black">
            ALL GAMES
          </button>

          <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-400">
            HORROR
          </button>

          <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-400">
            RPG
          </button>

          <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-400">
            ACTION
          </button>

          <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-400">
            STEALTH
          </button>

          <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-400">
            PS1
          </button>

          <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-400">
            PS2
          </button>

          <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-400">
            PC
          </button>
        </div>
      </section>

      {/* Game Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              GAME ARCHIVE
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              {games.length} games indexed
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06]"
            >
              {/* Score */}
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-zinc-500">
                  {game.year}
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold">
                  {game.gameboxScore}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black leading-tight transition group-hover:text-zinc-300">
                {game.title}
              </h3>

              {/* Developer */}
              <p className="mt-2 text-sm text-zinc-500">
                {game.developer}
              </p>

              {/* Genres */}
              <div className="mt-5 flex flex-wrap gap-2">
                {game.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-md bg-white/5 px-2 py-1 text-[11px] font-medium text-zinc-400"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Platforms */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xs text-zinc-600">
                  {game.platforms.join(" · ")}
                </p>
              </div>
            </Link>
          ))}
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
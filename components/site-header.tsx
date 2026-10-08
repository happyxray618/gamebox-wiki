import Link from "next/link"

export default function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-5">
        <Link href="/" className="text-xl font-black tracking-widest">GAMEBOX.WIKI</Link>
        <nav aria-label="Main navigation" className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 sm:w-auto sm:text-sm">
          {[["/games", "GAMES"], ["/finder", "FINDER"], ["/retro", "RETRO"], ["/hidden-gems", "HIDDEN GEMS"]].map(([href, label]) => (
            <Link key={href} href={href} aria-current={active === href ? "page" : undefined} className={`inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-4 ${active === href ? "text-white" : "hover:text-white"}`}>{label}</Link>
          ))}
          <Link href="/#newsletter" className="inline-flex min-h-11 items-center hover:text-white">NEWSLETTER</Link>
        </nav>
      </div>
    </header>
  )
}

import Link from "next/link"

export default function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-5">
        <Link href="/" className="text-xl font-black tracking-widest">GAMEBOX.WIKI</Link>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-5 text-xs text-zinc-400 sm:text-sm">
          {[["/games", "GAMES"], ["/finder", "FINDER"], ["/retro", "RETRO"], ["/hidden-gems", "HIDDEN GEMS"]].map(([href, label]) => (
            <Link key={href} href={href} aria-current={active === href ? "page" : undefined} className={active === href ? "text-white" : "hover:text-white"}>{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

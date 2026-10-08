import type { ReactNode } from "react"
import SiteHeader from "./site-header"

export default function PublicInfoPage({ title, children }: { title: string; children: ReactNode }) {
  return <main className="min-h-screen bg-[#09090b] text-white"><SiteHeader /><section className="mx-auto max-w-4xl px-6 py-16"><h1 className="break-words text-4xl font-black sm:text-5xl">{title}</h1><div className="mt-8 space-y-8 text-zinc-300 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_p]:leading-8 [&_a]:underline [&_a]:underline-offset-4">{children}</div></section></main>
}

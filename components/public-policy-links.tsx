import Link from "next/link"

export default function PublicPolicyLinks() {
  return <aside className="border-t border-white/10 bg-[#09090b] px-6 py-8 text-zinc-400" aria-label="GAMEBOX data and policies">
    <div className="mx-auto max-w-7xl">
      <p className="max-w-4xl text-xs leading-6">Facts are source-backed metadata. Game DNA and scores are provisional GAMEBOX editorial assessments. Match percentages describe preference coverage; similarity percentages describe recorded DNA overlap. Neither measures objective quality or a probability of enjoyment. Confidence labels describe overlap strength.</p>
      <nav aria-label="Site information" className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">{[["/about", "About"], ["/data-policy", "Data & Editorial Policy"], ["/privacy", "Privacy"], ["/contact", "Contact"]].map(([href, text]) => <Link className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white" key={href} href={href}>{text}</Link>)}</nav>
    </div>
  </aside>
}

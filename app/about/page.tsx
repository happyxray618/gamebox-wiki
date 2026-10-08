import Link from "next/link"
import PublicInfoPage from "@/components/public-info-page"
import { pageMetadata } from "@/lib/metadata"
export const metadata = pageMetadata("About", "About GAMEBOX's curated game discovery archive and its editorial recommendations.", "/about")
export default function AboutPage() {
  return <PublicInfoPage title="ABOUT GAMEBOX"><p>GAMEBOX helps you explore a curated 100-game archive through Game DNA, preference matching and explained recommendations. The selection is a starting point, not a complete history of games.</p><section><h2>Three layers of information</h2><p>Factual metadata comes from recorded sources. GAMEBOX editorial data describes our interpretation of games. Recommendations compare those recorded interpretations algorithmically. A percentage or rating is not an objective fact about a game.</p></section><p>Some classifications and ratings begin from editorial profiles and remain provisional. <Link href="/data-policy">Read the Data &amp; Editorial Policy</Link> for verification boundaries and recommendation limitations.</p><p>Newsletter subscriptions, accounts and community features are not available. <Link href="/contact">Contact information</Link>.</p></PublicInfoPage>
}

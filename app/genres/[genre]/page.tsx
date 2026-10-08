import DiscoveryPage, { discoveryMetadata } from "@/components/discovery-page"
import { discoveryValues } from "@/lib/taxonomy"

type Props = { params: Promise<{ genre: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return discoveryValues("genres").map(({ slug }) => ({ genre: slug }))
}
export async function generateMetadata({ params }: Props) {
  const { genre } = await params
  return discoveryMetadata("genres", genre)
}
export default async function Page({ params }: Props) {
  const { genre } = await params
  return <DiscoveryPage kind="genres" slug={genre} />
}

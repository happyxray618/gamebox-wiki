import DiscoveryPage, { discoveryMetadata } from "@/components/discovery-page"
import { discoveryValues } from "@/lib/taxonomy"

type Props = { params: Promise<{ mood: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return discoveryValues("moods").map(({ slug }) => ({ mood: slug }))
}
export async function generateMetadata({ params }: Props) {
  const { mood } = await params
  return discoveryMetadata("moods", mood)
}
export default async function Page({ params }: Props) {
  const { mood } = await params
  return <DiscoveryPage kind="moods" slug={mood} />
}

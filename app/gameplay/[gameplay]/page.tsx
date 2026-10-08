import DiscoveryPage, { discoveryMetadata } from "@/components/discovery-page"
import { discoveryValues } from "@/lib/taxonomy"

type Props = { params: Promise<{ gameplay: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return discoveryValues("gameplay").map(({ slug }) => ({ gameplay: slug }))
}
export async function generateMetadata({ params }: Props) {
  const { gameplay } = await params
  return discoveryMetadata("gameplay", gameplay)
}
export default async function Page({ params }: Props) {
  const { gameplay } = await params
  return <DiscoveryPage kind="gameplay" slug={gameplay} />
}

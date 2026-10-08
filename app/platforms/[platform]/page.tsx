import DiscoveryPage, { discoveryMetadata } from "@/components/discovery-page"
import { discoveryValues } from "@/lib/taxonomy"

type Props = { params: Promise<{ platform: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return discoveryValues("platforms").map(({ slug }) => ({ platform: slug }))
}
export async function generateMetadata({ params }: Props) {
  const { platform } = await params
  return discoveryMetadata("platforms", platform)
}
export default async function Page({ params }: Props) {
  const { platform } = await params
  return <DiscoveryPage kind="platforms" slug={platform} />
}

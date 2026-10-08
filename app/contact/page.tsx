import PublicInfoPage from "@/components/public-info-page"
import { pageMetadata } from "@/lib/metadata"
import { contactUrl } from "@/lib/public-config"
export const metadata = pageMetadata("Contact", "Contact GAMEBOX about data corrections and editorial feedback.", "/contact")
export default function ContactPage() {
  return <PublicInfoPage title="CONTACT"><p>For data corrections, include the game title, the field to review and a supporting source. Editorial feedback should describe which interpretation or recommendation you would change.</p>{contactUrl ? <p><a href={contactUrl}>{contactUrl.startsWith("mailto:") ? contactUrl.slice(7) : "Contact GAMEBOX"}</a></p> : <p>A public contact channel has not yet been configured. The site owner must provide one before public launch.</p>}<p>No message form or personal-data collection endpoint is available in this version.</p></PublicInfoPage>
}

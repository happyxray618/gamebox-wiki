export const productionOrigin = "https://gamebox.wiki"
export function resolveSiteUrl(value = productionOrigin, production = process.env.NODE_ENV === "production") {
  const url = new URL(value)
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error("SITE URL must be a bare origin without credentials, path, query or fragment")
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  if (production && (url.protocol !== "https:" || local)) throw new Error("Production SITE URL must use a public HTTPS origin")
  if (production && url.origin !== productionOrigin) throw new Error("Production canonical origin must be https://gamebox.wiki, including Vercel Preview builds")
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("Unsupported SITE URL protocol")
  return url.origin
}
export function resolveContact(value?: string) {
  if (!value) return null
  const url = new URL(value)
  if (!["https:", "mailto:"].includes(url.protocol)) throw new Error("Contact must be an HTTPS link or mailto address")
  return value
}
export const contactUrl = resolveContact(process.env.SITE_CONTACT_URL || "mailto:service@gamebox.wiki")
export function isIndexableDeployment(environment = process.env.VERCEL_ENV) { return !environment || environment === "production" }

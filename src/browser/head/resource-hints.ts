const links = new Set<string>()
const hosts = new Set<string>()

// https://html.spec.whatwg.org/multipage/links.html#link-type-preload
// https://fetch.spec.whatwg.org/#request-destination-script-like
export type MediaType =
  | 'audio'
  | 'video'
  | 'audioworklet'
  | 'paintworklet'
  | 'script'
  | 'serviceworker'
  | 'sharedworker'
  | 'worker'
  | 'image'
  | 'font'
  | 'style'
  | 'track'

export type CrossOrigin = 'anonymous' | 'use-credentials'

export interface PrefetchOptions extends PreconnectOptions {
  as?: MediaType | string
}

export function prefetch(href: string | URL, options?: PrefetchOptions) {
  if (!href) return
  href = normalize(href)
  if (isLocal(href) && href.pathname === location.pathname) return
  href = href.toString()
  if (links.has(href)) return
  links.add(href)
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  if (options?.as) link.as = options.as
  if (options?.crossOrigin) link.crossOrigin = options.crossOrigin
  if (options?.media) link.media = options.media
  document.head.append(link)
}

export interface PreconnectOptions {
  crossOrigin?: CrossOrigin | string
  media?: string
}

export function preconnect(href: string | URL, options?: PreconnectOptions) {
  if (!href) return
  href = new URL(href)
  if (!href.hostname) return
  if (isLocal(href)) return
  href = href.protocol + '//' + href.host
  if (links.has(href)) return
  links.add(href)
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = href
  if (options?.crossOrigin) link.crossOrigin = options.crossOrigin
  if (options?.media) link.media = options.media
  document.head.append(link)
}

export function dnsPrefetch(href: string | URL) {
  if (!href) return
  href = new URL(href)
  if (!href.hostname) return
  if (isLocal(href)) return
  const host = href.hostname
  if (hosts.has(host)) return
  hosts.add(host)
  const link = document.createElement('link')
  link.rel = 'dns-prefetch'
  link.href = '//' + host
  document.head.append(link)
}

function normalize(url: string | URL) {
  url = new URL(url, location.href)
  url.hash = ''
  return url
}

function isLocal(url: URL) {
  return url.host === location.host || url.host === 'localhost' || url.host === '127.0.0.1'
}

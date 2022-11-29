interface ParsedTLD {
  readonly isValidTLD: boolean
  readonly suffix: string
  readonly domain: string
  readonly subdomain: string
}

export function parse(host: string): ParsedTLD | undefined {
  return undefined
}

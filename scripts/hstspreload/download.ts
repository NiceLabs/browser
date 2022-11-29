import type { EffectiveTLDNames, HSTSRoot } from './types'
import { domainToASCII } from 'url'

const EFFECTIVE_TLD_NAMES_URL = new URL(
  'effective_tld_names.dat',
  'https://publicsuffix.org/list/'
)

const HSTS_PRELOAD_URL = new URL(
  'net/http/transport_security_state_static.json',
  'https://chromium.googlesource.com/chromium/src/+/main/'
)

export async function getHSTSPreloadVersion() {
  const response = await fetch(HSTS_PRELOAD_URL, {
    method: 'GET',
    headers: { 'Accept': 'application/json', 'Accept-Encoding': 'gzip' },
  })
  let payload = await response.text()
  payload = payload.slice(payload.indexOf('{'))
  interface Parsed {
    id: string
  }
  const parsed: Parsed = JSON.parse(payload)
  return Buffer.from(parsed.id, 'hex')
}

export async function getHSTSPreloadContent(): Promise<HSTSRoot> {
  const response = await fetch(HSTS_PRELOAD_URL, {
    method: 'GET',
    headers: { 'Accept': 'text/plain', 'Accept-Encoding': 'gzip' },
  })
  const data = Buffer.from(await response.text(), 'base64')
    .toString()
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
  return JSON.parse(data)
}

export async function getEffectiveTLDNames(): Promise<EffectiveTLDNames> {
  const response = await fetch(EFFECTIVE_TLD_NAMES_URL)
  const text = await response.text()
  const rules = new Set<string>()
  const exceptions = new Set<string>()
  for (let line of text.split('\n')) {
    line = line.trim()
    if (line.startsWith('//')) continue
    line = domainToASCII(line)
    if (line.startsWith('!')) {
      exceptions.add(line.slice(1))
    } else {
      rules.add(line)
    }
  }
  return { rules, exceptions }
}

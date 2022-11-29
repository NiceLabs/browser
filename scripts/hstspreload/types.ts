export interface EffectiveTLDNames {
  rules: Set<string>
  exceptions: Set<string>
}

export interface HSTSRoot {
  readonly pinsets: HSTSPinset[]
  readonly entries: HSTSEntry[]
}

export interface HSTSPinset {
  readonly name: string
  readonly static_spki_hashes: string[]
  readonly bad_static_spki_hashes: string[]
  readonly report_uri?: string
}

export interface HSTSEntry {
  readonly name: string
  readonly policy: HSTSPolicy
  readonly mode?: 'force-https'
  readonly include_subdomains?: boolean
  readonly include_subdomains_for_pinning?: boolean
  readonly pins?: string
  readonly expect_ct?: boolean
  readonly expect_ct_report_uri?: string
}

export type HSTSPolicy =
  | 'test'
  | 'google'
  | 'custom'
  | 'bulk-legacy'
  | 'bulk-18-weeks'
  | 'bulk-1-year'
  | 'public-suffix'
  | 'public-suffix-requested'

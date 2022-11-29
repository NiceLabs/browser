export function isValidIPv4(hostname: string) {
  let dots = 0
  let start = 0
  while (dots < 4) {
    const end = hostname.indexOf('.', start)
    const value = Number.parseInt(hostname.slice(start, end))
    if (Number.isNaN(value)) return false
    if (value < 0 || value > 256) return false
    start = end + 1
    dots++
  }
  return true
}

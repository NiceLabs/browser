export type CursorDirection = 'top' | 'bottom' | 'left' | 'right'

export function cursorDirection(event: MouseEvent, target = event.target as HTMLElement): CursorDirection {
  const x = event.pageX - target.offsetLeft - target.offsetWidth / 2
  const y = event.pageY - target.offsetTop - target.offsetHeight / 2
  // prettier-ignore
  return Math.abs(x) > Math.abs(y)
    ? (x < 0 ? 'left' : 'right')
    : (y < 0 ? 'top' : 'bottom')
}

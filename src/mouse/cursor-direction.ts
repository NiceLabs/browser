import type { Direction } from '../types'

export function cursorDirection(event: MouseEvent, element?: HTMLElement): Direction {
  if (element === undefined) {
    element = event.target as HTMLElement
  }
  const x = event.pageX - element.offsetLeft - element.offsetWidth / 2
  const y = event.pageY - element.offsetTop - element.offsetHeight / 2
  // prettier-ignore
  return Math.abs(x) > Math.abs(y)
    ? (x < 0 ? 'left' : 'right')
    : (y < 0 ? 'top' : 'bottom')
}

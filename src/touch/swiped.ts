import type { Direction } from '../types'

export interface SwipedDetail {
  readonly direction: Direction
  readonly startTouch: Touch
  readonly endTouch: Touch
  readonly xDiff: number
  readonly yDiff: number
}

export interface SwipedEvent extends Event {
  readonly type: 'swiped'
  readonly detail: SwipedDetail
  readonly target: HTMLElement
}

export interface SwipedOptions {
  timeout?: number
  threshold?: number
}

export class SwipedEventHandler {
  private target: EventTarget | undefined
  private startTouch: Touch | undefined
  private startTimestamp = Number.NaN
  private readonly timeout: number
  private readonly threshold: number

  static install(element: EventTarget = globalThis.document, options?: SwipedOptions) {
    const handler = new SwipedEventHandler(options)
    element.addEventListener('touchstart', handler, { capture: true })
    element.addEventListener('touchend', handler, { capture: true })
    return () => {
      element.removeEventListener('touchstart', handler)
      element.removeEventListener('touchend', handler)
    }
  }

  constructor(options?: SwipedOptions) {
    this.timeout = options?.timeout ?? 500
    this.threshold = options?.threshold ?? 40
  }

  handleEvent = (event: TouchEvent) => {
    if (event.type === 'touchstart') {
      this.handleTouchStart(event)
    } else if (event.type === 'touchend') {
      this.handleTouchEnd(event)
    }
  }

  private handleTouchStart(event: TouchEvent) {
    if (event.target === null) return
    this.target = event.target
    this.startTimestamp = event.timeStamp
    this.startTouch = event.touches[0]
  }

  private handleTouchEnd(event: TouchEvent) {
    if (!this.startTouch) return
    if (!this.target) return
    if (this.target !== event.target) return
    if (event.timeStamp - this.startTimestamp > this.timeout) return
    const detail = this.makeDetail(this.startTouch, (event.changedTouches ?? event.touches)[0])
    if (!(Math.abs(detail.xDiff) > this.threshold || Math.abs(detail.yDiff) > this.threshold)) return
    event.target.dispatchEvent(new CustomEvent('swiped', { detail, bubbles: true, cancelable: true }))
  }

  private makeDetail(startTouch: Touch, endTouch: Touch): SwipedDetail {
    const xDiff = startTouch.clientX - endTouch.clientX
    const yDiff = startTouch.clientY - endTouch.clientY
    return Object.freeze({
      xDiff,
      yDiff,
      startTouch,
      endTouch,
      // prettier-ignore
      direction: Math.abs(xDiff) > Math.abs(yDiff)
        ? (xDiff > 0 ? 'left' : 'right')
        : (yDiff > 0 ? 'top' : 'bottom'),
    })
  }
}

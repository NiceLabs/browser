const EVENT_NAME = 'swiped'

export type SwipedDirection = 'top' | 'bottom' | 'left' | 'right'

export type SwipedPredicate = (detail: SwipedDetail) => boolean

export interface SwipedEvent extends Event {
  readonly type: typeof EVENT_NAME
  readonly detail: SwipedDetail
  readonly target: HTMLElement
}

export interface SwipedDetail {
  readonly direction: SwipedDirection
  readonly duration: number
  readonly startTouch: Touch
  readonly endTouch: Touch
  readonly xDiff: number
  readonly yDiff: number
}

// The ported from npm.im/swiped-events
export class SwipedEventHandler {
  public static readonly EVENT_NAME = EVENT_NAME
  private readonly touches = new WeakMap<EventTarget, [timestamp: number, touch: Touch]>()
  private readonly predicate: SwipedPredicate

  static install(element: EventTarget, threshold?: number, timeout?: number) {
    const handler = SwipedEventHandler.make(threshold, timeout)
    element.addEventListener('touchstart', handler, { capture: true })
    element.addEventListener('touchend', handler, { capture: true })
    return handler
  }

  static make(threshold = 40, timeout = 500) {
    return new SwipedEventHandler((detail) => {
      if (detail.duration > timeout) return false
      const x = Math.abs(detail.xDiff)
      const y = Math.abs(detail.yDiff)
      return x > threshold || y > threshold
    })
  }

  constructor(predicate: SwipedPredicate) {
    this.predicate = predicate
  }

  handleEvent = (event: TouchEvent) => {
    if (event.target === null) return
    if (event.type === 'touchstart') {
      this.touches.set(event.target, [event.timeStamp, event.touches[0]])
    } else if (event.type === 'touchend' && this.touches.has(event.target)) {
      const [timestamp, startTouch] = this.touches.get(event.target)!
      const endTouch = event.changedTouches[0] || event.touches[0]
      const xDiff = startTouch.clientX - endTouch.clientX
      const yDiff = startTouch.clientY - endTouch.clientY
      // prettier-ignore
      const direction =
        Math.abs(xDiff) > Math.abs(yDiff)
          ? (xDiff > 0 ? 'left' : 'right')
          : (yDiff > 0 ? 'top' : 'bottom')
      const duration = event.timeStamp - timestamp
      const detail: SwipedDetail = Object.freeze({ xDiff, yDiff, startTouch, endTouch, direction, duration })
      if (this.predicate(detail)) {
        event.target.dispatchEvent(new CustomEvent(EVENT_NAME, { detail, bubbles: true }))
      }
      this.touches.delete(event.target)
    }
  }
}

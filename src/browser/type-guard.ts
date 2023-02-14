export function inViewport(element: Element) {
  const rect = element.getBoundingClientRect()
  const root = document.documentElement
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (innerHeight || root.clientHeight) &&
    rect.right <= (innerWidth || root.clientWidth)
  )
}

export interface isElement {
  (node: any): node is HTMLElement
  <K extends keyof HTMLElementTagNameMap>(node: any, name: K): node is HTMLElementTagNameMap[K]
  <K extends keyof SVGElementTagNameMap>(node: any, name: K): node is SVGElementTagNameMap[K]
  <K extends keyof HTMLElementDeprecatedTagNameMap>(node: any, name: K): node is HTMLElementDeprecatedTagNameMap[K]
}

export function isElement(node: any, name?: string) {
  if (!node) return false
  if ('nodeName' in node && name) return node.nodeName === name.toUpperCase()
  if ('nodeType' in node && 'ELEMENT_NODE' in node) return node.nodeType === node.ELEMENT_NODE
  return false
}

export interface isEvent {
  <K extends keyof WindowEventMap>(event: Event, type: K): event is WindowEventMap[K]
  (event: Event, type: string): boolean
}

export function isEvent(event: Event, type: string) {
  return event.type === type
}

export function isCustomEvent<T>(event: Event): event is CustomEvent<T> {
  return 'detail' in event
}

type ContentCompare = (a: HTMLTableCellElement, b: HTMLTableCellElement) => boolean

// The ported from github.com/Menci/markdown-it-merge-cells
export function tableMerge(rows: HTMLCollectionOf<HTMLTableRowElement>, isEqual: ContentCompare = isContentEqual) {
  const refs = new Map<HTMLTableCellElement, HTMLTableCellElement>()
  // Merge cells in a *column* first.
  for (let cellIndex = 0; cellIndex < rows[0].cells.length; cellIndex++) {
    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      const cell = rows[rowIndex].cells[cellIndex]
      const prevCell = rows[rowIndex - 1].cells[cellIndex]
      if (!isEqual(cell, prevCell)) continue
      const mergedTo = refs.get(prevCell) || prevCell
      refs.set(cell, mergedTo)
      mergedTo.rowSpan += cell.rowSpan
      cell.hidden = true
    }
  }
  // Merge cells in a *row* then.
  for (const row of rows) {
    for (let cellIndex = 1; cellIndex < row.cells.length; cellIndex++) {
      const cell = row.cells[cellIndex]
      const prevCell = row.cells[cellIndex - 1]
      if (refs.has(cell) || refs.has(prevCell)) continue
      if (!isEqual(cell, prevCell)) continue
      const mergedTo = refs.get(prevCell) || prevCell
      if (cell.rowSpan !== mergedTo.rowSpan) continue
      mergedTo.colSpan += cell.colSpan
      refs.set(cell, mergedTo)
      cell.hidden = true
    }
  }
  for (const cell of refs.keys()) {
    cell.remove()
  }
  const merged = refs.size !== 0
  refs.clear()
  return merged
}

function isContentEqual(a: Node, b: Node) {
  if (a.childNodes.length !== b.childNodes.length) return false
  for (let i = 0; i < a.childNodes.length; i++) {
    if (!a.childNodes[i].isEqualNode(b.childNodes[i])) return false
  }
  return true
}

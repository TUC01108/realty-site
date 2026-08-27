"use client"

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-sm border hairline px-3 py-1.5 text-sm print:hidden"
    >
      Print / PDF
    </button>
  )
}

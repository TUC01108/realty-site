"use client"

import { useState } from "react"

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className="rounded-sm border hairline px-3 py-1 text-xs hover:bg-sand"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setDone(true)
        setTimeout(() => setDone(false), 1500)
      }}
    >
      {done ? "Copied" : label}
    </button>
  )
}

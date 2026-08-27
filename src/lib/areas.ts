import { NEIGHBORHOODS } from "@/data/neighborhoods"

export type Area = {
  slug: string
  name: string
}

export function getArea(slug: string): Area {
  const match = NEIGHBORHOODS.find((n) => n.slug === slug)
  return match ? { slug: match.slug, name: match.name } : { slug: "island", name: "Hawaiʻi Island" }
}

export const areaOptions = [
  { slug: "island", name: "Not sure / whole island" },
  ...NEIGHBORHOODS.map((n) => ({ slug: n.slug, name: n.name })),
]

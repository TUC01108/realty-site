export type GuideSource = {
  label: string;
  href: string;
};

export type Guide = {
  slug: string;
  title: string;
  htmlTitle: string;
  description: string;
  eyebrow: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "county-water-vs-rainwater-catchment",
    title: "County water vs rainwater catchment on Hawaiʻi Island",
    htmlTitle: "County Water vs Rainwater Catchment on Hawaiʻi Island",
    description:
      "DWS is 23 systems, not one grid. A main in the road is not a meter. Catchment is owner-maintained. Yordana Bolanos Salas on what to verify before you buy.",
    eyebrow: "Water",
  },
  {
    slug: "lava-flow-hazard-zones-and-insurance",
    title: "Lava-flow hazard zones and insurance on Hawaiʻi Island",
    htmlTitle: "Lava-Flow Hazard Zones and Insurance on Hawaiʻi Island",
    description:
      "USGS zones 1–9 are long-term relative hazard, not a parcel survey and not a forecast. Lava is not hurricane or flood. How I read the map, and how insurance is a separate question.",
    eyebrow: "Lava & insurance",
  },
  {
    slug: "dont-buy-the-house-you-see",
    title: "Don’t buy the house you see",
    htmlTitle: "Don’t Buy the House You See",
    description:
      "Photos are the invitation. The house is water, insurance bindability, lava zone at neighborhood scale, and whether overnight rental is even a legal use in Hawaiʻi County.",
    eyebrow: "Due diligence",
  },
  {
    slug: "hawaii-county-short-term-vacation-rentals",
    title: "Short-term vacation rentals in Hawaiʻi County",
    htmlTitle: "Short-Term Vacation Rentals in Hawaiʻi County",
    description:
      "Hawaiʻi County is not Honolulu or Maui. STVR is zoning, registration, and a closed NUC window — not a neighborhood name on the MLS. From Yordana Bolanos Salas in Hilo; not legal advice.",
    eyebrow: "STVR",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

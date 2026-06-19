export type Neighborhood = {
  slug: string;
  name: string;
  description: string;
  population: string;
  density: string;
  medianPrice: string;
  topAttractions: string[];
  topRestaurants: string[];
};

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "north-kohala",
    name: "North Kohala",
    description:
      "One of the most historic and rural districts on Hawai'i Island, known as the birthplace of King Kamehameha I. North Kohala offers rolling green hills, dramatic ocean cliffs, and a strong sense of Hawaiian heritage.",
    population: "6,515",
    density: "Low",
    medianPrice: "$1.3M–$1.7M",
    topAttractions: [
      "Pololū Valley Lookout",
      "King Kamehameha I Statue",
      "Lapakahi State Historical Park",
    ],
    topRestaurants: [
      "Bamboo Restaurant & Gallery",
      "Kohala Burger & Taco",
      "Gill's Lanai",
    ],
  },
  {
    slug: "south-kohala",
    name: "South Kohala",
    description:
      "South Kohala is home to the island's premier resort communities, white-sand beaches, luxury golf courses, and some of Hawai'i's most desirable oceanfront real estate.",
    population: "13,730",
    density: "Low to Moderate",
    medianPrice: "$1.2M–$1.3M",
    topAttractions: [
      "Hapuna Beach State Recreation Area",
      "Mauna Kea Beach",
      "Pu'ukoholā Heiau National Historic Site",
    ],
    topRestaurants: ["CanoeHouse", "Brown's Beach House", "Lava Lava Beach Club"],
  },
  {
    slug: "north-kona",
    name: "North Kona",
    description:
      "North Kona is the economic center of the west side and includes Kailua-Kona. It offers sunshine, ocean recreation, shopping, dining, and some of the strongest housing demand on the island.",
    population: "30,783",
    density: "Moderate",
    medianPrice: "$975,000",
    topAttractions: ["Kailua Bay", "Huliheʻe Palace", "Magic Sands Beach"],
    topRestaurants: [
      "Huggo's",
      "Umekes Fish Market Bar & Grill",
      "Jackie Rey's Ohana Grill",
    ],
  },
  {
    slug: "south-kona",
    name: "South Kona",
    description:
      "Famous for Kona coffee farms, rural living, and spectacular ocean views, South Kona offers a quieter lifestyle with strong agricultural roots.",
    population: "9,263",
    density: "Low",
    medianPrice: "$800,000–$900,000",
    topAttractions: [
      "Kealakekua Bay",
      "Puʻuhonua o Hōnaunau National Historical Park",
      "Kona Coffee Belt",
    ],
    topRestaurants: ["The Coffee Shack", "Manago Hotel Restaurant", "Shaka Tacoz"],
  },
  {
    slug: "hamakua",
    name: "Hamakua",
    description:
      "The Hāmākua Coast is one of Hawai'i Island's most scenic regions, featuring waterfalls, ocean cliffs, tropical forests, and agricultural estates.",
    population: "7,457",
    density: "Low",
    medianPrice: "$1.2M–$1.35M",
    topAttractions: [
      "Akaka Falls State Park",
      "Laupāhoehoe Point",
      "Waipiʻo Valley Lookout",
    ],
    topRestaurants: [
      "Tex Drive In",
      "Papaaloa Country Store & Cafe",
      "Hawaiian Style Cafe",
    ],
  },
  {
    slug: "puna",
    name: "Puna",
    description:
      "Puna is the fastest-growing district on Hawai'i Island, known for lava landscapes, tropical rainforest, black-sand beaches, and affordable land.",
    population: "52,941",
    density: "Moderate",
    medianPrice: "$400,000–$500,000",
    topAttractions: [
      "Lava Tree State Monument",
      "Kehena Black Sand Beach",
      "Isaac Hale Beach Park",
    ],
    topRestaurants: ["Bite The Eye", "Ning's Thai Cuisine", "Black Rock Cafe"],
  },
  {
    slug: "kau",
    name: "Kaʻū",
    description:
      "Kaʻū is the island's southernmost district and remains one of Hawai'i's most rural and undeveloped regions, offering vast open landscapes and authentic local character.",
    population: "6,414",
    density: "Very Low",
    medianPrice: "$370,000",
    topAttractions: [
      "Punaluʻu Black Sand Beach",
      "Ka Lae (South Point)",
      "Hawaiʻi Volcanoes National Park",
    ],
    topRestaurants: ["Hana Hou Restaurant", "Punaluʻu Bake Shop", "Kaʻū Coffee Mill"],
  },
  {
    slug: "north-hilo",
    name: "North Hilo",
    description:
      "North Hilo is a lush tropical district known for rainforests, waterfalls, streams, and large agricultural properties.",
    population: "5,000",
    density: "Low",
    medianPrice: "$1.1M",
    topAttractions: [
      "Akaka Falls State Park",
      "Onomea Scenic Drive",
      "Hakalau Forest National Wildlife Refuge",
    ],
    topRestaurants: ["What's Shakin", "Onomea Country Market & Cafe", "The Hive Cafe"],
  },
  {
    slug: "south-hilo",
    name: "South Hilo",
    description:
      "South Hilo is the island's governmental, educational, and commercial center. It offers the most complete range of services, schools, healthcare, and shopping on the east side.",
    population: "47,397",
    density: "High",
    medianPrice: "$550,000–$700,000",
    topAttractions: ["Rainbow Falls", "Liliʻuokalani Gardens", "Hilo Bay"],
    topRestaurants: ["Cafe Pesto", "Moon and Turtle", "Pineapples Island Fresh Cuisine"],
  },
];

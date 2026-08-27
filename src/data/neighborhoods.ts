export type Neighborhood = {
  slug: string;
  name: string;
  lede: string;
  living: string[];
  water: string;
  lava: string;
  whoItFits: string;
};

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "north-kohala",
    name: "North Kohala",
    lede: "The island’s north end: small towns, wind, and a long memory of place.",
    living: [
      "North Kohala is Hawi and Kapaʻau, pasture, and the cliffs down to Pololū. It is not Kona, and it is not a weekend version of Waimea. Services are local. The drive to the airport or to Hilo is part of the life, not an afterthought.",
      "Tradewinds and ocean exposure shape the day more than a floor plan does. If you need a city rhythm, this is the wrong end of the island. If you want a town you can walk and a landscape that still feels like Kohala, we start here — then we check the file.",
    ],
    water:
      "Rural lots are often on catchment. Town pockets may be on a Department of Water Supply system. A main in the road is not a meter. We verify the TMK with DWS before you treat water as settled.",
    lava:
      "USGS maps Kohala volcano as lava-flow hazard Zone 9 — the lowest relative long-term zone on the island, for a volcano that has not erupted in tens of thousands of years. That is planning context, not a promise the ground will never change, and not a substitute for the map at neighborhood scale.",
    whoItFits:
      "People who want the north end, a slower town, and are honest about distance from hospitals, big grocery, and the west-side airport.",
  },
  {
    slug: "south-kohala",
    name: "South Kohala",
    lede: "Two climates in one district: cool Waimea upland, and the dry Kohala coast.",
    living: [
      "South Kohala is not one lifestyle. Waimea (Kamuela) sits higher, cooler, often in mist. The coast — Waikoloa and the resort shore — is sun, wind, and black rock to the water. I will not sell you the coast if what you actually want is a town with a sweater in the evening, or the reverse.",
      "The coast has more visitor infrastructure. Waimea has ranch country and a real town. Your daily drive, your wind, and your water bill will not match a photo from the other side of the district.",
    ],
    water:
      "Planned communities are more likely to sit on county systems than a random rural lot — still not a guarantee of a meter on the parcel you are looking at. Confirm TMK with DWS.",
    lava:
      "This district sits mostly away from Kīlauea’s rift zones. I still will not assign a lava-flow hazard zone to a street from memory. We read the USGS map at neighborhood scale; digital pins omit a wide, gradational boundary.",
    whoItFits:
      "People who have already chosen coast sun versus Waimea cool, and who can live with the visitor traffic that comes with the shore — or the mist that comes with the upland.",
  },
  {
    slug: "north-kona",
    name: "North Kona",
    lede: "Kailua-Kona and the west-side town: sun, traffic, and more daily services than most of the island.",
    living: [
      "North Kona is where a lot of west-side life actually runs — airport, shopping, ocean recreation, and the town of Kailua-Kona. It is drier than Hilo. It is also busier. Holualoa, mauka, is a different day than Aliʻi Drive.",
      "If you are relocating from a city, this is often the first place that feels operable. That does not make every condo a good file. Ocean proximity, parking, and whether you can actually live with visitors in the street are the conversation, not the sunset.",
    ],
    water:
      "Town and many developed streets are more likely to be on DWS than a South Kona coffee farm — still verify the TMK. DWS is 23 separate systems, not one island grid.",
    lava:
      "Hualālai is an active volcano. I will not call North Kona “safe” or “never lava.” We use the USGS zones as long-term relative hazard at neighborhood scale, not as a parcel survey.",
    whoItFits:
      "People who want west-side sun and town services, and who can accept tourist-town energy in Kailua-Kona rather than pretending it is a quiet village.",
  },
  {
    slug: "south-kona",
    name: "South Kona",
    lede: "Coffee country, ocean views, and a slower west side than Kailua-Kona.",
    living: [
      "South Kona is Captain Cook, Kealakekua, Hōnaunau, and the coffee belt mauka of the belt road. The light is real. So is the grade of the land, the distance to the airport, and the fact that a farm is a farm — not a hotel with a view.",
      "I spend time here with people who want rural west-side living without pretending Kailua-Kona’s restaurants are next door. If your week depends on a short hop to the airport every Monday, say that out loud before we look at a mauka listing.",
    ],
    water:
      "Mauka farms and rural lots are often on catchment. A county line in the road does not mean this house has a meter. Dual catchment plus a meter is a backflow issue for DWS, not a clever backup plan you install yourself.",
    lava:
      "South Kona sits on the west flank; hazard still varies by where you are on the mountain. We read the USGS map. We do not treat a zone number as a property line.",
    whoItFits:
      "People who want agricultural west-side life, can live with a longer drive, and are willing to maintain water if the house is on catchment.",
  },
  {
    slug: "hamakua",
    name: "Hāmākua",
    lede: "The windward coast: rain, cliffs, former sugar towns, and a long road between services.",
    living: [
      "Hāmākua is Honokaʻa and the belt road, waterfalls, and the look into Waipiʻo at the north end. It is green because it rains. If you need dry shoes and a west-side tan, this is the wrong coast.",
      "Towns are small. The landscape is the point. I will not dress that up as a resort. I will ask whether you can live with the drive, the weather, and the fact that “the coast” here means cliffs and ocean, not a swim at lunch.",
    ],
    water:
      "A mix of DWS systems and catchment, depending on the pocket. Same rule as the rest of the island: confirm the TMK. Do not assume the neighbor’s meter is yours.",
    lava:
      "This is Mauna Kea’s windward side, generally lower long-term lava-flow hazard than Kīlauea and Mauna Loa rift country. Generally is not a zone stamp on your lot. We still open the USGS map.",
    whoItFits:
      "People who want rain, green, and a small town, and who are not building their week around Kona airport or a beach calendar.",
  },
  {
    slug: "puna",
    name: "Puna",
    lede: "A large east-side district: rainforest, lava land, and files that fail if you only look at the kitchen.",
    living: [
      "Puna is not one neighborhood. Lower Puna, the subdivisions, Pāhoa, and the lots closer to Volcano are different lives. Some of this land is lush. Some of it is young. Distances are real. So is the 2018 lower East Rift Zone eruption — that is history on the ground, not a mood.",
      "I will not tell you Puna is a bargain and leave it there. Price is often the invitation. Water, insurance bindability, access, and whether you can actually live this far from town are the work. If overnight rental is why you are buying, that is a Planning question — not a listing caption. I will not call a Puna or Hawaiian Paradise Park lot a legal short-term vacation rental.",
    ],
    water:
      "Catchment is common. County water is not a given because you saw a line on a map. DWS does not recognize or regulate catchment; DOH does not certify a home tank as potable. Verify TMK with DWS.",
    lava:
      "Puna includes Kīlauea’s East Rift Zone. USGS Zone 1 is vents and rift; Zone 2 is adjacent and downslope. Zone 1 is not “twice” Zone 2. A GIS pin is not a parcel survey — zone boundaries are about a half mile wide (a quarter mile around Zone 1). I will not call a listing uninsurable. Bindability is a licensed producer question; lava is not hurricane and not flood.",
    whoItFits:
      "People who can do the homework before they fall in love with a listing photo — and who can live with catchment, distance, and a volcanic landscape as a fact, not a backdrop.",
  },
  {
    slug: "kau",
    name: "Kaʻū",
    lede: "The southern district: rural, wind, long views, and long drives.",
    living: [
      "Kaʻū is Nāʻālehu, Pāhala, Ocean View, Ka Lae (South Point), and a lot of open land. It is the southernmost district. Services are thin. Wind is not a metaphor. If you need a drugstore and a hospital ten minutes away, this is not your district.",
      "People come here for space and quiet. I will not call that undeveloped charm. I will ask whether you have driven it in the rain, at night, and on a day when you needed something that only Hilo or Kona stocks.",
    ],
    water:
      "Many rural subdivisions run on catchment. Confirm the TMK with DWS instead of trusting a listing’s one-word water field.",
    lava:
      "Kaʻū includes slopes of Mauna Loa and, in places, Kīlauea. Hazard is not uniform across the district. Ocean View is not Nāʻālehu. We use the USGS map at neighborhood scale and we do not treat a zone color as a survey.",
    whoItFits:
      "People who want rural south-island life, can maintain their own systems, and are honest about how far everything is.",
  },
  {
    slug: "north-hilo",
    name: "North Hilo",
    lede: "The wet coast between Hilo town and Hāmākua: streams, jungle, and agricultural lots.",
    living: [
      "North Hilo is Honomū, Hakalau, Nīnole — rain, waterfalls, and land that grows things whether you asked it to or not. You are close enough to Hilo that town is a drive, not a relocation. You are not in town.",
      "If you want a dry lanai and a cactus garden, look west. If you want green and you can live with mold as a maintenance question, we can talk about this coast.",
    ],
    water:
      "Streams you can see are not the same as a DWS meter. Catchment appears on rural and agricultural lots. Verify the TMK.",
    lava:
      "This side of the island is generally lower long-term lava-flow hazard than the active rift zones. I still will not stamp a zone on a lot without the map. Neighborhood scale, not a pin that pretends to be a survey.",
    whoItFits:
      "People who want to stay near Hilo services without living in Hilo, and who accept rain as the climate, not a seasonal inconvenience.",
  },
  {
    slug: "south-hilo",
    name: "South Hilo",
    lede: "Hilo: county seat, hospital, airport, rain, and the east-side town that actually works as a town.",
    living: [
      "South Hilo is Hilo — bay, rain, schools, UH Hilo, the hospital, and the county offices. My office is here, at 101 Hualalai Street. This is where east-side errands actually get done.",
      "It rains. That is not a rumor. People who fight the weather usually belong in Kona. People who want a real town on this island, with doctors and a hardware store, often end up here or asking how close they can be.",
    ],
    water:
      "Town is more likely to be on DWS than a Puna subdivision. “More likely” is not your TMK. A main still does not guarantee a meter on a given parcel.",
    lava:
      "Hilo is not the East Rift Zone. It is also not Zone-9 Kohala. We still look at the USGS map for the neighborhood you are actually buying, because the district is larger than downtown.",
    whoItFits:
      "People who want east-side services, can live with rain, and would rather have a town than a postcard.",
  },
];

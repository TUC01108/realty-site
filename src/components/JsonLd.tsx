// Tells Google this is a local real estate agent in Hilo, Hawaii.
// Renders as an invisible <script> tag — can trigger rich results in search.
export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Your Big Island Real Estate",
    alternateName: "Yordana Bolanos Salas",
    description:
      "Licensed REALTOR® serving all nine districts of Hawai'i Island (The Big Island). Specializing in buying, selling, investing, and relocation. Coldwell Banker Island Properties.",
    url: "https://www.yourbigislandrealestate.com",
    logo: "https://www.yourbigislandrealestate.com/images/logo-square.png",
    image: "https://www.yourbigislandrealestate.com/images/og-image.jpg",
    telephone: "+18086424933",
    email: "yourbigislandrealestate@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "101 Hualalai Street",
      addressLocality: "Hilo",
      addressRegion: "HI",
      postalCode: "96720",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.7241,
      longitude: -155.0868,
    },
    areaServed: [
      "North Kohala, Hawaii",
      "South Kohala, Hawaii",
      "North Kona, Hawaii",
      "South Kona, Hawaii",
      "Hāmākua, Hawaii",
      "Puna, Hawaii",
      "Kaʻū, Hawaii",
      "North Hilo, Hawaii",
      "South Hilo, Hawaii",
    ],
    sameAs: [
      "https://www.instagram.com/yourbigislandrealestate",
      "https://linktr.ee/yourbigislandrealestate",
    ],
    memberOf: {
      "@type": "Organization",
      name: "Coldwell Banker Island Properties",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Real Estate License",
      name: "Hawaii Real Estate Salesperson License RS-88323",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

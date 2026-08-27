import { brand } from "@/lib/brand"

export function absUrl(path = "/") {
  if (path === "/") return brand.siteUrl
  return `${brand.siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "RealEstateAgent"],
    name: brand.agentName,
    url: absUrl("/about"),
    image: absUrl("/images/headshot.png"),
    jobTitle: brand.jobTitle,
    description: brand.description,
    telephone: brand.phoneHref.replace("tel:", ""),
    email: brand.email,
    knowsLanguage: [...brand.languageList],
    identifier: brand.license,
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      identifier: brand.license,
      name: `Hawaiʻi real estate salesperson license ${brand.license}`,
    },
    worksFor: {
      "@type": "RealEstateAgent",
      name: brand.brokerage,
      address: postalAddress(),
    },
    affiliation: {
      "@type": "Organization",
      name: brand.brokerage,
    },
    address: postalAddress(),
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Hawaiʻi Island",
    },
    sameAs: [brand.instagram, brand.cbProfile],
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
  }
}

export function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: brand.streetAddress,
    addressLocality: brand.addressLocality,
    addressRegion: brand.addressRegion,
    postalCode: brand.postalCode,
    addressCountry: "US",
  }
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: brand.name,
    url: brand.siteUrl,
    image: absUrl("/images/logo-square.png"),
    telephone: brand.phoneHref.replace("tel:", ""),
    email: brand.email,
    address: postalAddress(),
    employee: {
      "@type": "Person",
      name: brand.agentName,
      identifier: brand.license,
    },
    parentOrganization: {
      "@type": "Organization",
      name: brand.brokerage,
    },
    sameAs: [brand.instagram, brand.cbProfile],
  }
}

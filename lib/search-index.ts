import { categories, categorySlug, subjects } from "./content";
import { solarSystemObjects } from "./solar-system";
import { landmarks, moons } from "./solar-system-3d-data";
import { timelineEvents } from "./timeline";

export type SearchKind = "Subject" | "Timeline event" | "Solar System" | "Moon" | "Landmark" | "Collection" | "Page";
export type SearchEntry = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  kind: SearchKind;
  keywords: string[];
  featured?: boolean;
};

export const searchIndex: SearchEntry[] = [
  ...subjects.map((subject): SearchEntry => ({
    id: `subject:${subject.slug}`,
    title: subject.title,
    subtitle: subject.category + " · " + subject.eyebrow,
    description: subject.summary,
    href: `/subjects/${subject.slug}`,
    kind: "Subject",
    keywords: [subject.slug, subject.category, subject.eyebrow, ...subject.related, ...subject.facts, ...subject.sources.map((source) => source.title)],
    featured: ["earth", "milky-way", "black-holes", "dinosaurs", "mars", "supernovae"].includes(subject.slug),
  })),
  ...timelineEvents.map((event): SearchEntry => ({
    id: `timeline:${event.id}`,
    title: event.title,
    subtitle: `Timeline · ${event.era} · ${event.date}`,
    description: event.description,
    href: `/timeline#${event.id}`,
    kind: "Timeline event",
    keywords: [event.id, event.date, event.era, event.sourceTitle, event.sourcePublisher],
  })),
  ...solarSystemObjects.map((object): SearchEntry => ({
    id: `solar:${object.slug}`,
    title: object.name,
    subtitle: `Solar System · ${object.kind}`,
    description: object.summary,
    href: object.orionPath ?? `/solar-system/3d?object=${object.slug}`,
    kind: "Solar System",
    keywords: [object.slug, object.group, object.kind, object.detail, object.fact, object.sourceTitle],
    featured: ["sun", "earth", "mars", "pluto", "moon"].includes(object.slug),
  })),
  ...moons.map((moon): SearchEntry => ({
    id: `moon:${moon.slug}`,
    title: moon.label,
    subtitle: `3D Solar System · Moon of ${solarSystemObjects.find((object) => object.slug === moon.parent)?.name ?? moon.parent}`,
    description: moon.summary,
    href: `/solar-system/3d?object=${moon.slug}`,
    kind: "Moon",
    keywords: [moon.slug, moon.parent, moon.fact],
  })),
  ...landmarks.map((landmark): SearchEntry => ({
    id: `landmark:${landmark.slug}`,
    title: landmark.label,
    subtitle: `3D Solar System · Landmark on ${landmark.parent === "earth" ? "Earth" : "Mars"}`,
    description: landmark.summary,
    href: `/solar-system/3d?landmark=${landmark.slug}`,
    kind: "Landmark",
    keywords: [landmark.slug, landmark.parent, landmark.fact],
  })),
  ...categories.map((category): SearchEntry => ({
    id: `collection:${categorySlug(category.name)}`,
    title: category.name,
    subtitle: "Knowledge collection",
    description: category.description,
    href: "/#explore",
    kind: "Collection",
    keywords: [categorySlug(category.name), category.name, ...subjects.filter((subject) => subject.category === category.name).map((subject) => subject.title)],
  })),
  { id: "page:home", title: "Orion home", subtitle: "Page · Start exploring", description: "Return to the Orion Universe homepage and browse the knowledge library.", href: "/", kind: "Page", keywords: ["home", "homepage", "start", "orion"] },
  { id: "page:timeline", title: "Timeline of Everything", subtitle: "Page · Past, present and future", description: "Travel through cosmic history, Earth, life, humanity, and possible futures.", href: "/timeline", kind: "Page", keywords: ["history", "dates", "chronology", "events", "time"] },
  { id: "page:solar-system", title: "Solar System Explorer", subtitle: "Interactive explorer", description: "Explore the Sun, eight planets, Pluto, and Earth's Moon.", href: "/solar-system", kind: "Page", keywords: ["planets", "sun", "worlds", "moon", "space"] },
  { id: "page:solar-system-3d", title: "3D Solar System Explorer", subtitle: "Interactive 3D experience", description: "Explore planets, moons, and notable surface landmarks in a 3D scene.", href: "/solar-system/3d", kind: "Page", keywords: ["three dimensional", "3d", "planets", "moons", "landmarks", "interactive"] },
  { id: "page:knowledge-graph", title: "Knowledge Graph", subtitle: "Interactive map · Connected subjects", description: "Explore how topics across the cosmos, Earth, life, history, science, and technology relate to each other.", href: "/knowledge-graph", kind: "Page", keywords: ["graph", "connections", "relationships", "network", "connected knowledge", "map"] },
  { id: "page:collections", title: "Explore collections", subtitle: "Page section · Browse by field", description: "Browse Orion’s knowledge collections across the cosmos, Solar System, Earth, life, history, and science.", href: "/#collections", kind: "Page", keywords: ["collections", "topics", "categories", "browse"] },
  { id: "page:vision", title: "Our vision", subtitle: "Page section · Why Orion exists", description: "Discover Orion’s goal: a growing, connected atlas of the universe, life, time, and scientific discovery.", href: "/#about", kind: "Page", keywords: ["vision", "mission", "about", "purpose", "project"] },
  { id: "page:creator", title: "Meet the creator", subtitle: "Page section · About the project builder", description: "Learn about the person building Orion and find professional links and contact details.", href: "/#creator", kind: "Page", keywords: ["creator", "author", "builder", "contact", "portfolio"] },
];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function searchContent(query: string, limit = 8): SearchEntry[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return searchIndex.filter((entry) => entry.featured).slice(0, limit);
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const scored: { entry: SearchEntry; score: number }[] = [];

  for (const entry of searchIndex) {
    const title = normalize(entry.title);
    const searchable = normalize([
      entry.title, entry.subtitle, entry.description, ...entry.keywords,
    ].join(" "));
    const tokenScores: number[] = [];

    for (const token of queryTokens) {
      if (!searchable.includes(token)) {
        tokenScores.length = 0;
        break;
      }
      if (title === token) tokenScores.push(70);
      else if (title.startsWith(token)) tokenScores.push(45);
      else if (title.includes(token)) tokenScores.push(30);
      else if (normalize(entry.keywords.join(" ")).includes(token)) tokenScores.push(8);
      else tokenScores.push(4);
    }

    if (tokenScores.length !== queryTokens.length) continue;

    let score = tokenScores.reduce((sum, value) => sum + value, 0);
    if (title === normalizedQuery) score += 100;
    else if (title.startsWith(normalizedQuery)) score += 45;
    else if (title.includes(normalizedQuery)) score += 25;
    if (entry.featured) score += 1;
    scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, Math.max(1, limit))
    .map(({ entry }) => entry);
}

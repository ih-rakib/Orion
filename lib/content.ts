import library from "../content/orion-library.json";

export type OrionCategory = "Cosmos" | "Solar System" | "Earth" | "Life" | "Time & History" | "Science" | "Technology & Engineering" | "People & Culture";
export type Subject = {
  slug: string;
  title: string;
  category: OrionCategory;
  eyebrow: string;
  summary: string;
  description: string;
  facts: string[];
  related: string[];
  sources: { title: string; publisher: string; url: string }[];
  accent: "blue" | "violet" | "teal" | "amber" | "rose";
  symbol: string;
  editorialStatus: "draft" | "published";
  lastReviewedAt: string | null;
};

export const categories = library.categories as { name: OrionCategory; description: string }[];
export const subjects = library.subjects as Subject[];

export function getSubject(slug: string) {
  return subjects.find((subject) => subject.slug === slug && subject.editorialStatus === "published");
}
export function getRelatedSubjects(subject: Subject) {
  return subject.related.map(getSubject).filter((item): item is Subject => Boolean(item));
}
export function categorySlug(name: OrionCategory) {
  return name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export function getCategoryBySlug(slug: string) {
  return categories.find((category) => categorySlug(category.name) === slug);
}
export function getSubjectsByCategory(category: OrionCategory) {
  return subjects.filter((subject) => subject.category === category && subject.editorialStatus === "published");
}

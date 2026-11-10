import { categories, type Subject } from "./content";

export type ContentIssue = { subject: string; field: string; message: string };

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const accents = new Set(["blue", "violet", "teal", "amber", "rose"]);

export function validateContentLibrary(records: readonly Subject[]): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const slugs = new Set<string>();
  const categoryNames = new Set<string>(categories.map((category) => category.name));

  for (const subject of records) {
    const label = subject?.slug || subject?.title || "(unknown subject)";
    const add = (field: string, message: string) => issues.push({ subject: label, field, message });

    if (!subject || typeof subject !== "object") {
      issues.push({ subject: label, field: "record", message: "Subject must be an object." });
      continue;
    }
    if (!subject.slug || !slugPattern.test(subject.slug)) add("slug", "Use a unique, lowercase, URL-safe slug.");
    if (subject.slug && slugs.has(subject.slug)) add("slug", "Duplicate subject slug.");
    if (subject.slug) slugs.add(subject.slug);

    if (!subject.title?.trim()) add("title", "A readable title is required.");
    if (!categoryNames.has(subject.category)) add("category", "Category must match a registered Orion category.");
    if (!subject.eyebrow?.trim()) add("eyebrow", "Add a short contextual label.");
    if (!subject.summary?.trim()) add("summary", "Add a concise summary for cards and search.");
    if (!subject.description?.trim()) add("description", "Add an overview for the subject page.");
    if (!Array.isArray(subject.facts) || subject.facts.length === 0 || subject.facts.some((fact) => !fact?.trim())) {
      add("facts", "Add at least one non-empty key fact.");
    }
    if (!Array.isArray(subject.related)) add("related", "Related subjects must be a list.");
    if (!accents.has(subject.accent)) add("accent", "Choose a supported accent.");
    if (!subject.symbol?.trim()) add("symbol", "Add a short symbol for the subject card.");
    if (subject.editorialStatus !== "draft" && subject.editorialStatus !== "published") add("editorialStatus", "Status must be draft or published.");
    if (subject.lastReviewedAt !== null && (typeof subject.lastReviewedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(subject.lastReviewedAt) || Number.isNaN(Date.parse(subject.lastReviewedAt)))) {
      add("lastReviewedAt", "Use an ISO calendar date (YYYY-MM-DD) or null.");
    }

    if (subject.factSources !== undefined) {
      if (!Array.isArray(subject.factSources) || !Array.isArray(subject.facts) || subject.factSources.length !== subject.facts.length) {
        add("factSources", "Fact citations must line up one-to-one with the facts list.");
      } else {
        for (const [index, cited] of subject.factSources.entries()) {
          if (!Array.isArray(cited) || cited.length === 0 || cited.some((n) => !Number.isInteger(n) || n < 0 || !Array.isArray(subject.sources) || n >= subject.sources.length)) {
            add(`factSources[${index}]`, "Cite at least one existing source index for this fact.");
          }
        }
      }
    }
    if (subject.sections !== undefined) {
      if (!Array.isArray(subject.sections) || subject.sections.length === 0) {
        add("sections", "In-depth sections must be a non-empty list when present.");
      } else {
        for (const [index, section] of subject.sections.entries()) {
          if (!section?.heading?.trim()) add(`sections[${index}].heading`, "Section heading is required.");
          if (!section?.body?.trim()) add(`sections[${index}].body`, "Section body is required.");
          if (section?.sources !== undefined && (!Array.isArray(section.sources) || section.sources.length === 0 || section.sources.some((n) => !Number.isInteger(n) || n < 0 || !Array.isArray(subject.sources) || n >= subject.sources.length))) {
            add(`sections[${index}].sources`, "Cite at least one existing source index for this section.");
          }
        }
      }
    }

    if (!Array.isArray(subject.sources) || subject.sources.length === 0) {
      add("sources", "Add at least one further-reading source.");
    } else {
      for (const [index, source] of subject.sources.entries()) {
        if (!source?.title?.trim()) add(`sources[${index}].title`, "Source title is required.");
        if (!source?.publisher?.trim()) add(`sources[${index}].publisher`, "Source publisher is required.");
        try {
          const url = new URL(source.url);
          if (url.protocol !== "https:") add(`sources[${index}].url`, "Source URLs must use HTTPS.");
        } catch {
          add(`sources[${index}].url`, "Provide a valid absolute source URL.");
        }
      }
    }
  }

  for (const subject of records) {
    if (!subject || !Array.isArray(subject.related)) continue;
    for (const relatedSlug of subject.related) {
      if (!slugs.has(relatedSlug)) {
        issues.push({ subject: subject.slug || subject.title || "(unknown subject)", field: "related", message: `Related subject "${relatedSlug}" does not exist in the library.` });
      }
    }
  }

  return issues;
}

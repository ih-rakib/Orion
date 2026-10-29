# Orion subject content guide

Orion keeps subject data separate from the reusable page template. Adding a subject to the central registry automatically makes it available to the subject-page route, category listings, global search, and related-subject links. The page design should not need to be copied for each new topic.

## Current source of truth

The source of truth for subject records and category definitions is [`content/orion-library.json`](./orion-library.json). The reusable TypeScript model and lookup helpers live in `lib/content.ts`. Page routes, categories, related links, and global search read from that shared registry.

## Subject record checklist

Every published subject should include:

- `slug`: unique lowercase URL slug, such as `deep-sea`.
- `title`, `eyebrow`, `summary`, and `description`: clear language written for curious readers.
- `category`: one of the registered categories.
- `facts`: one or more useful, specific statements.
- `related`: existing subject slugs only; these power connected exploration.
- `sources`: at least one named, HTTPS further-reading reference with a publisher.
- `editorialStatus`: `draft` or `published`; only published subjects are resolved by public subject routes.
- `lastReviewedAt`: `YYYY-MM-DD` after a human source review, or `null` until one has actually happened.
- `accent` and `symbol`: a supported visual accent and a compact card symbol.

## Safe authoring workflow

1. Add the record to the `subjects` array in `content/orion-library.json`; do not create a one-off page component.
2. Reuse existing subject slugs in `related`. Add the reciprocal link where it improves discovery.
3. Prefer primary sources and recognized scientific, educational, cultural, or public institutions. A source list is further reading, not a claim-by-claim citation.
4. Run `npm run content:check`, `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build`.
5. Check that the new subject appears in the library and search, opens at `/subjects/<slug>`, and has working related links.

## Content integrity

`lib/content-validation.ts` checks the record contract, unique slugs, registered categories, source URLs, and relationship references. Automated tests exercise both the current library and invalid examples. GitHub Actions runs these checks with the rest of the project validation.

## Growth direction

This JSON registry is a lightweight starting point, not a full editorial CMS. When the library grows beyond comfortable code review, move records into structured JSON/MDX or a database-backed editorial workflow while preserving the same subject contract and reusable routes. A future CMS should add draft/published state, source review dates, claim-level citations, change history, and editorial review without coupling content to page layout.

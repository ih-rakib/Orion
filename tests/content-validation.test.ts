import test from "node:test";
import assert from "node:assert/strict";
import { allSubjectRecords, subjects, type Subject } from "../lib/content";
import { validateContentLibrary } from "../lib/content-validation";

test("the current Orion library satisfies the content contract", () => {
  assert.deepEqual(validateContentLibrary(allSubjectRecords), []);
});

test("the validator catches duplicate slugs, broken relationships, and invalid sources", () => {
  const valid = subjects[0];
  const broken = {
    ...valid,
    title: "",
    related: ["subject-that-does-not-exist"],
    sources: [{ title: "Broken source", publisher: "Example", url: "not-a-url" }],
  } as Subject;
  const issues = validateContentLibrary([valid, { ...valid }, broken]);
  assert.ok(issues.some((issue) => issue.field === "slug" && issue.message.includes("Duplicate")));
  assert.ok(issues.some((issue) => issue.field === "title"));
  assert.ok(issues.some((issue) => issue.field === "related" && issue.message.includes("does-not-exist")));
  assert.ok(issues.some((issue) => issue.field === "sources[0].url"));
});


test("structured records include explicit editorial status and review metadata", () => {
  for (const subject of subjects) {
    assert.ok(["draft", "published"].includes(subject.editorialStatus));
    assert.ok(subject.lastReviewedAt === null || /^\\d{4}-\\d{2}-\\d{2}$/.test(subject.lastReviewedAt));
  }
});

test("the validator rejects invalid editorial status and review dates", () => {
  const invalid = {
    ...subjects[0],
    editorialStatus: "public" as "published",
    lastReviewedAt: "not-a-date",
  };
  const issues = validateContentLibrary([invalid]);
  assert.ok(issues.some((issue) => issue.field === "editorialStatus"));
  assert.ok(issues.some((issue) => issue.field === "lastReviewedAt"));
});


test("draft records are excluded from public subject routes and listings", async () => {
  const { getSubject, getSubjectsByCategory } = await import("../lib/content");
  const draft = { ...allSubjectRecords[0], slug: "private-draft", editorialStatus: "draft" as const };
  assert.equal(getSubject(draft.slug), undefined);
  assert.ok(!subjects.some((subject) => subject.slug === draft.slug));
  assert.ok(getSubjectsByCategory(draft.category).every((subject) => subject.editorialStatus === "published"));
});

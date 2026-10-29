import test from "node:test";
import assert from "node:assert/strict";
import { subjects, type Subject } from "../lib/content";
import { validateContentLibrary } from "../lib/content-validation";

test("the current Orion library satisfies the content contract", () => {
  assert.deepEqual(validateContentLibrary(subjects), []);
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

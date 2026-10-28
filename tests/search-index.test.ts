import test from "node:test";
import assert from "node:assert/strict";
import { searchContent, searchIndex } from "../lib/search-index";

test("global index covers subjects, timeline events, planets, moons, landmarks, and pages", () => {
  const kinds = new Set<string>(searchIndex.map((entry) => entry.kind));
  for (const kind of ["Subject", "Timeline event", "Solar System", "Moon", "Landmark", "Collection", "Page"]) {
    assert.ok(kinds.has(kind), `Missing search kind: ${kind}`);
  }
});

test("global search finds subjects by title and descriptive keywords", () => {
  assert.ok(searchContent("black holes").some((entry) => entry.href === "/subjects/black-holes"));
  assert.ok(searchContent("creator").some((entry) => entry.href === "/#creator"));
  assert.ok(searchContent("Europa").some((entry) => entry.href === "/solar-system/3d?object=europa"));
  assert.ok(searchContent("volcanic moon").some((entry) => entry.title === "Io"));
  assert.ok(searchContent("red planet").some((entry) => entry.href === "/subjects/mars" || entry.title === "Mars"));
});

test("global search finds timeline events and links to their anchors", () => {
  const result = searchContent("dinosaurs appear").find((entry) => entry.kind === "Timeline event");
  assert.equal(result?.href, "/timeline#dinosaurs");
});

test("global search finds 3D moons and landmarks from shared content data", () => {
  assert.ok(searchContent("Europa ocean").some((entry) => entry.kind === "Moon" && entry.title === "Europa" && entry.href === "/solar-system/3d?object=europa"));
  assert.ok(searchContent("Olympus Mons volcano").some((entry) => entry.kind === "Landmark" && entry.href === "/solar-system/3d?landmark=olympus-mons"));
});

test("global search returns useful popular suggestions when the query is empty", () => {
  const results = searchContent("");
  assert.ok(results.length > 0);
  assert.ok(results.some((entry) => entry.title === "Earth"));
  assert.ok(results.length <= 8);
});

test("global search normalizes accents and punctuation", () => {
  assert.ok(searchContent("earths moon").some((entry) => entry.title === "Earth’s Moon"));
});

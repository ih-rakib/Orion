import test from "node:test";
import assert from "node:assert/strict";
import { getSolarSystemObject, solarSystemObjects, solarSystemGroups } from "../lib/solar-system";

test("Solar System explorer includes the Sun, eight planets, Pluto and the Moon", () => {
  assert.ok(getSolarSystemObject("sun"));
  assert.equal(solarSystemObjects.filter((object) => object.kind === "Planet").length, 8);
  assert.equal(getSolarSystemObject("pluto")?.kind, "Dwarf planet");
  assert.equal(getSolarSystemObject("moon")?.kind, "Natural satellite");
});

test("Solar System object slugs are unique and look-up resolves", () => {
  const slugs = solarSystemObjects.map((object) => object.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const object of solarSystemObjects) {
    assert.equal(getSolarSystemObject(object.slug)?.name, object.name);
    assert.match(object.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test("each object has useful guide content and a valid HTTPS source", () => {
  for (const object of solarSystemObjects) {
    assert.ok(object.summary.trim(), `Missing summary for ${object.name}`);
    assert.ok(object.detail.trim(), `Missing details for ${object.name}`);
    assert.ok(object.fact.trim(), `Missing fact for ${object.name}`);
    assert.ok(object.sourceTitle.trim(), `Missing source title for ${object.name}`);
    assert.match(object.sourceUrl, /^https:\/\//);
    assert.doesNotThrow(() => new URL(object.sourceUrl));
    if (object.orionPath) assert.match(object.orionPath, /^\/subjects\//);
  }
});

test("all objects are assigned to a recognized display group", () => {
  for (const object of solarSystemObjects) assert.ok(solarSystemGroups.includes(object.group as typeof solarSystemGroups[number]));
});

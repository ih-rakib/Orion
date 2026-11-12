import test from "node:test";
import assert from "node:assert/strict";
import {
  JOURNEY_KEYFRAMES,
  clamp01,
  lerpColor,
  makeJourneyParticles,
  phaseAt,
  progressForIndex,
} from "../lib/cosmic-journey";

test("journey keyframes span the whole arc in ascending order", () => {
  assert.ok(JOURNEY_KEYFRAMES.length >= 2);
  assert.equal(JOURNEY_KEYFRAMES[0].at, 0);
  assert.equal(JOURNEY_KEYFRAMES[JOURNEY_KEYFRAMES.length - 1].at, 1);
  const positions = JOURNEY_KEYFRAMES.map((frame) => frame.at);
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  for (const frame of JOURNEY_KEYFRAMES) {
    const p = frame.params;
    for (const value of [p.coreRadius, p.spread, p.twinkle, p.cluster, p.orb, p.lights, p.moon, p.bgWarm, p.dim]) {
      assert.ok(value >= 0 && value <= 1, `param out of range at ${frame.at}: ${value}`);
    }
    for (const channel of p.coreColor) {
      assert.ok(channel >= 0 && channel <= 255);
    }
  }
});

test("phaseAt clamps outside the arc and hits keyframes exactly", () => {
  assert.deepEqual(phaseAt(-0.5), phaseAt(0));
  assert.deepEqual(phaseAt(1.5), phaseAt(1));
  assert.deepEqual(phaseAt(0), JOURNEY_KEYFRAMES[0].params);
  assert.deepEqual(phaseAt(1), JOURNEY_KEYFRAMES[JOURNEY_KEYFRAMES.length - 1].params);
});

test("phaseAt interpolates between keyframes", () => {
  const mid = phaseAt(0.035);
  const first = JOURNEY_KEYFRAMES[0].params;
  const second = JOURNEY_KEYFRAMES[1].params;
  assert.ok(mid.spread > first.spread && mid.spread < second.spread);
  assert.ok(mid.coreRadius > first.coreRadius && mid.coreRadius < second.coreRadius);
  assert.ok(mid.bgWarm < first.bgWarm && mid.bgWarm > second.bgWarm);
});

test("phaseAt describes the arc: point, then expansion, then orb, then dimming", () => {
  assert.ok(phaseAt(0).spread < 0.05);
  assert.ok(phaseAt(0).twinkle === 0);
  assert.ok(phaseAt(0.2).twinkle > 0.9);
  assert.ok(phaseAt(0.2).cluster > 0.7);
  assert.ok(phaseAt(0.5).orb > 0.8);
  assert.ok(phaseAt(0.87).lights > 0.7);
  assert.ok(phaseAt(0.87).moon === 1);
  assert.ok(phaseAt(1).dim > 0.5);
  assert.ok(phaseAt(1).orb < 0.3);
});

test("lerpColor blends channels", () => {
  assert.deepEqual(lerpColor([0, 0, 0], [255, 255, 255], 0.5), [128, 128, 128]);
  assert.deepEqual(lerpColor([10, 20, 30], [10, 20, 30], 0.7), [10, 20, 30]);
});

test("clamp01 bounds values", () => {
  assert.equal(clamp01(-2), 0);
  assert.equal(clamp01(2), 1);
  assert.equal(clamp01(0.4), 0.4);
});

test("progressForIndex maps first milestone to 0 and last to 1", () => {
  assert.equal(progressForIndex(0, 16), 0);
  assert.equal(progressForIndex(15, 16), 1);
  assert.equal(progressForIndex(5, 16), 5 / 15);
  assert.equal(progressForIndex(-3, 16), 0);
  assert.equal(progressForIndex(99, 16), 1);
  assert.equal(progressForIndex(0, 1), 0);
  assert.equal(progressForIndex(0, 0), 0);
});

test("journey particles are deterministic and bounded", () => {
  const first = makeJourneyParticles(340);
  const second = makeJourneyParticles(340);
  assert.deepEqual(first, second);
  assert.equal(first.length, 340);
  for (const particle of first) {
    assert.ok(particle.angle >= 0 && particle.angle < Math.PI * 2);
    assert.ok(particle.radius >= 0 && particle.radius <= 1);
    assert.ok(particle.size > 0);
    assert.ok(particle.warm >= 0 && particle.warm <= 1);
  }
  assert.notDeepEqual(makeJourneyParticles(10, 1), makeJourneyParticles(10, 2));
});

import test from "node:test";
import assert from "node:assert/strict";
import {timelineEvents,timelineEras} from "../lib/timeline";

test("timeline milestones have unique IDs and ascending order",()=>{
  assert.equal(new Set(timelineEvents.map(event=>event.id)).size,timelineEvents.length);
  const orders=timelineEvents.map(event=>event.order);
  assert.deepEqual(orders,[...orders].sort((a,b)=>a-b));
});

test("every timeline milestone has a readable description and source",()=>{
  for(const event of timelineEvents){
    assert.ok(event.title.trim(),`Missing title: ${event.id}`);
    assert.ok(event.description.trim(),`Missing description: ${event.id}`);
    assert.ok(timelineEras.includes(event.era),`Unknown era: ${event.id}`);
    assert.match(event.sourceUrl,/^https:\/\//,`Source must use HTTPS: ${event.id}`);
    assert.doesNotThrow(()=>new URL(event.sourceUrl),`Invalid source URL: ${event.id}`);
  }
});

test("future milestones are clearly marked as projections",()=>{
  assert.ok(timelineEvents.some(event=>event.future));
  for(const event of timelineEvents.filter(event=>event.future)){
    assert.match(event.era,/Future/);
  }
});

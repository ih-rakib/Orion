import test from "node:test";
import assert from "node:assert/strict";
import {getNextJourneyStep,learningPaths} from "../lib/learning-paths";
import {dismissWelcome,isWelcomeDismissed,loadVisited,recordVisit,type VisitStorage} from "../lib/visited";

function memoryStorage(initial:Record<string,string>={}):VisitStorage{
  const store=new Map(Object.entries(initial));
  return {getItem:key=>store.get(key)??null,setItem:(key,value)=>{store.set(key,value);}};
}

test("the first learning path is the start-here spine, in story order",()=>{
  const start=learningPaths[0];
  assert.equal(start.slug,"start-here");
  assert.deepEqual(start.subjectSlugs,["universe","stars","earth","evolution","human-origins","moon-landing"]);
});

test("getNextJourneyStep follows the first path containing a subject",()=>{
  const fromUniverse=getNextJourneyStep("universe");
  assert.ok(fromUniverse);
  assert.equal(fromUniverse.path.slug,"start-here");
  assert.equal(fromUniverse.next.slug,"stars");
  assert.equal(fromUniverse.stepIndex,0);
  const fromEarth=getNextJourneyStep("earth");
  assert.ok(fromEarth);
  assert.equal(fromEarth.path.slug,"start-here");
  assert.equal(fromEarth.next.slug,"evolution");
  const fromMars=getNextJourneyStep("mars");
  assert.ok(fromMars);
  assert.equal(fromMars.path.slug,"worlds-and-life");
  assert.equal(fromMars.next.slug,"exoplanets");
});

test("getNextJourneyStep returns null at the end of every journey",()=>{
  assert.equal(getNextJourneyStep("moon-landing"),null);
  assert.equal(getNextJourneyStep("universe")?.next.slug,"stars");
  assert.equal(getNextJourneyStep("no-such-subject"),null);
});

test("visited storage records, dedupes, and survives bad data",()=>{
  const storage=memoryStorage();
  assert.deepEqual(loadVisited(storage),[]);
  recordVisit(storage,"earth");
  recordVisit(storage,"mars");
  recordVisit(storage,"earth");
  assert.deepEqual(loadVisited(storage),["mars","earth"]);
  assert.deepEqual(loadVisited(memoryStorage({"orion:visited-subjects":"not json"})),[]);
  assert.deepEqual(loadVisited(memoryStorage({"orion:visited-subjects":JSON.stringify({a:1})})),[]);
});

test("welcome dismissal persists in storage",()=>{
  const storage=memoryStorage();
  assert.equal(isWelcomeDismissed(storage),false);
  dismissWelcome(storage);
  assert.equal(isWelcomeDismissed(storage),true);
});

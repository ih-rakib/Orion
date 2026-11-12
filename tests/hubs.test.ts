import test from "node:test";
import assert from "node:assert/strict";
import {getSubject} from "../lib/content";
import {getHub,getHubForSubject,getHubMembers,hubs} from "../lib/hubs";

test("hubs have unique slugs and at least one live hub",()=>{
  const slugs=hubs.map(hub=>hub.slug);
  assert.equal(new Set(slugs).size,slugs.length);
  assert.ok(hubs.some(hub=>hub.status==="live"));
  assert.ok(hubs.every(hub=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(hub.slug)));
});

test("every live hub member resolves to a published subject",()=>{
  for(const hub of hubs.filter(hub=>hub.status==="live")){
    assert.ok(getHubMembers(hub).length>0,hub.slug+" has no members");
    for(const member of getHubMembers(hub)){
      assert.ok(getSubject(member.slug),member.slug+" does not resolve");
    }
  }
});

test("every start-here stop is a member of its hub",()=>{
  for(const hub of hubs){
    const memberSlugs=new Set(getHubMembers(hub).map(member=>member.slug));
    for(const stop of hub.startHere)assert.ok(memberSlugs.has(stop.slug),stop.slug+" is not a member of "+hub.slug);
  }
});

test("live hubs have spotlight facts with HTTPS sources and groups",()=>{
  for(const hub of hubs.filter(hub=>hub.status==="live")){
    assert.ok(hub.spotlightFacts.length>0);
    assert.ok(hub.groups.length>0);
    for(const fact of hub.spotlightFacts){
      assert.ok(fact.value.trim()&&fact.text.trim());
      assert.ok(fact.sourceUrl.startsWith("https://"),fact.sourceUrl);
      assert.ok(fact.sourceTitle.trim()&&fact.sourcePublisher.trim());
    }
    for(const group of hub.groups)assert.ok(group.members.length>0,group.title+" has no members");
  }
});

test("coming hubs have planned groups and no members yet",()=>{
  for(const hub of hubs.filter(hub=>hub.status==="coming")){
    assert.equal(getHubMembers(hub).length,0);
    assert.ok(hub.plannedGroups.length>0);
    assert.equal(hub.heroImage,null);
  }
});

test("hub images are openly-licensed Wikimedia links, not files in the repo",()=>{
  for(const hub of hubs){
    const images=[hub.heroImage,...getHubMembers(hub).map(member=>member.image)].filter((image):image is string=>Boolean(image));
    for(const image of images){
      assert.ok(image.startsWith("https://thumb.wikimedia.org/wikipedia/commons/thumb/"),image);
      assert.ok(!image.includes("utm_"),image);
    }
  }
});

test("every hub image carries an openly-licensed credit",()=>{
  for(const hub of hubs.filter(hub=>hub.status==="live")){
    assert.match(hub.heroImageCredit,/CC BY|GFDL/);
    for(const member of getHubMembers(hub))assert.match(member.imageCredit,/CC BY|GFDL/,member.slug);
  }
});

test("getHubForSubject maps members to their hub and nothing else",()=>{
  assert.equal(getHubForSubject("baobab")?.slug,"trees");
  assert.equal(getHubForSubject("bonsai")?.slug,"trees");
  assert.equal(getHubForSubject("mars"),undefined);
  assert.equal(getHub("birds")?.status,"coming");
});

import test from "node:test";
import assert from "node:assert/strict";
import {getPathSubjects,learningPaths} from "../lib/learning-paths";

test("every learning path has a unique slug, multiple steps, and valid subject references",()=>{
  const slugs=learningPaths.map(path=>path.slug);
  assert.equal(new Set(slugs).size,slugs.length,"learning path slugs must be unique");
  for(const path of learningPaths){
    assert.ok(path.title.trim(),`Missing title for ${path.slug}`);
    assert.ok(path.description.trim(),`Missing description for ${path.slug}`);
    assert.ok(path.estimatedMinutes>0,`Invalid duration for ${path.slug}`);
    assert.ok(path.subjectSlugs.length>=3,`Path needs at least three steps: ${path.slug}`);
    assert.equal(getPathSubjects(path).length,path.subjectSlugs.length,`Unresolved subject in ${path.slug}`);
    assert.equal(new Set(path.subjectSlugs).size,path.subjectSlugs.length,`Duplicate step in ${path.slug}`);
  }
});

test("learning paths span multiple disciplines rather than focusing only on space",()=>{
  const allSubjects=new Set(learningPaths.flatMap(path=>getPathSubjects(path).map(subject=>subject.slug)));
  for(const slug of ["earth","oceans","whales","evolution","human-origins","ancient-civilizations","mathematics","artificial-intelligence","mars","exoplanets"]){
    assert.ok(allSubjects.has(slug),`Learning paths should include ${slug}`);
  }
  assert.ok(learningPaths.some(path=>new Set(getPathSubjects(path).map(subject=>subject.category)).size>=3),"At least one path should cross three or more categories");
});

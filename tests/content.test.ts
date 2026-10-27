import test from "node:test";
import assert from "node:assert/strict";
import {categories,categorySlug,getCategoryBySlug,getRelatedSubjects,getSubject,getSubjectsByCategory,subjects} from "../lib/content";

test("every subject has a unique, URL-safe slug",()=>{
  const slugs=subjects.map(subject=>subject.slug);
  assert.equal(new Set(slugs).size,slugs.length,"subject slugs must be unique");
  for(const slug of slugs) assert.match(slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});

test("every category has a unique slug and can be looked up",()=>{
  const slugs=categories.map(category=>categorySlug(category.name));
  assert.equal(new Set(slugs).size,slugs.length,"category slugs must be unique");
  for(const category of categories) assert.equal(getCategoryBySlug(categorySlug(category.name))?.name,category.name);
});

test("all subjects belong to a known category",()=>{
  for(const subject of subjects) assert.ok(categories.some(category=>category.name===subject.category),`Unknown category for ${subject.title}`);
});

test("every related-subject reference resolves",()=>{
  for(const subject of subjects){
    for(const slug of subject.related) assert.ok(getSubject(slug),`${subject.title} references missing subject: ${slug}`);
    assert.equal(getRelatedSubjects(subject).length,subject.related.length,`Related subjects did not resolve for ${subject.title}`);
  }
});

test("category subject counts match the content model",()=>{
  for(const category of categories){
    assert.deepEqual(getSubjectsByCategory(category.name),subjects.filter(subject=>subject.category===category.name));
  }
});

test("current starter library contains subjects across the intended areas",()=>{
  assert.ok(subjects.length>=12,"Keep a meaningful starter set in the library");
  assert.deepEqual(new Set(subjects.map(subject=>subject.category)),new Set(categories.map(category=>category.name).filter(name=>subjects.some(subject=>subject.category===name)));
});

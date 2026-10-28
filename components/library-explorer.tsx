"use client";
import { useMemo,useState } from "react";
import Link from "next/link";
import { categories,subjects,type OrionCategory } from "@/lib/content";
import { searchContent } from "@/lib/search-index";

export function LibraryExplorer(){
  const [query,setQuery]=useState("");
  const [activeCategory,setActiveCategory]=useState<OrionCategory|"All">("All");
  const isSearching=query.trim().length>0;
  const filtered=useMemo(()=>subjects.filter(subject=>activeCategory==="All"||subject.category===activeCategory),[activeCategory]);
  const globalResults=useMemo(()=>isSearching?searchContent(query,100):[],[query,isSearching]);
  const resultCount=isSearching?globalResults.length:filtered.length;

  return <section className="library-section" id="explore" aria-labelledby="library-title">
    <div className="section-heading"><div><p className="eyebrow">THE KNOWLEDGE LIBRARY</p><h2 id="library-title">A universe of things to discover.</h2><p className="section-description">{isSearching?"Searching across Orion’s subjects, timeline, planets, moons and landmarks.":"Start anywhere. Follow your curiosity."}</p></div><span className="result-count" aria-live="polite">{resultCount} {isSearching?"results":"subjects"}</span></div>
    <label className="search-box"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7"/><path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg><span className="sr-only">Search all Orion content</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search anything: Europa, galaxies, dinosaurs, deep time…" type="search"/>{query&&<button type="button" className="clear-search" onClick={()=>setQuery("")}>Clear</button>}</label>
    {!isSearching&&<div className="category-filters" aria-label="Filter by category"><button type="button" className={activeCategory==="All"?"filter-chip active":"filter-chip"} onClick={()=>setActiveCategory("All")} aria-pressed={activeCategory==="All"}>All topics</button>{categories.map(category=><button key={category.name} type="button" className={activeCategory===category.name?"filter-chip active":"filter-chip"} onClick={()=>setActiveCategory(category.name)} aria-pressed={activeCategory===category.name}>{category.name}</button>)}</div>}
    {isSearching ? (globalResults.length ? <div className="global-library-results">{globalResults.map(result=><Link className="global-library-result" href={result.href} key={result.id}><span className="global-library-result-kind">{result.kind}</span><h3>{result.title}</h3><p className="global-library-result-subtitle">{result.subtitle}</p><p className="global-library-result-description">{result.description}</p><span className="global-library-result-link">Explore result <span aria-hidden="true">↗</span></span></Link>)}</div> : <div className="empty-state"><span aria-hidden="true">⌕</span><h3>No matching content yet</h3><p>Try a broader term such as “space”, “life”, “Earth”, or “history”.</p><button type="button" className="text-button" onClick={()=>setQuery("")}>Clear search</button></div>) : (filtered.length ? <div className="subject-grid">{filtered.map((subject,index)=><Link className={`subject-card accent-${subject.accent}`} href={`/subjects/${subject.slug}`} key={subject.slug}><div className="subject-card-top"><span className="subject-symbol" aria-hidden="true">{subject.symbol}</span><span className="card-index">{String(index+1).padStart(2,"0")}</span></div><p className="card-category">{subject.category}</p><h3>{subject.title}</h3><p className="card-summary">{subject.summary}</p><span className="card-link">Explore subject <span aria-hidden="true">↗</span></span></Link>)}</div> : <div className="empty-state"><span aria-hidden="true">⌕</span><h3>No subjects in this collection yet</h3><p>Choose another category or view all topics.</p><button type="button" className="text-button" onClick={()=>setActiveCategory("All")}>Show all topics</button></div>)}
  </section>
}

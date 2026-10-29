"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { subjects, type OrionCategory } from "@/lib/content";

type Point = { x: number; y: number };
const positions: Record<string, Point> = {
  universe:{x:470,y:82}, galaxies:{x:325,y:110}, "milky-way":{x:200,y:180}, "black-holes":{x:390,y:200},
  "orion-nebula":{x:130,y:285}, stars:{x:280,y:300}, supernovae:{x:440,y:310}, exoplanets:{x:570,y:190},
  mars:{x:720,y:155}, pluto:{x:850,y:220}, earth:{x:680,y:315}, oceans:{x:770,y:410},
  "climate-change":{x:620,y:470}, whales:{x:850,y:500}, evolution:{x:430,y:455}, dinosaurs:{x:300,y:500},
  "human-origins":{x:440,y:580}, "ancient-civilizations":{x:610,y:590}, mathematics:{x:790,y:80},
  "artificial-intelligence":{x:890,y:350},
};
const categoryColors: Record<OrionCategory,string> = {
  "Cosmos":"#a99bff","Solar System":"#83b8ff","Earth":"#78dfd0","Life":"#e9c27c",
  "Time & History":"#ff9ba9","Science":"#c1b7ff","Technology & Engineering":"#7dd3fc","People & Culture":"#f0abfc",
};
const slugTitle = (slug:string) => subjects.find((subject)=>subject.slug===slug)?.title ?? slug;

export function KnowledgeGraph(){
  const [activeCategory,setActiveCategory]=useState<OrionCategory|"All">("All");
  const [query,setQuery]=useState("");
  const nodes=useMemo(()=>subjects.filter((subject)=>{
    const matchesCategory=activeCategory==="All"||subject.category===activeCategory;
    const text=(subject.title+" "+subject.summary+" "+subject.category).toLowerCase();
    return matchesCategory&&text.includes(query.trim().toLowerCase());
  }),[activeCategory,query]);
  const visibleSlugs=new Set(nodes.map((node)=>node.slug));
  const edges=useMemo(()=>{
    const seen=new Set<string>();
    return subjects.flatMap((subject)=>subject.related.map((slug)=>{
      const key=[subject.slug,slug].sort().join("|");
      if(seen.has(key)||!positions[slug]||!positions[subject.slug])return null;
      seen.add(key);
      return {id:key,from:subject.slug,to:slug};
    }).filter((edge):edge is {id:string;from:string;to:string}=>edge!==null));
  },[]);
  const categories=Array.from(new Set(subjects.map((subject)=>subject.category)));

  return <main id="main-content" className="knowledge-graph-page">
    <section className="graph-hero">
      <Link href="/" className="back-link">← Back to Orion</Link>
      <p className="eyebrow">THE KNOWLEDGE GRAPH · EXPLORE THE CONNECTIONS</p>
      <h1>Nothing exists<br/>in isolation<span className="hero-period">.</span></h1>
      <p>Every subject is a doorway into another. Follow the lines between worlds, life, history, and ideas to see how knowledge fits together.</p>
      <div className="graph-stats"><span><strong>{subjects.length}</strong> connected subjects</span><span><strong>{edges.length}</strong> relationships mapped</span><span>EXPANDING WITH ORION</span></div>
    </section>
    <section className="graph-workspace" aria-label="Interactive knowledge graph">
      <div className="graph-toolbar">
        <label className="graph-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Find a subject in the graph…" aria-label="Find a subject in the graph"/></label>
        <div className="graph-filters" aria-label="Filter graph by category">
          <button type="button" className={activeCategory==="All"?"graph-filter active":"graph-filter"} onClick={()=>setActiveCategory("All")}>All subjects</button>
          {categories.map((category)=><button type="button" key={category} className={activeCategory===category?"graph-filter active":"graph-filter"} onClick={()=>setActiveCategory(category)}>{category}</button>)}
        </div>
      </div>
      <div className="graph-canvas-wrap">
        <svg className="knowledge-graph-svg" viewBox="0 0 1000 660" role="img" aria-labelledby="graph-svg-title graph-svg-description">
          <title id="graph-svg-title">Orion subject connection map</title>
          <desc id="graph-svg-description">A network of subjects connected by their related-topic links. Select a node to open its subject guide.</desc>
          <defs><radialGradient id="graph-glow"><stop offset="0%" stopColor="#aaa0ff" stopOpacity=".14"/><stop offset="100%" stopColor="#aaa0ff" stopOpacity="0"/></radialGradient></defs>
          <ellipse cx="490" cy="330" rx="470" ry="310" fill="url(#graph-glow)"/>
          {edges.map((edge)=>{
            const from=positions[edge.from],to=positions[edge.to];
            const visible=visibleSlugs.has(edge.from)&&visibleSlugs.has(edge.to);
            return <line key={edge.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={visible?"graph-edge":"graph-edge graph-edge-muted"} />;
          })}
          {nodes.map((subject)=>{
            const point=positions[subject.slug];
            const degree=subject.related.length;
            const radius=10+Math.min(degree,4)*2;
            return <a key={subject.slug} href={"/subjects/"+subject.slug} className="graph-node-link" aria-label={"Explore "+subject.title}>
              <title>{subject.title} — {subject.category}. Open subject guide.</title>
              <circle cx={point.x} cy={point.y} r={radius+10} fill={categoryColors[subject.category]} opacity=".08"/>
              <circle cx={point.x} cy={point.y} r={radius} fill="#0d1324" stroke={categoryColors[subject.category]} strokeWidth="2.5" className="graph-node"/>
              <circle cx={point.x} cy={point.y} r="3" fill={categoryColors[subject.category]}/>
              <text x={point.x} y={point.y+radius+17} textAnchor="middle" className="graph-node-label">{subject.title}</text>
            </a>;
          })}
        </svg>
        <div className="graph-canvas-caption"><span><span className="live-dot"/> LIVE TOPIC MAP</span><span>SELECT A NODE TO EXPLORE ↗</span></div>
      </div>
      {nodes.length===0?<div className="empty-state"><span aria-hidden="true">⌕</span><h3>No matching subjects</h3><p>Try another keyword or switch to all subjects.</p><button type="button" className="text-button" onClick={()=>{setQuery("");setActiveCategory("All");}}>Reset graph</button></div>:<div className="graph-subject-list"><div className="section-heading"><div><p className="eyebrow">IN THIS VIEW</p><h2>{activeCategory==="All"?"Explore a connection":activeCategory}</h2><p className="section-description">{nodes.length} subjects shown. Choose a guide to go deeper.</p></div></div><div className="graph-subject-grid">{nodes.map((subject)=><Link key={subject.slug} href={"/subjects/"+subject.slug} className="graph-subject-card"><span className="graph-subject-dot" style={{backgroundColor:categoryColors[subject.category]}}/><span><strong>{subject.title}</strong><small>{subject.category} · {subject.related.map(slugTitle).slice(0,3).join(" · ")}</small></span><span aria-hidden="true">↗</span></Link>)}</div></div>}
    </section>
  </main>;
}

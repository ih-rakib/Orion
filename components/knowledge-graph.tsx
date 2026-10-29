"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { subjects, type OrionCategory } from "@/lib/content";

type Point={x:number;y:number};
const positions:Record<string,Point>={
  universe:{x:470,y:82},galaxies:{x:325,y:110},"milky-way":{x:200,y:180},"black-holes":{x:390,y:200},
  "orion-nebula":{x:130,y:285},stars:{x:280,y:300},supernovae:{x:440,y:310},exoplanets:{x:570,y:190},
  mars:{x:720,y:155},pluto:{x:850,y:220},earth:{x:680,y:315},oceans:{x:770,y:410},
  "climate-change":{x:620,y:470},whales:{x:850,y:500},evolution:{x:430,y:455},dinosaurs:{x:300,y:500},
  "human-origins":{x:440,y:580},"ancient-civilizations":{x:610,y:590},mathematics:{x:790,y:80},
  "artificial-intelligence":{x:890,y:350},
};
const categoryColors:Record<OrionCategory,string>={
  "Cosmos":"#a99bff","Solar System":"#83b8ff","Earth":"#78dfd0","Life":"#e9c27c",
  "Time & History":"#ff9ba9","Science":"#c1b7ff","Technology & Engineering":"#7dd3fc","People & Culture":"#f0abfc",
};
const slugTitle=(slug:string)=>subjects.find(s=>s.slug===slug)?.title??slug;
const pairKey=(a:string,b:string)=>[a,b].sort().join("|");
const relationshipNotes:Record<string,string>={
  "black-holes|milky-way":"A supermassive black hole lies at the Milky Way’s centre, and black holes also form through stellar evolution.",
  "black-holes|supernovae":"Some stellar-mass black holes can form when massive stars collapse after their lives end; not every supernova leaves one behind.",
  "black-holes|universe":"Black holes help astronomers test gravity and study some of the universe’s most energetic environments.",
  "milky-way|orion-nebula":"The Orion Nebula is a nearby star-forming region inside our own Milky Way galaxy.",
  "orion-nebula|stars":"The Orion Nebula is a stellar nursery where gas and dust collapse to form new stars.",
  "exoplanets|stars":"Exoplanets orbit stars beyond our Sun, and astronomers often detect them by observing their effects on starlight.",
  "earth|mars":"Earth and Mars are rocky planets that preserve clues about how terrestrial worlds evolve.",
  "earth|oceans":"Earth’s oceans regulate climate, move heat around the planet, and support an extraordinary diversity of life.",
  "climate-change|earth":"Climate change alters Earth’s energy balance and affects weather patterns, ice, ecosystems, and sea level.",
  "climate-change|oceans":"Oceans absorb much of the excess heat from global warming and also take up carbon dioxide, changing marine conditions.",
  "dinosaurs|evolution":"Dinosaurs are one branch of the evolutionary tree; birds are living dinosaurs descended from theropods.",
  "dinosaurs|earth":"Fossils and rock layers reveal how dinosaurs lived in changing environments across ancient Earth.",
  "evolution|oceans":"Life evolved in aquatic environments, and oceans remain important settings for biodiversity and evolutionary change.",
  "evolution|whales":"Whales evolved from land-dwelling mammal ancestors; fossils document their transition back to aquatic life.",
  "oceans|whales":"Whales depend on ocean food webs, habitats, and migration routes, making ocean health central to their survival.",
  "ancient-civilizations|human-origins":"Human origins explores the much longer story of our species; ancient civilizations cover later societies, cities, and states.",
  "ancient-civilizations|mathematics":"Early societies developed practical mathematics for calendars, trade, surveying, architecture, and administration.",
  "artificial-intelligence|mathematics":"Modern AI relies on mathematical ideas including linear algebra, probability, statistics, and optimization.",
  "artificial-intelligence|climate-change":"AI can help analyse climate data and model complex systems, but its computing also uses energy and resources.",
  "artificial-intelligence|human-origins":"Comparing human cognition and artificial intelligence raises questions about learning, language, reasoning, and what intelligence means.",
  "galaxies|milky-way":"The Milky Way is the galaxy that contains our Solar System; galaxies come in many shapes and sizes.",
  "galaxies|universe":"Galaxies are vast collections of stars, gas, dust, and dark matter distributed throughout the observable universe.",
  "galaxies|stars":"Stars are the building blocks of galaxies, whose gravity binds stellar populations into enormous systems.",
  "earth|evolution":"Earth’s changing environments have shaped the evolution of life over billions of years.",
  "earth|universe":"Earth is one planet orbiting one star in the Milky Way, within the observable universe.",
  "mathematics|universe":"Mathematics provides tools for describing patterns in nature and building models of physical processes.",
  "mars|pluto":"Mars and Pluto are very different worlds, but comparing them helps explain how planetary science classifies and studies Solar System bodies.",
  "mars|exoplanets":"Studying Mars alongside exoplanets helps scientists compare rocky worlds and ask which environments might support life.",
  "evolution|human-origins":"Human origins is part of evolutionary biology, drawing on fossils, genetics, archaeology, and comparative anatomy.",
  "earth|whales":"Whales are mammals that evolved on Earth and now depend on marine ecosystems across the planet.",
};
function explain(a:string,b:string){
  return relationshipNotes[pairKey(a,b)]??`These subjects are linked in Orion’s topic map. Explore both guides to investigate their shared concepts and evidence.`;
}
function shortestPath(from:string,to:string):string[]{
  if(from===to)return[from];
  const queue:string[][]=[[from]],visited=new Set([from]);
  while(queue.length){
    const path=queue.shift()!,last=path[path.length-1];
    const current=subjects.find(s=>s.slug===last);
    for(const next of current?.related??[]){
      if(visited.has(next))continue;
      const nextPath=[...path,next];
      if(next===to)return nextPath;
      visited.add(next);queue.push(nextPath);
    }
  }
  return[];
}

export function KnowledgeGraph(){
  const [activeCategory,setActiveCategory]=useState<OrionCategory|"All">("All");
  const [query,setQuery]=useState("");
  const [selectedSlug,setSelectedSlug]=useState("whales");
  const [pathFrom,setPathFrom]=useState("whales");
  const [pathTo,setPathTo]=useState("artificial-intelligence");
  const [showPath,setShowPath]=useState(false);
  const nodes=useMemo(()=>subjects.filter(subject=>{
    const categoryMatch=activeCategory==="All"||subject.category===activeCategory;
    const q=query.trim().toLowerCase();
    return categoryMatch&&(!q||(subject.title+" "+subject.summary+" "+subject.category+" "+subject.slug).toLowerCase().includes(q));
  }),[activeCategory,query]);
  const visibleSlugs=new Set(nodes.map(n=>n.slug));
  const edges=useMemo(()=>{
    const seen=new Set<string>();
    return subjects.flatMap(subject=>subject.related.map(slug=>{
      const key=pairKey(subject.slug,slug);
      if(seen.has(key)||!positions[slug]||!positions[subject.slug])return null;
      seen.add(key);return{id:key,from:subject.slug,to:slug};
    }).filter((edge):edge is {id:string;from:string;to:string}=>edge!==null));
  },[]);
  const categories=Array.from(new Set(subjects.map(subject=>subject.category)));
  const selected=subjects.find(subject=>subject.slug===selectedSlug)??subjects[0];
  const selectedRelated=selected.related.map(slug=>subjects.find(s=>s.slug===slug)).filter((s):s is (typeof subjects)[number]=>Boolean(s));
  const path=showPath?shortestPath(pathFrom,pathTo):[];
  const pathEdges=new Set(path.slice(1).map((slug,i)=>pairKey(path[i],slug)));

  return <main id="main-content" className="knowledge-graph-page">
    <section className="graph-hero">
      <Link href="/" className="back-link">← Back to Orion</Link>
      <p className="eyebrow">THE KNOWLEDGE GRAPH · EXPLORE THE CONNECTIONS</p>
      <h1>Nothing exists<br/>in isolation<span className="hero-period">.</span></h1>
      <p>Choose any topic to see what it connects to, why the relationship matters, and how to follow a path between seemingly different ideas.</p>
      <div className="graph-stats"><span><strong>{subjects.length}</strong> connected subjects</span><span><strong>{edges.length}</strong> relationships mapped</span><span>EXPANDING WITH ORION</span></div>
    </section>
    <section className="graph-workspace" aria-label="Interactive knowledge graph">
      <div className="graph-toolbar">
        <label className="graph-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Find a subject in the graph…" aria-label="Find a subject in the graph"/></label>
        <div className="graph-filters" aria-label="Filter graph by category">
          <button type="button" className={activeCategory==="All"?"graph-filter active":"graph-filter"} onClick={()=>setActiveCategory("All")}>All subjects</button>
          {categories.map(category=><button type="button" key={category} className={activeCategory===category?"graph-filter active":"graph-filter"} onClick={()=>setActiveCategory(category)}>{category}</button>)}
        </div>
      </div>
      <div className="graph-canvas-wrap">
        <svg className="knowledge-graph-svg" viewBox="0 0 1000 660" role="img" aria-labelledby="graph-svg-title graph-svg-description">
          <title id="graph-svg-title">Orion subject connection map</title>
          <desc id="graph-svg-description">Select a topic to learn why it connects to other subjects. Use the path finder below to explore a chain of related topics.</desc>
          <defs><radialGradient id="graph-glow"><stop offset="0%" stopColor="#aaa0ff" stopOpacity=".14"/><stop offset="100%" stopColor="#aaa0ff" stopOpacity="0"/></radialGradient></defs>
          <ellipse cx="490" cy="330" rx="470" ry="310" fill="url(#graph-glow)"/>
          {edges.map(edge=>{
            const from=positions[edge.from],to=positions[edge.to];
            const visible=visibleSlugs.has(edge.from)&&visibleSlugs.has(edge.to);
            const highlighted=pathEdges.has(edge.id)||edge.from===selectedSlug||edge.to===selectedSlug;
            return <g key={edge.id}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={visible?"graph-edge":"graph-edge graph-edge-muted"} style={highlighted?{stroke:"#f2d5ff",strokeOpacity:".95",strokeWidth:2.6}:undefined}/></g>;
          })}
          {nodes.map(subject=>{
            const point=positions[subject.slug],radius=10+Math.min(subject.related.length,4)*2,active=subject.slug===selectedSlug,pathNode=showPath&&path.includes(subject.slug);
            return <g key={subject.slug} role="button" tabIndex={0} aria-label={"Select "+subject.title} aria-pressed={active} className="graph-node-link" onClick={()=>setSelectedSlug(subject.slug)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();setSelectedSlug(subject.slug);}}}>
              <title>{subject.title} — {subject.category}. Select to inspect connections.</title>
              <circle cx={point.x} cy={point.y} r={radius+12} fill={categoryColors[subject.category]} opacity={active||pathNode?".22":".08"}/>
              <circle cx={point.x} cy={point.y} r={active?radius+3:radius} fill="#0d1324" stroke={categoryColors[subject.category]} strokeWidth={active?4:2.5} className="graph-node"/>
              <circle cx={point.x} cy={point.y} r="3" fill={categoryColors[subject.category]}/>
              <text x={point.x} y={point.y+radius+19} textAnchor="middle" className="graph-node-label">{subject.title}</text>
            </g>;
          })}
        </svg>
        <div className="graph-canvas-caption"><span><span className="live-dot"/> LIVE TOPIC MAP</span><span>SELECT A NODE TO INSPECT ↗</span></div>
      </div>
      <div className="graph-detail-panel">
        <div className="graph-detail-main">
          <p className="eyebrow">SELECTED SUBJECT · {selected.category.toUpperCase()}</p>
          <h2>{selected.title}</h2>
          <p>{selected.summary}</p>
          <Link href={"/subjects/"+selected.slug} className="graph-open-guide">Open full guide <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="graph-detail-connections">
          <h3>Why it connects</h3>
          <p className="graph-detail-intro">Choose a related topic to see the link between them.</p>
          {selectedRelated.map(related=><button type="button" key={related.slug} className="graph-relationship" onClick={()=>setSelectedSlug(related.slug)}>
            <span className="graph-relationship-line" style={{backgroundColor:categoryColors[related.category]}}/>
            <span className="graph-relationship-copy"><strong>{related.title}</strong><small>{explain(selected.slug,related.slug)}</small></span>
            <span className="graph-relationship-arrow" aria-hidden="true">↗</span>
          </button>)}
        </div>
      </div>
      <section className="graph-pathfinder" aria-labelledby="pathfinder-heading">
        <div><p className="eyebrow">FOLLOW THE CONNECTIONS</p><h2 id="pathfinder-heading">Find a path between ideas</h2><p>Pick two subjects and Orion will find a chain using the relationships currently mapped in the library.</p></div>
        <div className="graph-path-controls">
          <label>Start with<select value={pathFrom} onChange={event=>{setPathFrom(event.target.value);setShowPath(false);}}>{subjects.map(s=><option key={s.slug} value={s.slug}>{s.title}</option>)}</select></label>
          <label>Connect to<select value={pathTo} onChange={event=>{setPathTo(event.target.value);setShowPath(false);}}>{subjects.map(s=><option key={s.slug} value={s.slug}>{s.title}</option>)}</select></label>
          <button type="button" className="graph-filter active graph-find-path" onClick={()=>setShowPath(true)}>Find connection ↗</button>
        </div>
        {showPath&&<div className="graph-path-result" aria-live="polite">{path.length?<><p>{path.length-1} connection{path.length===2?"":"s"} between these subjects</p><div className="graph-path-steps">{path.map((slug,index)=><span key={slug} className="graph-path-step">{index>0&&<span aria-hidden="true">→</span>}<button type="button" onClick={()=>setSelectedSlug(slug)}>{slugTitle(slug)}</button></span>)}</div><p className="graph-path-note">Each step follows a relationship recorded in Orion. The relationship notes above explain the evidence or concept linking adjacent topics.</p></>:<p>No path is mapped between these topics yet. As Orion grows, more relationships can connect them.</p>}</div>}
      </section>
      {nodes.length===0?<div className="empty-state"><span aria-hidden="true">⌕</span><h3>No matching subjects</h3><p>Try another keyword or switch to all subjects.</p><button type="button" className="text-button" onClick={()=>{setQuery("");setActiveCategory("All");}}>Reset graph</button></div>:<div className="graph-subject-list"><div className="section-heading"><div><p className="eyebrow">IN THIS VIEW</p><h2>{activeCategory==="All"?"Explore every subject":activeCategory}</h2><p className="section-description">{nodes.length} subjects shown. Select a node to inspect its relationships.</p></div></div><div className="graph-subject-grid">{nodes.map(subject=><button type="button" key={subject.slug} onClick={()=>setSelectedSlug(subject.slug)} className={"graph-subject-card"+(selectedSlug===subject.slug?" graph-subject-card-active":"")}><span className="graph-subject-dot" style={{backgroundColor:categoryColors[subject.category]}}/><span><strong>{subject.title}</strong><small>{subject.category} · {subject.related.map(slugTitle).slice(0,3).join(" · ")}</small></span><span aria-hidden="true">↗</span></button>)}</div></div>}
    </section>
  </main>;
}

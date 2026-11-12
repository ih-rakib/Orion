import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {MobileMenu} from "@/components/mobile-menu";
import {getHubMembers,hubs} from "@/lib/hubs";

export const metadata:Metadata={title:"Hubs",description:"Hubs gather many Orion subjects into one eye-catching world. Start with Trees — Birds is growing next."};
export default function HubsPage(){
 const liveHubs=hubs.filter(hub=>hub.status==="live");
 const comingHubs=hubs.filter(hub=>hub.status==="coming");
 const totalSubjects=hubs.reduce((count,hub)=>count+getHubMembers(hub).length,0);
 return <main className="hubs-page" id="main-content">
<header className="site-header"><Link href="/" className="brand" aria-label="Orion home"><span className="brand-mark" aria-hidden="true">✳</span><span>orion<span className="brand-period">.</span></span></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/#explore">Explore</Link><Link href="/#collections">Collections</Link><Link href="/timeline">Timeline</Link><Link href="/knowledge-graph">Knowledge Graph</Link><Link href="/learning-paths">Learning Paths</Link><Link href="/hubs" aria-current="page">Hubs</Link></nav><Link href="/knowledge-graph" className="header-cta">Explore connections <span aria-hidden="true">↗</span></Link><MobileMenu/></header>
<section className="hubs-hero"><Link href="/" className="back-link">← Back to Orion</Link><p className="eyebrow">THEMED WORLDS · EVERY HUB IN ONE PLACE</p><h1>Worlds to<br/>explore<span className="hero-period">.</span></h1><p>A hub gathers many subjects into one eye-catching world — a guided first stop, the facts that matter, then room to wander. Start with the hub that is open. The next one is already growing.</p><div className="graph-stats"><span><strong>{liveHubs.length}</strong> hub open</span><span><strong>{comingHubs.length}</strong> growing next</span><span><strong>{totalSubjects}</strong> subjects inside</span><span>PHOTOS OPENLY LICENSED</span></div></section>
<section className="hubs-grid" aria-label="All hubs">{hubs.map(hub=>{const members=getHubMembers(hub);const open=hub.status==="live";return <article className={open?"hub-card":"hub-card hub-card-coming"} key={hub.slug}>
{hub.heroImage?<Link href={"/hubs/"+hub.slug} className="hub-card-photo" aria-label={"Open the "+hub.title+" hub"}><Image src={hub.heroImage} alt={hub.heroImageAlt} fill sizes="(max-width: 760px) 100vw, 50vw" priority/></Link>:<div className="hub-card-art" aria-hidden="true"><span>✦</span></div>}
<div className="hub-card-body"><p className="eyebrow">{hub.eyebrow}{open?" · OPEN NOW":" · GROWING NEXT"}</p><h2>{hub.title}</h2><p>{hub.description}</p>{open?<div className="hub-card-meta"><span><strong>{members.length}</strong> subjects</span><span><strong>{hub.groups.length}</strong> groups</span></div>:<div className="hub-card-meta"><span><strong>{hub.plannedGroups.length}</strong> groups planned</span></div>}<Link href={"/hubs/"+hub.slug} className={open?"button-primary":"button-secondary"}>{open?"Open the hub":"See what’s planned"} <span aria-hidden="true">→</span></Link></div>
</article>})}</section>
<section className="hubs-footer"><p className="eyebrow">OR WANDER THE WHOLE LIBRARY</p><h2>Every subject is connected.</h2><p>Hubs are one way in. The full library, the Knowledge Graph and the guided learning paths are all still there.</p><Link href="/#explore" className="button-primary">Browse all subjects ↗</Link></section>
<footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">✳</span><span>orion<span className="brand-period">.</span></span></Link><p>A growing atlas of everything we discover.</p><Link href="/#explore" className="footer-status">BACK TO EXPLORATION ↑</Link><span className="footer-copy">© {new Date().getFullYear()} ORION</span></footer>
</main>}

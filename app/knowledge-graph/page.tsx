import type {Metadata} from "next";
import Link from "next/link";
import {MobileMenu} from "@/components/mobile-menu";
import {KnowledgeGraph} from "@/components/knowledge-graph";

export const metadata:Metadata={
  title:"Knowledge Graph",
  description:"Explore the connections between Orion's subjects across the cosmos, Earth, life, history, science, and technology.",
};

export default function KnowledgeGraphPage(){
  return <><header className="site-header"><Link href="/" className="brand" aria-label="Orion home"><span className="brand-mark" aria-hidden="true">✳</span><span>orion<span className="brand-period">.</span></span></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/#explore">Explore</Link><Link href="/#collections">Collections</Link><Link href="/timeline">Timeline</Link><Link href="/knowledge-graph" aria-current="page">Knowledge Graph</Link></nav><Link href="/solar-system/3d" className="header-cta">Try the 3D explorer <span aria-hidden="true">↗</span></Link><MobileMenu/></header><KnowledgeGraph/></>;
}

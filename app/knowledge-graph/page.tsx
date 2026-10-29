import type {Metadata} from "next";
import {MobileMenu} from "@/components/mobile-menu";
import {KnowledgeGraph} from "@/components/knowledge-graph";

export const metadata:Metadata={
  title:"Knowledge Graph",
  description:"Explore the connections between Orion's subjects across the cosmos, Earth, life, history, science, and technology.",
};

export default function KnowledgeGraphPage(){
  return <><header className="site-header"><a href="/" className="brand" aria-label="Orion home"><span className="brand-mark" aria-hidden="true">✳</span><span>orion<span className="brand-period">.</span></span></a><nav className="main-nav" aria-label="Main navigation"><a href="/#explore">Explore</a><a href="/#collections">Collections</a><a href="/timeline">Timeline</a><a href="/knowledge-graph" aria-current="page">Knowledge Graph</a></nav><a href="/solar-system/3d" className="header-cta">Try the 3D explorer <span aria-hidden="true">↗</span></a><MobileMenu/></header><KnowledgeGraph/></>;
}

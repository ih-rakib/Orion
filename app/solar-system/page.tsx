import type { Metadata } from "next";
import Link from "next/link";
import { SolarSystemExplorer } from "@/components/solar-system-explorer";

export const metadata: Metadata = {
  title: "Explore the Solar System",
  description: "Select the Sun, planets, Pluto or Earth's Moon to explore our planetary neighbourhood through a schematic interactive guide.",
};

export default function SolarSystemPage() {
  return <main className="solar-system-page" id="main-content">
    <header className="subject-header">
      <Link href="/" className="brand" aria-label="Orion home"><span className="brand-mark" aria-hidden="true">✳</span><span>orion<span className="brand-period">.</span></span></Link>
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Solar System</span></nav>
      <Link href="/#explore" className="header-cta">Explore subjects <span aria-hidden="true">↗</span></Link>
    </header>
    <section className="solar-system-hero">
      <Link href="/" className="back-link">← Back to Orion</Link>
      <p className="eyebrow">OUR COSMIC NEIGHBOURHOOD</p>
      <h1>One star.<br/><span>Many worlds.</span></h1>
      <p>Choose an object to begin exploring the Sun, eight planets, a dwarf planet, and the Moon. Each selection reveals a short guide and a trusted starting point for further reading.</p>
      <div className="solar-system-stats"><div><strong>1</strong><span>star</span></div><div><strong>8</strong><span>planets</span></div><div><strong>∞</strong><span>questions</span></div></div>
    </section>
    <section className="solar-system-content">
      <div className="solar-content-heading"><p className="eyebrow">CHOOSE YOUR DESTINATION</p><h2>Every world has a story.</h2><p>The Solar System formed about 4.6 billion years ago. It includes the Sun and everything bound to it by gravity. <a href="https://science.nasa.gov/solar-system/solar-system-facts/" target="_blank" rel="noopener noreferrer">NASA’s Solar System overview ↗</a></p></div>
      <SolarSystemExplorer />
      <p className="solar-disclaimer">This is an educational schematic, not a real-time orbital simulation. Object sizes, positions and distances are not shown to scale. Content links to NASA resources for further reading.</p>
    </section>
    <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">✳</span><span>orion<span className="brand-period">.</span></span></Link><p>A growing atlas of everything we discover.</p><Link href="/timeline" className="footer-status">TRAVEL THROUGH DEEP TIME ↑</Link><span className="footer-copy">© {new Date().getFullYear()} ORION</span></footer>
  </main>;
}

import type { Metadata } from "next";
import Link from "next/link";
import {MobileMenu} from "@/components/mobile-menu";
import { SolarSystem3D } from "@/components/solar-system-3d";

export const metadata: Metadata = {
  title: "3D Solar System Explorer",
  description: "Explore an interactive 3D model of the Sun and planets. Rotate the scene, zoom in, and select worlds to learn about them.",
};

export default function SolarSystem3DPage() {
  return <main className="solar-3d-page" id="main-content">
    <header className="subject-header">
      <Link href="/" className="brand" aria-label="Orion home"><span className="brand-mark" aria-hidden="true">✳</span><span>orion<span className="brand-period">.</span></span></Link>
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/solar-system">Solar System</Link><span>/</span><span>3D Explorer</span></nav>
      <Link href="/solar-system" className="header-cta">2D explorer <span aria-hidden="true">↗</span></Link>
      <MobileMenu/>
    </header>
    <section className="solar-3d-hero">
      <Link href="/solar-system" className="back-link">← Back to Solar System</Link>
      <p className="eyebrow">A NEW WAY TO EXPLORE</p>
      <h1>Step into<br/><span>our Solar System.</span></h1>
      <p>Rotate the view, zoom through space, and select a world to learn what makes it remarkable. Your exploration starts here.</p>
    </section>
    <section className="solar-3d-content"><SolarSystem3D /></section>
    <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">✳</span><span>orion<span className="brand-period">.</span></span></Link><p>A growing atlas of everything we discover.</p><Link href="/timeline" className="footer-status">TRAVEL THROUGH DEEP TIME ↑</Link><span className="footer-copy">© {new Date().getFullYear()} ORION</span></footer>
  </main>;
}

"use client";
import {useState} from "react";
import Link from "next/link";
export function MobileMenu(){
 const [open,setOpen]=useState(false);
 const close=()=>setOpen(false);
 return <div className="mobile-menu">
  <button type="button" className="mobile-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(v=>!v)}>{open?"Close":"Menu"} <span aria-hidden="true">{open?"×":"☰"}</span></button>
  {open&&<nav id="mobile-navigation" className="mobile-menu-panel" aria-label="Mobile navigation">
   <a href="/#explore" onClick={close}>Explore & Search</a><a href="/#collections" onClick={close}>Collections</a><Link href="/timeline" onClick={close}>Timeline</Link><Link href="/solar-system" onClick={close}>Solar System</Link><Link href="/solar-system/3d" onClick={close}>3D Explorer</Link><a href="/#about" onClick={close}>Our vision</a><a href="/#creator" onClick={close}>Creator</a>
  </nav>}
 </div>
}

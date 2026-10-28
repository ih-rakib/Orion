"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";

export function MobileMenu(){
  const [open,setOpen]=useState(false);
  const rootRef=useRef<HTMLDivElement>(null);
  const close=()=>setOpen(false);

  useEffect(()=>{
    if(!open)return;
    const onPointerDown=(event:PointerEvent)=>{
      if(event.target instanceof Node&&!rootRef.current?.contains(event.target))close();
    };
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==="Escape")close();
    };
    document.addEventListener("pointerdown",onPointerDown);
    document.addEventListener("keydown",onKeyDown);
    return()=>{
      document.removeEventListener("pointerdown",onPointerDown);
      document.removeEventListener("keydown",onKeyDown);
    };
  },[open]);

  return <div className="mobile-menu" ref={rootRef}>
    <button type="button" className="mobile-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?"Close navigation":"Open navigation"} title={open?"Close navigation":"Open navigation"} onClick={()=>setOpen(value=>!value)}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{open?<path d="m6 6 12 12M18 6 6 18"/>:<path d="M3 6h18M3 12h18M3 18h18"/>}</svg>
    </button>
    {open&&<nav id="mobile-navigation" className="mobile-menu-panel" aria-label="Mobile navigation">
      <a href="/#explore" onClick={close}>Explore & Search</a>
      <a href="/#collections" onClick={close}>Collections</a>
      <Link href="/timeline" onClick={close}>Timeline</Link>
      <Link href="/solar-system" onClick={close}>Solar System</Link>
      <a href="/#about" onClick={close}>Our vision</a>
      <a href="/#creator" onClick={close}>Creator</a>
    </nav>}
  </div>
}

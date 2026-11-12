"use client";
import {useEffect,useRef,useState} from "react";
import {loadVisited} from "@/lib/visited";

// Shows "N of M stops visited" for one learning-path card and marks the
// visited steps inside that card. Renders nothing until mounted, so the
// server-rendered card never mismatches what the browser shows.
export function PathCardProgress({slugs}:{slugs:string[]}){
  const [visitedCount,setVisitedCount]=useState<number|null>(null);
  const rootRef=useRef<HTMLParagraphElement>(null);
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      const visited=new Set(loadVisited(window.localStorage));
      setVisitedCount(slugs.filter(slug=>visited.has(slug)).length);
      const card=rootRef.current?.closest(".learning-path-card");
      card?.querySelectorAll<HTMLElement>("[data-step-slug]").forEach(el=>{
        if(visited.has(el.dataset.stepSlug??""))el.classList.add("step-visited");
      });
    });
    return ()=>cancelAnimationFrame(frame);
  },[slugs]);
  if(visitedCount===null)return <p className="learning-path-progress" ref={rootRef} aria-hidden="true">&nbsp;</p>;
  if(visitedCount===0)return <p className="learning-path-progress" ref={rootRef}>Not started yet</p>;
  if(visitedCount>=slugs.length)return <p className="learning-path-progress" ref={rootRef}>Journey complete ✓</p>;
  return <p className="learning-path-progress" ref={rootRef}>{visitedCount} of {slugs.length} stops visited</p>;
}

"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {dismissWelcome,isWelcomeDismissed} from "@/lib/visited";

export function FirstVisitWelcome({subjectCount,categoryCount}:{subjectCount:number;categoryCount:number}){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>setVisible(!isWelcomeDismissed(window.localStorage)));
    return ()=>cancelAnimationFrame(frame);
  },[]);
  if(!visible)return null;
  const dismiss=()=>{dismissWelcome(window.localStorage);setVisible(false);};
  return <section className="first-visit" aria-label="New here? Start exploring">
    <div className="first-visit-inner">
      <div className="first-visit-heading">
        <p className="eyebrow">FIRST TIME HERE?</p>
        <h2>Three ways in. No wrong one.</h2>
        <p>Orion is a growing atlas, not a textbook. Pick a way to begin — every page leads somewhere next.</p>
      </div>
      <div className="first-visit-ways">
        <Link href="/learning-paths#start-here" className="first-visit-way"><span className="first-visit-way-index">1</span><span><strong>Follow the story of everything</strong><small>Six guided stops, from the universe to the Moon landing.</small></span><span aria-hidden="true">→</span></Link>
        <a href="#explore" className="first-visit-way"><span className="first-visit-way-index">2</span><span><strong>Browse the library</strong><small>{subjectCount} subjects across {categoryCount} collections — search or wander.</small></span><span aria-hidden="true">→</span></a>
        <Link href="/timeline" className="first-visit-way"><span className="first-visit-way-index">3</span><span><strong>Travel through time</strong><small>From the first moment physics can describe to today and beyond.</small></span><span aria-hidden="true">→</span></Link>
      </div>
      <button type="button" className="first-visit-dismiss" onClick={dismiss}>Got it — don&apos;t show this again</button>
    </div>
  </section>;
}

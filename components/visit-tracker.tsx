"use client";
import {useEffect} from "react";
import {recordVisit} from "@/lib/visited";

// Records that this subject was visited, so learning-path pages can show
// progress. Renders nothing; state stays in the visitor's own browser.
export function VisitTracker({slug}:{slug:string}){
  useEffect(()=>{recordVisit(window.localStorage,slug);},[slug]);
  return null;
}

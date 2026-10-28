"use client";
import {useEffect,useState} from "react";
export function BackToTop(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const update=()=>setVisible(window.scrollY>450);update();window.addEventListener("scroll",update,{passive:true});return()=>window.removeEventListener("scroll",update)},[]);
 if(!visible)return null;
 return <button type="button" className="back-to-top" aria-label="Back to top" title="Back to top" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}><span aria-hidden="true">↑</span><span>Top</span></button>
}

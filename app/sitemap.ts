import type {MetadataRoute} from "next";
import {subjects} from "@/lib/content";
export default function sitemap():MetadataRoute.Sitemap{const baseUrl=process.env.NEXT_PUBLIC_SITE_URL||"https://orion.example";return[{url:baseUrl,changeFrequency:"weekly",priority:1},...subjects.map(s=>({url:`${baseUrl}/subjects/${s.slug}`,changeFrequency:"monthly" as const,priority:0.7}))]}

import type {MetadataRoute} from "next";
import {categories,categorySlug,subjects} from "@/lib/content";
export default function sitemap():MetadataRoute.Sitemap{const baseUrl=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";return[{url:baseUrl,changeFrequency:"weekly",priority:1},...categories.map(c=>({url:`${baseUrl}/categories/${categorySlug(c.name)}`,changeFrequency:"monthly" as const,priority:0.8})),...subjects.map(s=>({url:`${baseUrl}/subjects/${s.slug}`,changeFrequency:"monthly" as const,priority:0.7}))]}

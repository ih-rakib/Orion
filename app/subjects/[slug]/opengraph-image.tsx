import { ImageResponse } from "next/og";
import { getSubject, subjects } from "@/lib/content";
import { OgCard, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Orion subject guide";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return subjects.map((s) => ({ slug: s.slug }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSubject(slug);
  return new ImageResponse(
    (
      <OgCard
        eyebrow={s ? `${s.category} · Orion Field Guide` : "Orion Field Guide"}
        title={s ? s.title : "Orion"}
        summary={s ? s.summary : "A growing atlas of everything we discover."}
        accent={s?.accent}
      />
    ),
    { ...ogSize },
  );
}

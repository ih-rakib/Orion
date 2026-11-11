import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Orion — A Universe of Discovery";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Orion — A Universe of Discovery"
        title="Explore everything"
        summary="An ever-growing atlas of the cosmos, Earth, life, deep time and the discoveries that connect everything."
      />
    ),
    { ...ogSize },
  );
}

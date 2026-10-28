"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { solarSystemObjects } from "@/lib/solar-system";
import { moons, landmarks } from "@/lib/solar-system-3d-data";

const bodies = [
  { slug: "sun", label: "Sun", radius: 1.05, orbit: 0, period: 0, color: "#ffcb72", tilt: 0.1 },
  { slug: "mercury", label: "Mercury", radius: 0.15, orbit: 2.0, period: 4.2, color: "#a8a8b5", tilt: 0.03 },
  { slug: "venus", label: "Venus", radius: 0.23, orbit: 2.8, period: 6.8, color: "#e3b477", tilt: 0.06 },
  { slug: "earth", label: "Earth", radius: 0.25, orbit: 3.8, period: 9.2, color: "#5da9ef", tilt: 0.41 },
  { slug: "mars", label: "Mars", radius: 0.19, orbit: 4.8, period: 13.5, color: "#dc806a", tilt: 0.44 },
  { slug: "jupiter", label: "Jupiter", radius: 0.61, orbit: 6.25, period: 23, color: "#d6ae8d", tilt: 0.05 },
  { slug: "saturn", label: "Saturn", radius: 0.52, orbit: 7.65, period: 32, color: "#ddce9d", tilt: 0.47 },
  { slug: "uranus", label: "Uranus", radius: 0.36, orbit: 9.0, period: 42, color: "#89d6d9", tilt: 1.7 },
  { slug: "neptune", label: "Neptune", radius: 0.35, orbit: 10.2, period: 53, color: "#577fe6", tilt: 0.5 },
  { slug: "pluto", label: "Pluto", radius: 0.1, orbit: 11.15, period: 68, color: "#c5a29a", tilt: 0.3 },
] as const;

type BodySlug = typeof bodies[number]["slug"];

type MoonSlug = typeof moons[number]["slug"];
type SelectableSlug = BodySlug | MoonSlug;

const sourcedTextureFiles: Partial<Record<BodySlug, string>> = {
  mercury: "2k_mercury.jpg",
  venus: "2k_venus_surface.jpg",
  earth: "2k_earth_daymap.jpg",
  mars: "2k_mars.jpg",
  jupiter: "2k_jupiter.jpg",
  saturn: "2k_saturn.jpg",
  uranus: "2k_uranus.jpg",
  neptune: "2k_neptune.jpg",
  pluto: "2k_pluto.jpg",
};
const sourcedTextureBaseUrl = "https://www.solarsystemscope.com/textures/download/";

function createPlanetTexture(slug: string, baseColor: string) {
  const width = 256;
  const height = 128;
  const data = new Uint8Array(width * height * 4);
  const base = new THREE.Color(baseColor);
  const hash = (x: number, y: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + slug.length * 74.7) * 43758.5453;
    return n - Math.floor(n);
  };
  for (let y = 0; y < height; y++) {
    const lat = (y / height - 0.5) * Math.PI;
    for (let x = 0; x < width; x++) {
      const lon = (x / width - 0.5) * Math.PI * 2;
      const i = (y * width + x) * 4;
      const broad = Math.sin(lon * 2.1 + Math.sin(lat * 3.2)) * Math.cos(lat * 2.8)
        + Math.sin(lon * 4.4 - lat * 3.1) * 0.43
        + Math.cos(lon * 7.1 + lat * 5.2) * 0.2;
      const detail = (hash(x >> 1, y >> 1) - 0.5) * 0.22 + (hash(x, y) - 0.5) * 0.12;
      let r = base.r, g = base.g, b = base.b;
      if (slug === "earth") {
        const land = broad + detail > 0.23;
        if (Math.abs(lat) > 1.22) { r = 0.78; g = 0.84; b = 0.88; }
        else if (land) {
          const green = Math.sin(lat * 8 + lon * 2) + detail;
          r = green > 0.75 ? 0.65 : 0.32 + detail;
          g = green > 0.75 ? 0.58 : 0.39 + detail;
          b = green > 0.75 ? 0.31 : 0.19 + detail;
        } else {
          const ocean = 0.78 + detail;
          r = 0.025 * ocean; g = 0.16 * ocean; b = 0.48 * ocean;
        }
      } else if (slug === "mars") {
        const crater = Math.sin(lon * 18 + Math.sin(lat * 11)) * Math.cos(lat * 22) > 0.82;
        const shade = 0.75 + broad * 0.12 + detail;
        r = crater ? 0.36 * shade : 0.72 * shade;
        g = crater ? 0.20 * shade : 0.34 * shade;
        b = crater ? 0.14 * shade : 0.24 * shade;
      } else if (["jupiter", "saturn", "uranus", "neptune"].includes(slug)) {
        const bands = 0.72 + 0.25 * Math.sin(lat * (slug === "jupiter" ? 29 : 19) + Math.sin(lon * 2) * 0.28) + detail;
        r *= bands; g *= bands; b *= bands;
        if (slug === "jupiter" && Math.sin(lon * 3.1 + lat * 5) > 0.88 && lat < 0.1 && lat > -0.55) { r *= 0.72; g *= 0.57; b *= 0.48; }
      } else {
        const shade = 0.82 + broad * 0.12 + detail;
        r *= shade; g *= shade; b *= shade;
      }
      data[i] = Math.max(0, Math.min(255, Math.round(r * 255)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(g * 255)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(b * 255)));
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createCloudTexture() {
  const width = 256, height = 128;
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const pattern = Math.sin(x * 0.11 + Math.sin(y * 0.15) * 2) * Math.cos(y * 0.22)
      + Math.sin(x * 0.045 - y * 0.1) * 0.7 + Math.sin(x * 0.23 + y * 0.17) * 0.24;
    const alpha = pattern > 0.55 ? Math.min(225, 70 + (pattern - 0.55) * 190) : 0;
    data[i] = 236; data[i + 1] = 245; data[i + 2] = 255; data[i + 3] = alpha;
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function Planet({ body, selected, onSelect, paused, selectedLandmark, onSelectLandmark }: { body: typeof bodies[number]; selected: boolean; onSelect: (slug: SelectableSlug) => void; paused: boolean; selectedLandmark: string | null; onSelectLandmark: (slug: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const surfaceTexture = useMemo(() => createPlanetTexture(body.slug, body.color), [body.slug, body.color]);
  const cloudTexture = useMemo(() => createCloudTexture(), []);
  const [sourcedTexture, setSourcedTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const filename = sourcedTextureFiles[body.slug];
    if (!filename) {
      setSourcedTexture(null);
      return;
    }
    let active = true;
    setSourcedTexture(null);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      sourcedTextureBaseUrl + filename,
      (texture) => {
        if (!active) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        setSourcedTexture(texture);
      },
      undefined,
      () => {
        // Keep the generated procedural map as a resilient offline/network fallback.
        if (active) setSourcedTexture(null);
      },
    );
    return () => {
      active = false;
    };
  }, [body.slug]);
  useFrame(({ clock }) => {
    if (!group.current || paused || body.period === 0) return;
    const angle = clock.getElapsedTime() / body.period;
    group.current.position.x = Math.cos(angle) * body.orbit;
    group.current.position.z = Math.sin(angle) * body.orbit;
    if (mesh.current) mesh.current.rotation.y += 0.006;
  });

  return <group ref={group} position={[body.orbit, 0, 0]}>
    <mesh
      ref={mesh}
      rotation={[body.tilt, 0, 0]}
      onClick={(event) => { event.stopPropagation(); onSelect(body.slug); }}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      scale={selected ? 1.2 : hovered ? 1.12 : 1}
    >
      <sphereGeometry args={[body.radius, 32, 32]} />
      <meshStandardMaterial map={body.slug === "sun" ? undefined : sourcedTexture ?? surfaceTexture} color={body.slug === "sun" ? body.color : "#ffffff"} roughness={body.slug === "sun" ? 0.8 : 0.94} emissive={body.slug === "sun" ? "#ff9c36" : "#000000"} emissiveIntensity={body.slug === "sun" ? 1.5 : 0} />
    </mesh>
    {body.slug === "saturn" && <mesh rotation={[0.25, 0, -0.22]}><ringGeometry args={[body.radius * 1.35, body.radius * 2.05, 64]} /><meshStandardMaterial color="#ddc9a0" side={THREE.DoubleSide} transparent opacity={0.75} /></mesh>}
    {body.slug === "earth" && <mesh rotation={[0, 0.08, 0]}><sphereGeometry args={[body.radius * 1.012, 40, 40]} /><meshStandardMaterial map={cloudTexture} transparent opacity={0.48} depthWrite={false} side={THREE.FrontSide} /></mesh>}
    {["earth", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"].includes(body.slug) && <mesh><sphereGeometry args={[body.radius * (body.slug === "venus" ? 1.12 : 1.075), 32, 32]} /><meshBasicMaterial color={body.slug === "mars" ? "#e58d70" : body.slug === "venus" ? "#f0bc79" : body.slug === "earth" ? "#4b9cff" : body.slug === "neptune" ? "#5689ff" : "#a6d7e8"} side={THREE.BackSide} transparent opacity={body.slug === "earth" ? 0.17 : body.slug === "venus" ? 0.2 : 0.11} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>}

    {landmarks.filter((landmark) => landmark.parent === body.slug).map((landmark) => {
      const latitude = landmark.lat * Math.PI / 180;
      const longitude = landmark.lon * Math.PI / 180;
      const markerPosition: [number, number, number] = [
        Math.cos(latitude) * Math.cos(longitude) * body.radius * 1.025,
        Math.sin(latitude) * body.radius * 1.025,
        Math.cos(latitude) * Math.sin(longitude) * body.radius * 1.025,
      ];
      const isActive = selectedLandmark === landmark.slug;
      return <group key={landmark.slug} position={markerPosition}>
        <mesh onClick={(event) => { event.stopPropagation(); onSelectLandmark(landmark.slug); }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "auto"; }} scale={isActive ? 1.8 : 1}>
          <sphereGeometry args={[body.radius * 0.12, 14, 14]} />
          <meshBasicMaterial color={landmark.color} />
        </mesh>
        {isActive && <Html position={[0, body.radius * 0.13, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}><span className="solar-3d-label">{landmark.label}</span></Html>}
      </group>;
    })}
    {(selected || hovered) && <Html position={[0, body.radius + 0.3, 0]} center distanceFactor={12} style={{ pointerEvents: "none" }}><span className="solar-3d-label">{body.label}</span></Html>}
    {selected && <mesh><sphereGeometry args={[body.radius * 1.42, 24, 24]} /><meshBasicMaterial color="#d8d0ff" wireframe transparent opacity={0.2} /></mesh>}
  </group>;
}

function Moon({ moon, selected, onSelect, paused }: { moon: typeof moons[number]; selected: boolean; onSelect: (slug: SelectableSlug) => void; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const parent = bodies.find((body) => body.slug === moon.parent)!;
  useFrame(({ clock }) => {
    if (!group.current || paused) return;
    const time = clock.getElapsedTime();
    const parentAngle = parent.period === 0 ? 0 : time / parent.period;
    const moonAngle = time / moon.period;
    group.current.position.set(Math.cos(parentAngle) * parent.orbit + Math.cos(moonAngle) * moon.orbit, Math.sin(moonAngle * 0.7) * moon.orbit * 0.12, Math.sin(parentAngle) * parent.orbit + Math.sin(moonAngle) * moon.orbit);
  });
  return <group ref={group} position={[parent.orbit + moon.orbit, 0, 0]}>
    <mesh onClick={(event) => { event.stopPropagation(); onSelect(moon.slug); }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "auto"; }} scale={selected ? 1.45 : 1}>
      <sphereGeometry args={[moon.radius, 20, 20]} /><meshStandardMaterial color={moon.color} roughness={0.95} emissive={selected ? moon.color : "#000000"} emissiveIntensity={selected ? 0.18 : 0} />
    </mesh>
    {selected && <Html position={[0, moon.radius + 0.18, 0]} center distanceFactor={12} style={{ pointerEvents: "none" }}><span className="solar-3d-label">{moon.label}</span></Html>}
  </group>;
}

function Scene({ selectedSlug, onSelect, paused, selectedLandmark, onSelectLandmark }: { selectedSlug: SelectableSlug; onSelect: (slug: SelectableSlug) => void; paused: boolean; selectedLandmark: string | null; onSelectLandmark: (slug: string) => void }) {
  return <>
    <color attach="background" args={["#070a15"]} />
    <fog attach="fog" args={["#070a15", 18, 45]} />
    <ambientLight intensity={0.5} />
    <pointLight position={[0, 0, 0]} intensity={180} distance={35} decay={2} color="#ffe1b1" />
    <Stars radius={90} depth={55} count={1800} factor={2.3} saturation={0} fade speed={paused ? 0 : 0.15} />
    {bodies.filter((body) => body.orbit > 0).map((body) => <group key={"orbit-" + body.slug} rotation={[0, 0, 0]}><lineLoop><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(Array.from({ length: 181 }, (_, i) => { const a = i / 180 * Math.PI * 2; return [Math.cos(a) * body.orbit, 0, Math.sin(a) * body.orbit]; }).flat()), 3]} /></bufferGeometry><lineBasicMaterial color={body.slug === selectedSlug ? "#a99bff" : "#53607d"} transparent opacity={body.slug === selectedSlug ? 0.65 : 0.23} /></lineLoop></group>)}
    {bodies.map((body) => <Planet key={body.slug} body={body} selected={selectedSlug === body.slug} onSelect={onSelect} paused={paused} selectedLandmark={selectedLandmark} onSelectLandmark={onSelectLandmark} />)}
    {moons.map((moon) => <Moon key={moon.slug} moon={moon} selected={selectedSlug === moon.slug} onSelect={onSelect} paused={paused} />)}
    <OrbitControls makeDefault enableDamping dampingFactor={0.07} minDistance={4} maxDistance={30} maxPolarAngle={Math.PI * 0.92} />
  </>;
}

export function SolarSystem3D() {
  const [selectedSlug, setSelectedSlug] = useState<SelectableSlug>("earth");
  const [paused, setPaused] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedObject = params.get("object");
    const requestedLandmark = params.get("landmark");
    if (requestedLandmark) {
      const landmark = landmarks.find((item) => item.slug === requestedLandmark);
      if (landmark) {
        setSelectedSlug(landmark.parent);
        setSelectedLandmark(landmark.slug);
        return;
      }
    }
    if (requestedObject && (bodies.some((body) => body.slug === requestedObject) || moons.some((moon) => moon.slug === requestedObject))) {
      setSelectedSlug(requestedObject as SelectableSlug);
    }
  }, []);
  const selectedBody = bodies.find((body) => body.slug === selectedSlug) ?? moons.find((moon) => moon.slug === selectedSlug) ?? bodies[3];
  const object = solarSystemObjects.find((item) => item.slug === selectedSlug);
  const selectedMoon = moons.find((moon) => moon.slug === selectedSlug);
  const activeLandmark = landmarks.find((landmark) => landmark.slug === selectedLandmark);
  return <div className="solar-3d-app">
    <div className="solar-3d-toolbar"><div><p className="eyebrow">ORION · INTERACTIVE MODEL</p><h2>Navigate the neighbourhood.</h2></div><div className="solar-3d-controls"><button type="button" onClick={() => setPaused((value) => !value)}>{paused ? "▶ Resume" : "Ⅱ Pause"}</button><button type="button" onClick={() => { setSelectedSlug("earth"); setSelectedLandmark(null); }}>↺ Reset selection</button></div></div>
    <div className="solar-3d-stage">
      <Canvas fallback={<div className="solar-3d-fallback" role="status">3D graphics are not available in this browser. You can still choose a world from the list below.</div>} camera={{ position: [0, 12, 17], fov: 46 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }} onCreated={({ gl }) => { gl.setClearColor("#070a15"); }}>
        <Scene selectedSlug={selectedSlug} onSelect={(slug) => { setSelectedSlug(slug); setSelectedLandmark(null); }} paused={paused} selectedLandmark={selectedLandmark} onSelectLandmark={(slug) => { const landmark = landmarks.find((item) => item.slug === slug); if (landmark) setSelectedSlug(landmark.parent); setSelectedLandmark(slug); }} />
      </Canvas>
      <div className="solar-3d-hint"><span>DRAG</span> rotate <i /> <span>SCROLL</span> zoom <i /> <span>TAP</span> select</div>
      <div className="solar-3d-object-count">10 WORLDS · 11 MOONS · {paused ? "MOTION PAUSED" : "ORBITAL MOTION ON"}</div>
    </div>
    <div className="solar-3d-lower">
      <div className="solar-3d-selector"><p className="eyebrow">CHOOSE A WORLD</p><div className="solar-3d-buttons">{bodies.map((body) => <button type="button" key={body.slug} className={body.slug === selectedSlug ? "active" : ""} aria-pressed={body.slug === selectedSlug} onClick={() => { setSelectedSlug(body.slug); setSelectedLandmark(null); }}><span style={{ "--object-color": body.color } as CSSProperties} className="solar-3d-dot" />{body.label}</button>)}</div><p className="eyebrow solar-3d-moon-heading">MOONS · SELECT TO EXPLORE</p><div className="solar-3d-buttons">{moons.map((moon) => <button type="button" key={moon.slug} className={moon.slug === selectedSlug ? "active" : ""} aria-pressed={moon.slug === selectedSlug} onClick={() => { setSelectedSlug(moon.slug); setSelectedLandmark(null); }}><span style={{ "--object-color": moon.color } as CSSProperties} className="solar-3d-dot" />{moon.label}</button>)}</div><p className="eyebrow solar-3d-moon-heading">SURFACE LANDMARKS · EARTH & MARS</p><div className="solar-3d-buttons">{landmarks.map((landmark) => <button type="button" key={landmark.slug} className={landmark.slug === selectedLandmark ? "active" : ""} aria-pressed={landmark.slug === selectedLandmark} onClick={() => { setSelectedSlug(landmark.parent); setSelectedLandmark(landmark.slug); }}><span style={{ "--object-color": landmark.color } as CSSProperties} className="solar-3d-dot" />{landmark.label}<small> · {landmark.parent === "earth" ? "Earth" : "Mars"}</small></button>)}</div></div>
      <aside className="solar-3d-info"><p className="eyebrow">{activeLandmark ? "SURFACE LANDMARK" : object?.kind.toUpperCase() ?? (selectedMoon ? "NATURAL SATELLITE" : "SOLAR SYSTEM OBJECT")}</p><h3>{activeLandmark?.label ?? selectedBody.label}</h3><p>{activeLandmark?.summary ?? object?.summary ?? selectedMoon?.summary ?? "The star at the heart of our planetary system."}</p><p className="solar-3d-fact">{activeLandmark?.fact ?? object?.fact ?? selectedMoon?.fact ?? "The Sun contains more than 99% of the Solar System’s mass."}</p><div className="solar-3d-links">{!activeLandmark && object?.orionPath && <Link href={object.orionPath}>Read Orion guide ↗</Link>}<a href={activeLandmark?.sourceUrl ?? object?.sourceUrl ?? selectedMoon?.sourceUrl ?? "https://science.nasa.gov/sun/"} target="_blank" rel="noopener noreferrer">{activeLandmark ? "Explore scientific source ↗" : "NASA further reading ↗"}</a></div></aside>
    </div>
    <p className="solar-3d-disclaimer">Illustrative 3D model: planet sizes and orbital distances are compressed and not to scale. Motion is an educational visualization, not a precise ephemeris or prediction tool. Planet surface maps load from <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer">Solar System Scope</a> under CC BY 4.0; generated procedural maps remain as a fallback if a texture cannot load. The maps are educational visualizations, not validated datasets for scientific analysis. Surface landmark pins are illustrative locations, not high-resolution geographic maps.</p>
  </div>;
}

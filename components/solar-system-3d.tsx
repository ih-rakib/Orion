"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { solarSystemObjects } from "@/lib/solar-system";

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

function Planet({ body, selected, onSelect, paused }: { body: typeof bodies[number]; selected: boolean; onSelect: (slug: BodySlug) => void; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
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
      <meshStandardMaterial color={body.color} roughness={body.slug === "sun" ? 0.8 : 0.92} emissive={body.slug === "sun" ? "#ff9c36" : body.color} emissiveIntensity={body.slug === "sun" ? 1.5 : selected ? 0.14 : 0.02} />
    </mesh>
    {body.slug === "saturn" && <mesh rotation={[0.25, 0, -0.22]}><ringGeometry args={[body.radius * 1.35, body.radius * 2.05, 64]} /><meshStandardMaterial color="#ddc9a0" side={THREE.DoubleSide} transparent opacity={0.75} /></mesh>}
    {body.slug === "earth" && <group position={[body.radius + 0.11, 0.02, 0]}><mesh><sphereGeometry args={[0.055, 16, 16]} /><meshStandardMaterial color="#c9cedb" /></mesh></group>}
    {(selected || hovered) && <Html position={[0, body.radius + 0.3, 0]} center distanceFactor={12} style={{ pointerEvents: "none" }}><span className="solar-3d-label">{body.label}</span></Html>}
    {selected && <mesh><sphereGeometry args={[body.radius * 1.42, 24, 24]} /><meshBasicMaterial color="#d8d0ff" wireframe transparent opacity={0.2} /></mesh>}
  </group>;
}

function Scene({ selectedSlug, onSelect, paused }: { selectedSlug: BodySlug; onSelect: (slug: BodySlug) => void; paused: boolean }) {
  return <>
    <color attach="background" args={["#070a15"]} />
    <fog attach="fog" args={["#070a15", 18, 45]} />
    <ambientLight intensity={0.5} />
    <pointLight position={[0, 0, 0]} intensity={180} distance={35} decay={2} color="#ffe1b1" />
    <Stars radius={90} depth={55} count={1800} factor={2.3} saturation={0} fade speed={paused ? 0 : 0.15} />
    {bodies.filter((body) => body.orbit > 0).map((body) => <group key={"orbit-" + body.slug} rotation={[0, 0, 0]}><lineLoop><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(Array.from({ length: 181 }, (_, i) => { const a = i / 180 * Math.PI * 2; return [Math.cos(a) * body.orbit, 0, Math.sin(a) * body.orbit]; }).flat()), 3]} /></bufferGeometry><lineBasicMaterial color={body.slug === selectedSlug ? "#a99bff" : "#53607d"} transparent opacity={body.slug === selectedSlug ? 0.65 : 0.23} /></lineLoop></group>)}
    {bodies.map((body) => <Planet key={body.slug} body={body} selected={selectedSlug === body.slug} onSelect={onSelect} paused={paused} />)}
    <OrbitControls makeDefault enableDamping dampingFactor={0.07} minDistance={4} maxDistance={30} maxPolarAngle={Math.PI * 0.92} />
  </>;
}

export function SolarSystem3D() {
  const [selectedSlug, setSelectedSlug] = useState<BodySlug>("earth");
  const [paused, setPaused] = useState(false);
  const selectedBody = bodies.find((body) => body.slug === selectedSlug) ?? bodies[3];
  const object = solarSystemObjects.find((item) => item.slug === selectedSlug);
  return <div className="solar-3d-app">
    <div className="solar-3d-toolbar"><div><p className="eyebrow">ORION · INTERACTIVE MODEL</p><h2>Navigate the neighbourhood.</h2></div><div className="solar-3d-controls"><button type="button" onClick={() => setPaused((value) => !value)}>{paused ? "▶ Resume" : "Ⅱ Pause"}</button><button type="button" onClick={() => setSelectedSlug("earth")}>↺ Reset selection</button></div></div>
    <div className="solar-3d-stage">
      <Canvas camera={{ position: [0, 12, 17], fov: 46 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: false }} onCreated={({ gl }) => { gl.setClearColor("#070a15"); }}>
        <Scene selectedSlug={selectedSlug} onSelect={setSelectedSlug} paused={paused} />
      </Canvas>
      <div className="solar-3d-hint"><span>DRAG</span> rotate <i /> <span>SCROLL</span> zoom <i /> <span>TAP</span> select</div>
      <div className="solar-3d-object-count">10 OBJECTS · {paused ? "MOTION PAUSED" : "ORBITAL MOTION ON"}</div>
    </div>
    <div className="solar-3d-lower">
      <div className="solar-3d-selector"><p className="eyebrow">CHOOSE A WORLD</p><div className="solar-3d-buttons">{bodies.map((body) => <button type="button" key={body.slug} className={body.slug === selectedSlug ? "active" : ""} onClick={() => setSelectedSlug(body.slug)}><span style={{ "--object-color": body.color } as CSSProperties} className="solar-3d-dot" />{body.label}</button>)}</div></div>
      <aside className="solar-3d-info"><p className="eyebrow">{object?.kind.toUpperCase() ?? "SOLAR SYSTEM OBJECT"}</p><h3>{selectedBody.label}</h3><p>{object?.summary ?? "The star at the heart of our planetary system."}</p><p className="solar-3d-fact">{object?.fact ?? "The Sun contains more than 99% of the Solar System’s mass."}</p><div className="solar-3d-links">{object?.orionPath && <Link href={object.orionPath}>Read Orion guide ↗</Link>}<a href={object?.sourceUrl ?? "https://science.nasa.gov/sun/"} target="_blank" rel="noopener noreferrer">NASA further reading ↗</a></div></aside>
    </div>
    <p className="solar-3d-disclaimer">Illustrative 3D model: planet sizes and orbital distances are compressed and not to scale. Motion is an educational visualization, not a precise ephemeris or prediction tool. Earth’s Moon is shown near Earth for orientation and is not a separate selectable body in this view.</p>
  </div>;
}

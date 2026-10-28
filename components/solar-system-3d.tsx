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

type MoonSlug = typeof moons[number]["slug"];
type SelectableSlug = BodySlug | MoonSlug;

const moons = [
  { slug: "moon", label: "Earth’s Moon", parent: "earth", radius: 0.075, orbit: 0.48, period: 1.8, color: "#d4d8e2", summary: "Earth’s natural satellite, shaped by ancient impacts and volcanic plains.", fact: "The Moon is slowly moving away from Earth.", sourceUrl: "https://science.nasa.gov/moon/" },
  { slug: "phobos", label: "Phobos", parent: "mars", radius: 0.045, orbit: 0.31, period: 0.8, color: "#a69b91", summary: "Mars’s larger, innermost moon: small, irregular, and heavily cratered.", fact: "Phobos orbits Mars three times in roughly one Martian day.", sourceUrl: "https://science.nasa.gov/mars/moons/" },
  { slug: "deimos", label: "Deimos", parent: "mars", radius: 0.035, orbit: 0.43, period: 1.35, color: "#c2b5a4", summary: "Mars’s smaller, more distant moon, with a softly cratered surface.", fact: "Deimos takes about 30 hours to orbit Mars.", sourceUrl: "https://science.nasa.gov/mars/moons/" },
  { slug: "io", label: "Io", parent: "jupiter", radius: 0.065, orbit: 0.83, period: 1.2, color: "#e8d39a", summary: "A volcanic moon whose surface is continually reshaped by eruptions.", fact: "Io is the most volcanically active world known.", sourceUrl: "https://science.nasa.gov/jupiter/moons/" },
  { slug: "europa", label: "Europa", parent: "jupiter", radius: 0.06, orbit: 1.02, period: 1.65, color: "#c9c1b1", summary: "An icy moon that may hide a global ocean beneath its crust.", fact: "Europa is a major target in the search for potentially habitable environments.", sourceUrl: "https://science.nasa.gov/jupiter/moons/" },
  { slug: "ganymede", label: "Ganymede", parent: "jupiter", radius: 0.085, orbit: 1.23, period: 2.3, color: "#a99d8e", summary: "Jupiter’s largest moon and the largest moon in the Solar System.", fact: "Ganymede is larger than the planet Mercury.", sourceUrl: "https://science.nasa.gov/jupiter/moons/" },
  { slug: "callisto", label: "Callisto", parent: "jupiter", radius: 0.075, orbit: 1.45, period: 3.1, color: "#857d77", summary: "An ancient, heavily cratered world orbiting Jupiter.", fact: "Callisto has one of the most heavily cratered surfaces in the Solar System.", sourceUrl: "https://science.nasa.gov/jupiter/moons/" },
  { slug: "titan", label: "Titan", parent: "saturn", radius: 0.08, orbit: 0.75, period: 2.2, color: "#d8ae72", summary: "Saturn’s haze-covered moon, with rivers and lakes of liquid hydrocarbons.", fact: "Titan has lakes and seas made primarily of methane and ethane.", sourceUrl: "https://science.nasa.gov/saturn/moons/titan/" },
  { slug: "enceladus", label: "Enceladus", parent: "saturn", radius: 0.05, orbit: 0.98, period: 3.0, color: "#e5e8ed", summary: "A bright icy moon that sprays water-rich plumes into space.", fact: "Its plume provides evidence of a subsurface ocean.", sourceUrl: "https://science.nasa.gov/saturn/moons/enceladus/" },
  { slug: "titania", label: "Titania", parent: "uranus", radius: 0.055, orbit: 0.58, period: 2.5, color: "#a8a4a0", summary: "The largest moon of Uranus, an icy world marked by large canyons.", fact: "Titania was discovered by William Herschel in 1787.", sourceUrl: "https://science.nasa.gov/uranus/moons/" },
  { slug: "triton", label: "Triton", parent: "neptune", radius: 0.065, orbit: 0.58, period: 2.7, color: "#d0bdb3", summary: "Neptune’s largest moon, moving in a retrograde orbit.", fact: "Triton may be a captured object from the Kuiper Belt.", sourceUrl: "https://science.nasa.gov/neptune/moons/" },
] as const;

const landmarks = [
  { slug: "himalayas", label: "Himalayas", parent: "earth", lat: 27.9, lon: 86.9, color: "#f4e7c2", summary: "A vast mountain system created by the continuing collision of the Indian and Eurasian tectonic plates.", fact: "Mount Everest is the highest mountain above sea level.", sourceUrl: "https://earthobservatory.nasa.gov/" },
  { slug: "amazon", label: "Amazon Basin", parent: "earth", lat: -3.4, lon: -60.0, color: "#55d6a2", summary: "A huge tropical river basin supporting one of Earth’s richest concentrations of biodiversity.", fact: "The Amazon River system carries more water than any other river system.", sourceUrl: "https://earthobservatory.nasa.gov/" },
  { slug: "grand-canyon", label: "Grand Canyon", parent: "earth", lat: 36.1, lon: -112.1, color: "#f4a261", summary: "A deep canyon exposing layers of rock that preserve a long geological record.", fact: "The Colorado River and erosion helped carve the canyon over millions of years.", sourceUrl: "https://www.nps.gov/grca/" },
  { slug: "olympus-mons", label: "Olympus Mons", parent: "mars", lat: 18.65, lon: -133.8, color: "#ffd166", summary: "A gigantic shield volcano and one of the most prominent landmarks on Mars.", fact: "Olympus Mons rises roughly 22 km above the Martian reference level.", sourceUrl: "https://science.nasa.gov/mars/" },
  { slug: "valles-marineris", label: "Valles Marineris", parent: "mars", lat: -13.9, lon: -59.2, color: "#ff8c69", summary: "An immense canyon system stretching across a large part of Mars’s equatorial region.", fact: "The canyon system extends for thousands of kilometres.", sourceUrl: "https://science.nasa.gov/mars/" },
  { slug: "gale-crater", label: "Gale Crater", parent: "mars", lat: -5.4, lon: 137.8, color: "#f2c078", summary: "A large impact crater explored by NASA’s Curiosity rover to investigate ancient Martian environments.", fact: "Curiosity landed inside Gale Crater in August 2012.", sourceUrl: "https://science.nasa.gov/mission/msl-curiosity/" },
] as const;

function Planet({ body, selected, onSelect, paused, selectedLandmark, onSelectLandmark }: { body: typeof bodies[number]; selected: boolean; onSelect: (slug: SelectableSlug) => void; paused: boolean; selectedLandmark: string | null; onSelectLandmark: (slug: string) => void }) {
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
          <sphereGeometry args={[body.radius * 0.075, 12, 12]} />
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
      <div className="solar-3d-selector"><p className="eyebrow">CHOOSE A WORLD</p><div className="solar-3d-buttons">{bodies.map((body) => <button type="button" key={body.slug} className={body.slug === selectedSlug ? "active" : ""} aria-pressed={body.slug === selectedSlug} onClick={() => setSelectedSlug(body.slug)}><span style={{ "--object-color": body.color } as CSSProperties} className="solar-3d-dot" />{body.label}</button>)}</div><p className="eyebrow solar-3d-moon-heading">MOONS · SELECT TO EXPLORE</p><div className="solar-3d-buttons">{moons.map((moon) => <button type="button" key={moon.slug} className={moon.slug === selectedSlug ? "active" : ""} aria-pressed={moon.slug === selectedSlug} onClick={() => setSelectedSlug(moon.slug)}><span style={{ "--object-color": moon.color } as CSSProperties} className="solar-3d-dot" />{moon.label}</button>)}</div><p className="eyebrow solar-3d-moon-heading">SURFACE LANDMARKS · EARTH & MARS</p><div className="solar-3d-buttons">{landmarks.map((landmark) => <button type="button" key={landmark.slug} className={landmark.slug === selectedLandmark ? "active" : ""} aria-pressed={landmark.slug === selectedLandmark} onClick={() => { setSelectedSlug(landmark.parent); setSelectedLandmark(landmark.slug); }}><span style={{ "--object-color": landmark.color } as CSSProperties} className="solar-3d-dot" />{landmark.label}<small> · {landmark.parent === "earth" ? "Earth" : "Mars"}</small></button>)}</div></div>
      <aside className="solar-3d-info"><p className="eyebrow">{activeLandmark ? "SURFACE LANDMARK" : object?.kind.toUpperCase() ?? (selectedMoon ? "NATURAL SATELLITE" : "SOLAR SYSTEM OBJECT")}</p><h3>{activeLandmark?.label ?? selectedBody.label}</h3><p>{activeLandmark?.summary ?? object?.summary ?? selectedMoon?.summary ?? "The star at the heart of our planetary system."}</p><p className="solar-3d-fact">{activeLandmark?.fact ?? object?.fact ?? selectedMoon?.fact ?? "The Sun contains more than 99% of the Solar System’s mass."}</p><div className="solar-3d-links">{!activeLandmark && object?.orionPath && <Link href={object.orionPath}>Read Orion guide ↗</Link>}<a href={activeLandmark?.sourceUrl ?? object?.sourceUrl ?? selectedMoon?.sourceUrl ?? "https://science.nasa.gov/sun/"} target="_blank" rel="noopener noreferrer">{activeLandmark ? "Explore scientific source ↗" : "NASA further reading ↗"}</a></div></aside>
    </div>
    <p className="solar-3d-disclaimer">Illustrative 3D model: planet sizes and orbital distances are compressed and not to scale. Motion is an educational visualization, not a precise ephemeris or prediction tool. Surface landmark pins are illustrative locations on stylized spheres; they are not high-resolution geographic maps. Earth’s Moon is shown as an individually selectable body.</p>
  </div>;
}

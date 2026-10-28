"use client";

import { useState } from "react";
import Link from "next/link";
import { solarSystemObjects, solarSystemGroups } from "@/lib/solar-system";

export function SolarSystemExplorer() {
  const [selectedSlug, setSelectedSlug] = useState("earth");
  const selected = solarSystemObjects.find((object) => object.slug === selectedSlug) ?? solarSystemObjects[0];

  return (
    <div className="solar-explorer">
      <div className="solar-system-map" aria-label="Schematic of Solar System objects">
        <div className="solar-map-caption"><span className="live-dot" /> SELECT A WORLD TO EXPLORE</div>
        <div className="solar-object-track">
          {solarSystemObjects.filter((object) => object.slug !== "moon").map((object, index) => (
            <button
              type="button"
              key={object.slug}
              className={"solar-object-button" + (selectedSlug === object.slug ? " is-selected" : "") + (object.slug === "sun" ? " is-sun" : "")}
              onClick={() => setSelectedSlug(object.slug)}
              aria-pressed={selectedSlug === object.slug}
              aria-label={"Explore " + object.name}
              style={{ "--object-color": object.color } as React.CSSProperties}
            >
              <span className={"solar-object-orb orb-" + object.slug} aria-hidden="true">{object.symbol}</span>
              <span className="solar-object-name">{object.name}</span>
            </button>
          ))}
        </div>
        <p className="solar-map-note">Schematic view · Not to scale · Distances and sizes are simplified</p>
      </div>

      <div className="solar-selection-panel" aria-live="polite">
        <div className="solar-selection-art" style={{ "--object-color": selected.color } as React.CSSProperties} aria-hidden="true">
          <span className={"solar-selection-orb orb-" + selected.slug}>{selected.symbol}</span>
          <span className="solar-selection-ring ring-one" />
          <span className="solar-selection-ring ring-two" />
        </div>
        <div className="solar-selection-copy">
          <p className="eyebrow">{selected.kind.toUpperCase()} · {selected.group.toUpperCase()}</p>
          <h2>{selected.name}</h2>
          <p className="solar-selection-summary">{selected.summary}</p>
          <p className="solar-selection-detail">{selected.detail}</p>
          <div className="solar-fact"><span>ONE THING TO KNOW</span><p>{selected.fact}</p></div>
          <div className="solar-selection-actions">
            {selected.orionPath ? <Link className="button-primary" href={selected.orionPath}>Read Orion guide <span aria-hidden="true">↗</span></Link> : <a className="button-primary" href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">Explore official guide <span aria-hidden="true">↗</span></a>}
            <a className="solar-source-link" href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">NASA source ↗</a>
          </div>
        </div>
      </div>

      <div className="solar-group-index">
        {solarSystemGroups.map((group) => {
          const objects = solarSystemObjects.filter((object) => object.group === group);
          return <section className="solar-group" key={group}>
            <p className="eyebrow">{group.toUpperCase()}</p>
            <div className="solar-group-links">
              {objects.map((object) => <button type="button" key={object.slug} onClick={() => setSelectedSlug(object.slug)} className={selectedSlug === object.slug ? "active" : ""}>{object.name}<span aria-hidden="true">↗</span></button>)}
            </div>
          </section>;
        })}
      </div>
      <div className="solar-moon-callout">
        <span className="solar-moon-symbol" aria-hidden="true">◐</span>
        <div><p className="eyebrow">A WORLD THAT ORBITS A WORLD</p><h3>Meet Earth’s Moon</h3><p>Explore the natural satellite that shapes tides and keeps a record of the Solar System’s early history.</p></div>
        <button type="button" onClick={() => setSelectedSlug("moon")}>Explore the Moon ↗</button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchContent } from "@/lib/search-index";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = useMemo(() => searchContent(query, 8), [query]);

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleGlobalShortcut);
    return () => window.removeEventListener("keydown", handleGlobalShortcut);
  }, []);

  useEffect(() => {
    if (open) {
      const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const close = () => setOpen(false);
  const navigateToActive = () => {
    const selected = results[activeIndex];
    if (!selected) return;
    router.push(selected.href);
    close();
  };

  return (
    <>
      <button type="button" className="global-search-launcher" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-label="Search all Orion content">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7"/><path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
        <span>Search Orion</span><kbd>Ctrl / ⌘ K</kbd>
      </button>

      {open && (
        <div className="global-search-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="global-search-dialog" role="dialog" aria-modal="true" aria-labelledby="global-search-title">
            <div className="global-search-heading">
              <div><p className="eyebrow">ORION KNOWLEDGE INDEX</p><h2 id="global-search-title">Find your next discovery.</h2></div>
              <button type="button" className="global-search-close" onClick={close} aria-label="Close search">Esc <span aria-hidden="true">×</span></button>
            </div>
            <label className="global-search-input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7"/><path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
              <span className="sr-only">Search all Orion content</span>
              <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {
                if (event.key === "ArrowDown" && results.length) { event.preventDefault(); setActiveIndex((index) => (index + 1) % results.length); }
                else if (event.key === "ArrowUp" && results.length) { event.preventDefault(); setActiveIndex((index) => (index - 1 + results.length) % results.length); }
                else if (event.key === "Enter") { event.preventDefault(); navigateToActive(); }
              }} type="search" placeholder="Search planets, moons, galaxies, dinosaurs, events…" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="orion-search-results" aria-activedescendant={results[activeIndex] ? `orion-search-option-${results[activeIndex].id.replace(/[^a-zA-Z0-9_-]/g, "-")}` : undefined}/>
              {query && <button type="button" className="global-search-clear" onClick={() => setQuery("")}>Clear</button>}
            </label>
            <div className="global-search-meta"><span>{query.trim() ? `${results.length} matching results` : "Popular starting points"}</span><span>↑ ↓ navigate · Enter open</span></div>
            <div id="orion-search-results" className="global-search-results" role="listbox" aria-label="Search suggestions">
              {results.length ? results.map((result, index) => {
                const optionId = `orion-search-option-${result.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
                return <Link id={optionId} key={result.id} href={result.href} role="option" aria-selected={activeIndex === index} className={`global-search-result${activeIndex === index ? " is-active" : ""}`} onMouseEnter={() => setActiveIndex(index)} onClick={close}>
                  <span className="global-search-result-mark" aria-hidden="true">{result.kind === "Timeline event" ? "◷" : result.kind === "Moon" ? "◐" : result.kind === "Landmark" ? "⌖" : result.kind === "Solar System" ? "◉" : result.kind === "Collection" ? "▦" : "✳"}</span>
                  <span className="global-search-result-copy"><strong>{result.title}</strong><small>{result.subtitle}</small><span>{result.description}</span></span>
                  <span className="global-search-result-kind">{result.kind}</span>
                  <span className="global-search-result-arrow" aria-hidden="true">↗</span>
                </Link>;
              }) : <div className="global-search-empty"><strong>No matches yet</strong><p>Try a broader term such as “space”, “life”, “Earth”, or “history”.</p></div>}
            </div>
            <footer className="global-search-footer"><span>Searches Orion’s subjects, timeline, Solar System, moons and landmarks.</span><span>ESC to close</span></footer>
          </section>
        </div>
      )}
    </>
  );
}

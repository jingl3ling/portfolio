"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import ImmersiveTheme from "@/components/ImmersiveTheme";
import Scene from "./Scene";
import { SUN, buildSystem, startCameraPosition, type PlanetConfig } from "./system";

function slugFromHash(valid: Set<string>): string | null {
  const h = window.location.hash.slice(1);
  return valid.has(h) ? h : null;
}

export default function Explorer() {
  const system = useMemo(() => buildSystem(), []);
  const valid = useMemo(() => new Set([SUN, ...system.planets.map((p) => p.project.slug)]), [system]);
  // the camera, labels and panel are all driven by this one value; the URL
  // hash mirrors it so a planet can be linked to directly (/explore#buzz)
  const [focus, setFocus] = useState<string | null>(() => slugFromHash(valid));
  const { reduced, lowPower } = useMemo(
    () => ({
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      lowPower: window.innerWidth < 640,
    }),
    []
  );

  const startPosition = useMemo(
    () => startCameraPosition(system.maxRadius, window.innerWidth / window.innerHeight, reduced),
    [system, reduced]
  );
  // hold the canvas invisible until the first frame has rendered, then fade in
  const [ready, setReady] = useState(false);

  const select = useCallback((slug: string | null) => {
    setFocus(slug);
    history.replaceState(null, "", slug ? `#${slug}` : window.location.pathname);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") select(null);
    };
    // a pasted/edited link or back-forward navigation changes the hash
    // without remounting; our own select() uses replaceState, which doesn't fire this
    const onHash = () => setFocus(slugFromHash(valid));
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [select, valid]);

  const active = system.planets.find((p) => p.project.slug === focus) ?? null;

  return (
    <>
      <ImmersiveTheme accent="#8ec5ff" bg="#03040a" />
      <div aria-hidden className="fixed inset-0 bg-[#03040a]" />

      <div className={`fixed inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
        <Canvas
          camera={{ position: startPosition, fov: 50, near: 0.1, far: 700 }}
          dpr={[1, lowPower ? 1.5 : 1.75]}
          gl={{ antialias: true }}
          onCreated={() => requestAnimationFrame(() => setReady(true))}
        >
          <color attach="background" args={["#03040a"]} />
          <Scene
            planets={system.planets}
            maxRadius={system.maxRadius}
            focus={focus}
            onSelect={select}
            reduced={reduced}
            lowPower={lowPower}
          />
        </Canvas>
      </div>

      {/* DOM overlay: real text, links and buttons — keyboard- and screen-reader-reachable,
          unlike anything drawn inside the canvas */}
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col">
        <div className="wrap flex flex-1 flex-col pt-24 md:pt-28">
          <div className="pointer-events-auto max-w-sm">
            <Link href="/" data-cursor className="mono-label transition-colors hover:text-accent">
              ← Back to site
            </Link>
            <p className="mono-label mt-6">Prototype</p>
            <h1 className="display mt-2 text-[clamp(1.5rem,3vw,2.4rem)]">Explore my work universe</h1>
            <p className="mt-3 hidden text-sm leading-relaxed text-muted 2xl:block">
              Drag to orbit, scroll to zoom, click a planet to fly to it. Cool inner orbits are technical projects;
              the warm outer ring is entrepreneurship.
            </p>
          </div>

          <div className="relative mt-auto md:absolute md:right-6 md:top-28 md:mt-0 md:w-[22rem]">
            <InfoPanel active={active} sun={focus === SUN} onClose={() => select(null)} />
          </div>
        </div>

        <nav aria-label="Projects" className="pointer-events-auto flex gap-2 overflow-x-auto px-4 pb-5 pt-3 [scrollbar-width:none] md:justify-center">
          <Chip label="Overview" selected={focus === null} onClick={() => select(null)} />
          <Chip label="Jing" selected={focus === SUN} onClick={() => select(SUN)} />
          {system.planets.map((p) => (
            <Chip
              key={p.project.slug}
              label={p.project.title}
              warm={p.project.track === "venture"}
              selected={focus === p.project.slug}
              onClick={() => select(p.project.slug)}
            />
          ))}
        </nav>
      </div>
    </>
  );
}

function Chip({
  label,
  selected,
  warm,
  onClick,
}: {
  label: string;
  selected: boolean;
  warm?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-cursor
      className={`shrink-0 rounded-full border px-4 py-1.5 text-sm backdrop-blur-md transition-colors ${
        selected
          ? "border-ink bg-ink text-bg"
          : `bg-[#05060a]/60 hover:border-ink ${warm ? "border-[#d9a066]/40" : "border-line"}`
      }`}
    >
      {label}
    </button>
  );
}

function InfoPanel({
  active,
  sun,
  onClose,
}: {
  active: PlanetConfig | null;
  sun: boolean;
  onClose: () => void;
}) {
  const open = !!active || sun;
  const p = active?.project;
  return (
    <div
      aria-live="polite"
      className={`pointer-events-auto max-h-[46svh] overflow-y-auto rounded-2xl border border-line bg-[#05060a]/75 p-6 backdrop-blur-md transition-all duration-500 md:max-h-[calc(100svh-9rem)] ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {sun && (
        <>
          <p className="mono-label">The sun</p>
          <h2 className="display mt-2 text-3xl">Jing Huang</h2>
          <p className="mt-3 leading-relaxed text-muted">
            An engineer who ships across the stack and a founder who takes ideas from research to live product. Every
            orbiting body here is something I built.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <PanelLink href="/#about">About me</PanelLink>
            <PanelLink href="/#work">Work list</PanelLink>
          </div>
        </>
      )}
      {p && (
        <>
          <p className="mono-label">
            {p.track === "technical" ? "Technical" : "Entrepreneurship"} · {p.year}
          </p>
          <h2 className="display mt-2 text-3xl">{p.title}</h2>
          {p.award && <p className="mono-label mt-2 text-accent">★ {p.award}</p>}
          {p.role && <p className="mt-3 text-sm text-muted">{p.role}</p>}
          <p className="mt-3 leading-relaxed">{p.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="mono-label rounded-full border border-line px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <PanelLink href={`/work/${p.slug}`} primary>
              Open case study →
            </PanelLink>
          </div>
        </>
      )}
      {open && (
        <button
          type="button"
          onClick={onClose}
          data-cursor
          className="mono-label mt-5 block transition-colors hover:text-accent"
        >
          ← Back to overview (Esc)
        </button>
      )}
    </div>
  );
}

function PanelLink({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      data-cursor
      // inline color: globals.css has an unlayered `a { color: inherit }` that
      // beats Tailwind's layered `text-bg`, leaving dark-on-dark... or here
      // light-on-light, invisible text (same reason ContactAether inlines it)
      style={primary ? { color: "#03040a" } : undefined}
      className={`rounded-full px-5 py-2 text-sm transition-colors ${
        primary ? "bg-ink hover:bg-accent" : "border border-line hover:border-ink"
      }`}
    >
      {children}
    </Link>
  );
}

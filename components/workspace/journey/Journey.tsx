"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import ImmersiveTheme from "@/components/ImmersiveTheme";
import Reveal from "@/components/Reveal";
import JourneyScene from "./JourneyScene";
import { buildJourney, type Side, type Station } from "./layout";

const CONTACT = [
  { label: "Email", href: "mailto:jinghuang809@gmail.com", note: "jinghuang809@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jinghuang2022/", note: "Jing Huang" },
  { label: "GitHub", href: "https://github.com/jingl3ling", note: "jingl3ling" },
];

export default function Journey() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);

  const { reduced, lowPower } = useMemo(
    () => ({
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      lowPower: window.innerWidth < 640,
    }),
    []
  );

  // layout depends on the screen shape (text beside the planet vs. under it),
  // so rebuild it when that changes — bucketed so a resize drag doesn't thrash
  const [shape, setShape] = useState(() => ({
    aspect: Math.round((window.innerWidth / window.innerHeight) * 10) / 10,
    narrow: window.innerWidth < 768,
  }));
  useEffect(() => {
    const onResize = () => {
      const aspect = Math.round((window.innerWidth / window.innerHeight) * 10) / 10;
      const narrow = window.innerWidth < 768;
      setShape((s) => (s.aspect === aspect && s.narrow === narrow ? s : { aspect, narrow }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const journey = useMemo(() => buildJourney(shape.aspect, shape.narrow), [shape]);

  const sectionHeight = useCallback(
    () => (rootRef.current?.firstElementChild as HTMLElement | null)?.offsetHeight || window.innerHeight,
    []
  );

  // which station is on screen — drives the progress dots only (the camera
  // reads scroll itself every frame)
  useEffect(() => {
    const onScroll = () => {
      const i = Math.round(window.scrollY / sectionHeight());
      setActive(Math.max(0, Math.min(journey.stations.length - 1, i)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [journey, sectionHeight]);

  const goTo = (i: number) => {
    const y = i * sectionHeight();
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: object) => void } }).lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.8 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Which station a URL hash points at: a project's slug (/#buzz — what a
  // case study's "Return to journey" uses) or one of the nav's anchors.
  const stationForHash = useCallback(
    (hash: string) => {
      const h = hash.replace(/^#/, "");
      if (!h || h === "top") return 0;
      if (h === "work") return journey.stations.findIndex((s) => s.kind === "planet"); // the nav's "Work"
      return journey.stations.findIndex((s) => stationId(s, journey) === h);
    },
    [journey]
  );

  // Landing: no hash starts at the top (a refresh must not resume mid-journey);
  // a hash drops you at that station instantly — the camera snaps to the
  // pose on its first frame instead of flying the whole route to get there.
  // Lenis keeps its previous scroll target across client navigations, and
  // the browser's own hash jump can't see sections that mount late, so the
  // jump is done explicitly.
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: object) => void; resize?: () => void } })
      .lenis;
    const jump = () => {
      // arriving from a shorter page (a case study), Lenis still holds that
      // page's scroll limit and would clamp the jump short — re-measure first
      lenis?.resize?.();
      const i = Math.max(0, stationForHash(window.location.hash));
      const y = i * sectionHeight();
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    };
    jump();
    requestAnimationFrame(jump);
    // nav links (#about, #work, #contact) and pasted hashes after landing
    const onHash = () => {
      const i = stationForHash(window.location.hash);
      if (i >= 0) goTo(i);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
    // goTo only reads refs/stable values; re-running on every render would re-jump
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationForHash, sectionHeight]);

  const label = (s: Station) =>
    s.kind === "intro"
      ? "Start"
      : s.kind === "sun"
        ? "About me"
        : s.kind === "outro"
          ? "Contact"
          : journey.planets[s.planetIndex!].cfg.project.title;

  return (
    <>
      <ImmersiveTheme accent="#8ec5ff" bg="#03040a" />
      <div aria-hidden className="fixed inset-0 bg-[#03040a]" />

      <div className={`fixed inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
        <Canvas
          camera={{ position: journey.stations[0].pos, fov: 50, near: 0.1, far: 1500 }}
          dpr={[1, lowPower ? 1.5 : 1.75]}
          gl={{ antialias: true }}
          onCreated={() => requestAnimationFrame(() => setReady(true))}
        >
          <color attach="background" args={["#03040a"]} />
          <JourneyScene journey={journey} rootRef={rootRef} reduced={reduced} lowPower={lowPower} />
        </Canvas>
      </div>

      {/* soft vignette: darkens the edges so the eye stays on the system and
          the text panels sit on calmer ground */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(3,4,10,0.6) 100%)" }}
      />

      {/* progress: one dot per station, click to jump */}
      <nav aria-label="Journey progress" className="fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {journey.stations.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to ${label(s)}`}
            aria-current={active === i}
            data-cursor
            className="group flex items-center justify-end gap-3"
          >
            <span className="mono-label pointer-events-none opacity-0 transition-opacity group-hover:opacity-100">{label(s)}</span>
            <span
              className={`block rounded-full transition-all ${active === i ? "h-3 w-3 bg-ink" : "h-1.5 w-1.5 bg-ink/40 group-hover:bg-ink"}`}
            />
          </button>
        ))}
      </nav>

      {/* the scroll track: one full-height section per station; the canvas is
          fixed behind, so these only carry the text */}
      <div ref={rootRef} className="relative z-10">
        {journey.stations.map((s, i) => (
          <Section key={i} id={stationId(s, journey)} side={s.panel}>
            {s.kind === "intro" && <Intro />}
            {s.kind === "sun" && <About />}
            {s.kind === "planet" && <ProjectCard jp={journey.planets[s.planetIndex!]} />}
            {s.kind === "outro" && <Outro />}
          </Section>
        ))}
      </div>
    </>
  );
}

// anchors: the nav's #about / #work / #contact, and a project's slug
function stationId(s: Station, journey: ReturnType<typeof buildJourney>) {
  if (s.kind === "intro") return "top";
  if (s.kind === "sun") return "about";
  if (s.kind === "outro") return "contact";
  return journey.planets[s.planetIndex!].cfg.project.slug;
}

function Section({ id, side, children }: { id: string; side: Side; children: ReactNode }) {
  return (
    <section
      id={id}
      className="pointer-events-none flex h-[100svh] items-end pb-24 sm:pb-28 md:items-center md:pb-0"
    >
      <div className={`wrap flex ${side === "right" ? "md:justify-end" : "md:justify-start"}`}>
        <Reveal className="pointer-events-auto w-full max-w-md rounded-2xl border border-line bg-[#05060a]/65 p-6 backdrop-blur-md md:p-8">
          {children}
        </Reveal>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <>
      <p className="mono-label">A journey through my work</p>
      <h1 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)]">Jing Huang</h1>
      <p className="mt-3 leading-relaxed text-muted">
        Engineer and founder. Every world out here is something I built — scroll to travel through them.
      </p>
      <p className="mono-label mt-6">Scroll ↓</p>
      <Link href="/explore" data-cursor className="mono-label mt-3 block transition-colors hover:text-accent">
        Or explore the map freely →
      </Link>
    </>
  );
}

function About() {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line">
          <Image src="/img/new_profile.JPG" alt="Jing Huang" fill sizes="64px" className="object-cover" />
        </div>
        <div>
          <p className="mono-label">The sun · about me</p>
          <h2 className="display mt-1 text-2xl">I&apos;m Jing</h2>
        </div>
      </div>
      <p className="mt-4 leading-relaxed">
        An engineer who ships across the stack and a founder who takes ideas from research to live product.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        M.S. in Artificial Intelligence at NJIT, after a B.S. in Computer Engineering at UIUC. My work spans biosensing
        wearables, embedded/IoT, full-stack web, and AI — and I&apos;ve led small teams to build and pitch ventures.
      </p>
      <p className="mono-label mt-5">Everything orbiting me is a project →</p>
    </>
  );
}

function ProjectCard({ jp }: { jp: ReturnType<typeof buildJourney>["planets"][number] }) {
  const p = jp.cfg.project;
  return (
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
      <Link
        href={`/work/${p.slug}`}
        data-cursor
        // inline color: globals.css has an unlayered `a { color: inherit }` that
        // beats Tailwind's layered `text-bg` (same reason ContactAether inlines it)
        style={{ color: "#03040a" }}
        className="mt-5 inline-block rounded-full bg-ink px-5 py-2 text-sm transition-colors hover:bg-accent"
      >
        Open case study →
      </Link>
    </>
  );
}

function Outro() {
  return (
    <>
      <p className="mono-label">The whole system</p>
      <h2 className="display mt-2 text-3xl">Let&apos;s build something.</h2>
      <p className="mt-3 leading-relaxed text-muted">
        That&apos;s everything in orbit so far — there&apos;s plenty of empty space left on the map.
      </p>
      <div className="mt-5 grid gap-2">
        {CONTACT.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            data-cursor
            className="flex items-baseline justify-between gap-4 rounded-xl border border-line px-4 py-3 transition-colors hover:border-ink"
          >
            <span className="mono-label">{c.label}</span>
            <span className="text-sm text-muted">{c.note}</span>
          </a>
        ))}
      </div>
      <Link href="/explore" data-cursor className="mono-label mt-5 block transition-colors hover:text-accent">
        Or explore the map freely →
      </Link>
    </>
  );
}

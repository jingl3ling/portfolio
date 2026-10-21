import type { ReactNode } from "react";
import { Newsreader, UnifrakturMaguntia } from "next/font/google";
import type { Project } from "@/lib/projects";
import ImmersiveTheme from "@/components/ImmersiveTheme";
import ScrollTopOnMount from "@/components/work/ScrollTopOnMount";
import s from "./hermesday.module.css";

// only this page uses these faces, so they load here instead of in the root layout
const unifraktur = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-unifraktur",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

interface Member {
  name: string;
  namesake: string;
  role: string;
  job: ReactNode;
}

const WEDNESDAY: Member = {
  name: "Wednesday",
  namesake: "Nevermore’s sharpest mind, who trusts nothing she hasn’t checked herself.",
  role: "Orchestrator",
  job: (
    <>
      Reads the codebase, decides the design, and writes each worker a precise brief. When a worker says
      it’s done, Wednesday re-runs the checks herself before anything is merged.
    </>
  ),
};

const WORKERS: Member[] = [
  {
    name: "Thing",
    namesake: "The family’s ever-helpful disembodied hand.",
    role: "Worker",
    job: <>Making the outro text of each audio readback configurable from the admin screen.</>,
  },
  {
    name: "Enid",
    namesake: "Wednesday’s roommate and sunny opposite.",
    role: "Worker",
    job: <>Storing the pilot’s start date properly instead of reading it from a hard-coded call.</>,
  },
  {
    name: "Eugene",
    namesake: "Founder of the Nevermore beekeeping club.",
    role: "Worker",
    job: <>A retry queue, so audio that fails to generate gets tried again later.</>,
  },
];

const HOW = [
  {
    title: "One orchestrator, three workers",
    body: "Wednesday plans and verifies. Thing, Enid, and Eugene are identical workers; each one owns a single workstream at a time.",
  },
  {
    title: "Separate workspaces",
    body: "Every worker edits its own git worktree, so their changes can never collide. Wednesday merges them one by one.",
  },
  {
    title: "Runs locally",
    body: "The workers run Qwen on a Mac Studio on our own network, so university content never leaves it.",
  },
];

function Card({ m, lead = false }: { m: Member; lead?: boolean }) {
  return (
    <li className={`${s.card} ${lead ? s.cardLead : ""}`}>
      <span className={s.cardRole}>{m.role}</span>
      <h3 className={s.cardName}>{m.name}</h3>
      <p className={s.namesake}>{m.namesake}</p>
      <p className={s.job}>{m.job}</p>
    </li>
  );
}

export default function HermesdayPage({ project }: { project: Project }) {
  return (
    <div className={`${s.page} ${unifraktur.variable} ${newsreader.variable}`}>
      <ScrollTopOnMount />
      <ImmersiveTheme accent="#8f86ff" bg="#0b0a1f" />

      <header className={`${s.col} ${s.header}`}>
        <div className={s.eyebrow}>
          Technical project · {project.year} · <span className={s.live}>In progress</span>
        </div>
        <h1 className={s.title}>
          <span>Hermes</span>day
        </h1>
        <p className={s.lede}>
          An agent team I built in <em>Hermes</em>, cast from the characters of <em>Wednesday</em>.
          Wednesday runs the show as the orchestrator, while Thing, Enid, and Eugene do the work.
        </p>
        <figure className={s.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element -- matches the other case studies */}
          <img
            src={project.image}
            width={1080}
            height={540}
            alt="Duotone still in ultramarine: Eugene in glasses on the left, Wednesday with braids at center, Enid smiling on the right, and Thing the disembodied hand resting on Wednesday's shoulder."
          />
          <figcaption>Pictured: Eugene, Wednesday, Enid, and Thing.</figcaption>
        </figure>
      </header>

      <main className={`${s.col} ${s.main}`}>
        <section className={s.section} aria-labelledby="hd-cast">
          <h2 id="hd-cast" className={s.h2}>
            <span className={s.glyph}>W</span>The cast
          </h2>
          <ul className={s.cast}>
            <Card m={WEDNESDAY} lead />
            {WORKERS.map((w) => (
              <Card key={w.name} m={w} />
            ))}
          </ul>
          <p className={s.caption}>
            Their first assignments are on a Drupal module that turns NJIT news articles into audio.
          </p>
        </section>

        <section className={s.section} aria-labelledby="hd-how">
          <h2 id="hd-how" className={s.h2}>
            <span className={s.glyph}>H</span>How the team works
          </h2>
          <div className={s.how}>
            {HOW.map((h) => (
              <div key={h.title} className={s.howItem}>
                <h3 className={s.h3}>{h.title}</h3>
                <p>{h.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.closing} aria-labelledby="hd-next">
          <span id="hd-next" className={s.kicker}>
            What’s next
          </span>
          <p>
            Hermesday is just getting started. Next I want to give the team more of the work, and see how
            much Wednesday can trust them with.
          </p>
        </section>

        <section className={s.section} aria-labelledby="hd-stack">
          <span id="hd-stack" className={s.kicker}>
            Stack
          </span>
          <div className={s.stack}>
            {project.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
      </main>

      <footer className={`${s.col} ${s.footer}`}>
        {project.title} · Jing Huang · {project.year}
      </footer>
    </div>
  );
}

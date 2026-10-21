import { Bodoni_Moda, Instrument_Sans, Kaushan_Script } from "next/font/google";
import type { Project } from "@/lib/projects";
import ImmersiveTheme from "@/components/ImmersiveTheme";
import ScrollTopOnMount from "@/components/work/ScrollTopOnMount";
import s from "./hackclaw.module.css";

// only this page uses these faces, so they load here instead of in the root layout
const kaushan = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kaushan",
  display: "swap",
});
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

interface Member {
  name: string;
  billing: string;
  namesake: string;
  model: string;
  job: string;
}

const DEBORAH: Member = {
  name: "Deborah",
  billing: "Headliner · Orchestrator",
  namesake: "The Las Vegas comedy legend who runs everything.",
  model: "Claude",
  job: "Takes my request in Discord, plans the change, briefs Ava and Marcus with the repo, branch, and acceptance criteria, then reports back when it’s verified.",
};

const SUPPORT: Member[] = [
  {
    name: "Ava",
    billing: "Writer",
    namesake: "The young writer Deborah hires to sharpen her act.",
    model: "Local model · Ollama",
    job: "Writes the code on a fresh branch and pushes it to GitHub.",
  },
  {
    name: "Marcus",
    billing: "QA",
    namesake: "Deborah’s COO, who keeps the business honest.",
    model: "Local model · Ollama",
    job: "Checks Ava’s work: the change is there, the methods exist, and the commit is clean.",
  },
];

const HOW = [
  {
    title: "Everyone’s in Discord",
    body: "I talk to the team in a Discord server. Deborah answers, delegates, and posts the branch and commit when the work is done.",
  },
  {
    title: "Headliner in the cloud, crew at home",
    body: "Deborah runs on Anthropic’s Claude. Ava and Marcus run a smaller model served by Ollama on a Mac mini.",
  },
  {
    title: "Ships straight to GitHub",
    body: "A fine-grained GitHub token lets the team read the repo, make changes, and push commits on their own.",
  },
];

function Act({ m, headliner = false }: { m: Member; headliner?: boolean }) {
  return (
    <li className={`${s.act} ${headliner ? s.headliner : ""}`}>
      <span className={s.billing}>{m.billing}</span>
      <h3 className={s.actName}>{m.name}</h3>
      <p className={s.namesake}>{m.namesake}</p>
      <p className={s.job}>{m.job}</p>
      <span className={s.model}>{m.model}</span>
    </li>
  );
}

export default function HackclawPage({ project }: { project: Project }) {
  return (
    <div className={`${s.page} ${kaushan.variable} ${bodoni.variable} ${instrument.variable}`}>
      <ScrollTopOnMount />
      <ImmersiveTheme accent="#ff5fa8" bg="#0b0710" />

      <header className={`${s.col} ${s.header}`}>
        <div className={s.headText}>
          <div className={s.eyebrow}>Technical project · {project.year} · Multi-agent orchestration</div>
          <h1 className={s.title}>
            Hack<span>claw</span>
          </h1>
          <p className={s.lede}>
            An agent team I built with <em>OpenClaw</em>, cast from the characters of <em>Hacks</em>.
            Deborah headlines as the orchestrator, Ava writes the code, and Marcus checks it, all in a
            Discord server I can talk to.
          </p>
        </div>
        <figure className={s.poster}>
          {/* eslint-disable-next-line @next/next/no-img-element -- matches the other case studies */}
          <img
            src={project.thumbnail}
            width={810}
            height={1200}
            alt="Hacks poster: Deborah in a magenta gown and Ava in a dark suit wade out of the Bellagio fountains in Las Vegas, each holding lobster claws, under a glowing script logo."
          />
        </figure>
      </header>

      <main className={`${s.col} ${s.main}`}>
        <section className={s.section} aria-labelledby="hc-cast">
          <h2 id="hc-cast" className={s.h2}>
            Tonight’s lineup
          </h2>
          <div className={s.marquee}>
            <ul className={s.lineup}>
              <Act m={DEBORAH} headliner />
              {SUPPORT.map((m) => (
                <Act key={m.name} m={m} />
              ))}
            </ul>
          </div>
        </section>

        <section className={s.section} aria-labelledby="hc-room">
          <h2 id="hc-room" className={s.h2}>
            In the writers’ room
          </h2>
          <figure className={s.shot}>
            {/* eslint-disable-next-line @next/next/no-img-element -- matches the other case studies */}
            <img
              src={project.image}
              width={1265}
              height={955}
              alt="The Agent Hacks Discord server. I ask Deborah to plan a small fix in njit-content-to-audio; she assigns coding to Ava and QA to Marcus, then reports both tasks complete and verified, with the branch deborah/fix-routing-yml and commit c7c4cc0."
            />
            <figcaption>
              The <b>Agent Hacks</b> server: I ask Deborah for a fix, she briefs Ava and Marcus, and
              reports back with the branch and commit once Marcus has verified it.
            </figcaption>
          </figure>
        </section>

        <section className={s.section} aria-labelledby="hc-how">
          <h2 id="hc-how" className={s.h2}>
            How the show runs
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

        <section className={s.section} aria-labelledby="hc-stack">
          <span id="hc-stack" className={s.kicker}>
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

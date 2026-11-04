import { Chakra_Petch, Hanken_Grotesk } from "next/font/google";
import type { Project } from "@/lib/projects";
import ImmersiveTheme from "@/components/ImmersiveTheme";
import ScrollTopOnMount from "@/components/work/ScrollTopOnMount";
import MistDemo from "./MistDemo";
import s from "./buzz.module.css";

// only this page uses these faces, so they load here instead of in the root layout
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const PIPELINE = [
  {
    name: "Bee",
    detail: "A wearable worn on the wrist. I start, mute, and stop it from my Apple Watch while it transcribes the conversation.",
  },
  {
    name: "Bridge",
    detail: "A Python bridge follows Bee’s live stream and forwards each utterance to the server as it arrives.",
  },
  {
    name: "Server",
    detail: "A FastAPI service asks Jev how heated the wording is, adds speaking pace, and turns both into one intensity score.",
  },
  {
    name: "Lamp",
    detail: "An ESP32 with an 8×8 LED matrix polls for a color and a breathing pace, then animates on its own.",
  },
];

const SCALE = [
  { at: "0.00", name: "Light blue", note: "calm, MIST’s own color", rgb: "90, 180, 255" },
  { at: "0.50", name: "Soft off-white", note: "the conversation is animated", rgb: "244, 240, 240" },
  { at: "0.75", name: "Orange", note: "time to simmer down", rgb: "255, 110, 20" },
  { at: "1.00", name: "Red", note: "a full argument", rgb: "255, 30, 20" },
];

const RUBRIC = ["Relaxed chat", "Animated", "Heated or rushed", "Argument or shouting"];

export default function BuzzPage({ project }: { project: Project }) {
  return (
    <div className={`${s.page} ${chakra.variable} ${hanken.variable}`}>
      <ScrollTopOnMount />
      <ImmersiveTheme accent="#5ab4ff" bg="#0a1220" />

      <header className={`${s.col} ${s.hero}`}>
        <div className={s.heroText}>
          <div className={s.eyebrow}>Personal project · {project.year} · Wearable AI</div>
          <h1 className={s.title}>Buzz</h1>
          <p className={s.formula}>
            <span className={s.bee}>Bee</span> + <span className={s.jev}>Jev</span>, inspired by{" "}
            <span className={s.mist}>MIST</span>
          </p>
          <p className={s.lede}>
            A lamp that shows how heated a conversation is getting. It glows MIST’s calm blue while you
            chat, then warms to orange and red as things boil over, breathing faster the faster you talk.
            When it turns orange, it’s time to simmer down.
          </p>
        </div>
        <MistDemo />
      </header>

      <main className={`${s.col} ${s.main}`}>
        <section className={s.section} aria-labelledby="bz-mist">
          <div className={s.sectionHead}>
            <span className={s.index}>01</span>
            <h2 id="bz-mist" className={s.h2}>
              Where the colors come from
            </h2>
          </div>
          <p>
            In Netflix’s <em>Pantheon</em>, an animated series about uploaded intelligence, MIST is a
            digital being whose crystal form shows how she feels. Calm, she’s a cool blue. Pushed too far,
            she burns orange. Buzz borrows that idea for real conversations.
          </p>
          <div className={s.duo}>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element -- matches the other case studies */}
              <img src="/img/MIST.webp" width={1080} height={499} alt="MIST as a glowing light-blue crystal, calm." />
              <figcaption>
                <span className={s.dotCalm} aria-hidden /> Calm MIST
              </figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element -- matches the other case studies */}
              <img src="/img/Mad%20MIST.webp" width={1080} height={607} alt="MIST split into two glowing orange crystals, firing a beam of light across the sky." />
              <figcaption>
                <span className={s.dotMad} aria-hidden /> Mad MIST
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={s.section} aria-labelledby="bz-how">
          <div className={s.sectionHead}>
            <span className={s.index}>02</span>
            <h2 id="bz-how" className={s.h2}>
              How it works
            </h2>
          </div>
          <ol className={s.pipeline}>
            {PIPELINE.map((p) => (
              <li key={p.name}>
                <span className={s.node}>{p.name}</span>
                <p>{p.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.section} aria-labelledby="bz-jev">
          <div className={s.sectionHead}>
            <span className={s.index}>03</span>
            <h2 id="bz-jev" className={s.h2}>
              Jev makes the call
            </h2>
          </div>
          <div className={s.split}>
            <div className={s.splitText}>
              <p>
                Speaking fast isn’t the same as arguing. So the server sends the last few seconds of speech
                to <b>Jev</b>, which answers one question: <em>is this conversation heated?</em> It rates
                the wording on a fixed scale, and its answer carries the most weight in the score.
              </p>
              <p>
                Speaking pace fills in the rest. Pace alone can only warm the lamp to peach. Only Jev can
                turn it orange or red, so a heated remark shows even when nobody is talking fast.
              </p>
            </div>
            <ol className={s.rubric} aria-label="Jev's rating scale">
              {RUBRIC.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className={s.section} aria-labelledby="bz-scale">
          <div className={s.sectionHead}>
            <span className={s.index}>04</span>
            <h2 id="bz-scale" className={s.h2}>
              The color scale
            </h2>
          </div>
          <div className={s.gradient} aria-hidden />
          <ul className={s.scale}>
            {SCALE.map((c) => (
              <li key={c.at}>
                <span className={s.scaleAt}>{c.at}</span>
                <span className={s.scaleSwatch} style={{ background: `rgb(${c.rgb})` }} aria-hidden />
                <span className={s.scaleName}>{c.name}</span>
                <span className={s.scaleNote}>{c.note}</span>
                <span className={s.scaleRgb}>rgb {c.rgb}</span>
              </li>
            ))}
          </ul>
          <p className={s.muted}>
            Colors blend in OKLab, so blue passes through off-white on its way to orange instead of turning
            muddy gray. The lamp holds a solid light when nobody is talking and breathes only during a
            conversation, from about 10 seconds a breath when it’s quiet down to 3 when you’re talking fast.
          </p>
        </section>

        <section className={s.beeCard} aria-labelledby="bz-bee">
          {/* eslint-disable-next-line @next/next/no-img-element -- matches the other case studies */}
          <img src="/img/Bee.jpg" width={1920} height={1080} alt="The Bee wearable, a black wristband, in front of the word Bee on yellow." />
          <div>
            <span className={s.beeKicker}>Built on</span>
            <h2 id="bz-bee" className={s.beeTitle}>
              Bee, the wearable that listens
            </h2>
            <p>
              Bee transcribes conversations from the wrist, and its live stream is what lets Buzz react while
              you’re still talking. Transcripts stay in the server’s memory for a few minutes and are never
              written to disk.
            </p>
          </div>
        </section>

        <section className={s.section} aria-labelledby="bz-stack">
          <span id="bz-stack" className={s.kicker}>
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

import Image from "next/image";
import { Hanken_Grotesk, Playfair_Display } from "next/font/google";
import type { Project } from "@/lib/projects";
import ImmersiveTheme from "@/components/ImmersiveTheme";
import ScrollTopOnMount from "@/components/work/ScrollTopOnMount";
import s from "./sasha.module.css";

// only this page uses these faces, so they load here instead of in the root layout
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-sasha",
  display: "swap",
});

const STEPS = [
  {
    n: "01",
    title: "The call",
    body: "Sasha talks with you on live video and gives honest feedback on what you’re wearing right now.",
  },
  {
    n: "02",
    title: "The search",
    body: "Tell her the occasion and a budget. A ZooWork agent, running Claude Sonnet 5.5, researches it and searches the store’s catalog.",
  },
  {
    n: "03",
    title: "The lookbook",
    body: "She presents several outfits within budget as a lookbook. Ask for a change, like “make the shoes darker”, and only that piece updates.",
  },
];

const HOOD = [
  {
    title: "Talking while she works",
    body: "A fast conversational layer keeps Sasha chatting while the agent works in the background, and its steps stream into a live “Working on it” feed.",
  },
  {
    title: "An agent per call",
    body: "Each video call starts a ZooWork session. It researches the occasion and searches up to 1,046 items in the demo store, Fashion Barn, then curates outfits.",
  },
  {
    title: "Checks she can’t skip",
    body: "The backend verifies that every product is real, the sizing fits, and the total stays within budget. A $10,000 limit is enforced.",
  },
  {
    title: "Plugs into any store",
    body: "A Model Context Protocol catalog server connects the store. Tavus is the avatar, Daily carries the video, and a Node backend on Railway hosts it all.",
  },
];

const TICKER = ["Fashion + Finance AI Hackathon", "AI Tinkerers × ZooWork", "1st place", "Saturday, November 7th"];

// the demo video's id, from its YouTube link
const videoId = (url?: string) => /(?:v=|youtu\.be\/)([\w-]{11})/.exec(url ?? "")?.[1];

export default function SashaPage({ project }: { project: Project }) {
  const demo = project.embed ?? "";
  const video = videoId(project.video);
  return (
    <div className={`${s.page} ${playfair.variable} ${hanken.variable}`}>
      <ScrollTopOnMount />
      {/* a light page: dark ink on ivory (the shared nav, back link and cursor follow the tokens) */}
      <ImmersiveTheme light accent="#14110f" bg="#f2ede4" />

      <header className={`${s.col} ${s.hero}`}>
        <div className={s.heroText}>
          <div className={s.masthead}>
            <span>Technical project · {project.year}</span>
            <span>Nº 01</span>
          </div>
          <h1 className={s.title}>Sasha</h1>
          <p className={s.subtitle}>
            <em>your personal stylist</em>
          </p>
          <p className={s.dek}>
            A live video stylist for online stores. She gives honest feedback on what you’re wearing, then searches the
            catalog for your occasion and budget and builds a lookbook.
          </p>
        </div>

        <figure className={s.cover}>
          <div className={s.coverImg}>
            <Image
              src={project.thumbnail ?? "/img/fnf-hackathon-cover.avif"}
              alt="Cover of the Fashion + Finance AI Hackathon, Saturday, November 7th, 10am to 6pm, from AI Tinkerers and ZooWork: neon green type over a dusk Manhattan skyline and a great tree, two people sitting on a lawn below."
              width={1400}
              height={855}
              sizes="(min-width: 1024px) 560px, 100vw"
              priority
            />
          </div>
          <figcaption>Fashion + Finance AI Hackathon · AI Tinkerers × ZooWork</figcaption>
          {/* a rosette: the ring of text turns slowly (not at all if you prefer reduced motion) */}
          <div className={s.rosette} role="img" aria-label="First place">
            <svg viewBox="0 0 120 120" className={s.ring} aria-hidden>
              <defs>
                <path id="sasha-ring" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
              </defs>
              <text>
                <textPath href="#sasha-ring" startOffset="0">
                  1ST PLACE ✦ FASHION + FINANCE AI HACKATHON ✦
                </textPath>
              </text>
            </svg>
            <span className={s.rosetteNo}>1st</span>
          </div>
        </figure>
      </header>

      <div className={s.ticker} aria-hidden>
        <div className={s.tickerTrack}>
          {[0, 1].map((k) => (
            <span key={k} className={s.tickerRow}>
              {TICKER.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <main>
        <section className={`${s.col} ${s.brief}`} aria-labelledby="sa-brief">
          <h2 id="sa-brief" className={s.kicker}>
            The brief
          </h2>
          <blockquote className={s.quote}>
            <p>
              “Summer wedding in Italy, <em>about $800.</em>”
            </p>
          </blockquote>
          <p className={s.briefNote}>
            That’s all Sasha needs. She was built at the Fashion + Finance AI Hackathon and plugs straight into a store;
            in our demo that’s <em>Fashion Barn</em>, a boutique with more than a thousand pieces to search.
          </p>
        </section>

        <section className={`${s.col} ${s.steps}`} aria-label="How Sasha works">
          <ol>
            {STEPS.map((st) => (
              <li key={st.n}>
                <span className={s.stepNo}>{st.n}</span>
                <h3>{st.title}</h3>
                <p>{st.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {video && (
          <section className={`${s.col} ${s.watch}`} aria-labelledby="sa-watch">
            <div className={s.tryHead}>
              <h2 id="sa-watch" className={s.h2}>
                Watch her <em>work</em>
              </h2>
              <p>Sasha finds an outfit for a wedding in Capri, start to finish. Demo video by Michael Halpert.</p>
            </div>
            <div className={`${s.frame} ${s.videoFrame}`}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video}?rel=0`}
                title="AI Stylist Sasha Finds Capri Wedding Outfit"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <section className={`${s.col} ${s.try}`} aria-labelledby="sa-try">
          <div className={s.tryHead}>
            <h2 id="sa-try" className={s.h2}>
              Meet <em>Sasha</em>
            </h2>
            <p>
              This is the live demo. Open <strong>Stylist</strong> in the corner of the shop and type her a brief. The video
              call runs on a small monthly allowance, so if she’s resting, typing still works.
            </p>
          </div>
          <div className={s.frame}>
            <iframe
              src={demo}
              title="Fashion Barn, the demo boutique with Sasha, the personal stylist"
              loading="lazy"
              allow="camera; microphone; autoplay; clipboard-write; fullscreen"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className={s.frameNote}>
            A hackathon demo, not a real shop — nothing here is for sale.{" "}
            <a href={demo} target="_blank" rel="noreferrer" data-cursor>
              Open the full site ↗
            </a>
          </p>
        </section>

        <section className={`${s.col} ${s.hood}`} aria-labelledby="sa-hood">
          <h2 id="sa-hood" className={s.kicker}>
            Under the hood
          </h2>
          <ul>
            {HOOD.map((h) => (
              <li key={h.title}>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={s.result} aria-labelledby="sa-result">
          <div className={`${s.col} ${s.resultIn}`}>
            <p className={s.resultKicker}>The result</p>
            <h2 id="sa-result" className={s.resultTitle}>
              <em>First</em> place.
            </h2>
            <p className={s.resultBody}>
              Sasha won the Fashion + Finance AI Hackathon, hosted by AI Tinkerers and ZooWork on Saturday, November 7th,
              10am to 6pm.
            </p>
            {project.attribution && <p className={s.credit}>{project.attribution}</p>}
            <ul className={s.stack} aria-label="Built with">
              {project.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {project.links?.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-cursor className={s.cta}>
                {l.label} ↗
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

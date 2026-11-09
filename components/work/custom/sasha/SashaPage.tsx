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
    title: "The brief",
    body: "Talk to Sasha on video, or just type. An occasion, a budget, a mood — that’s the whole brief.",
  },
  {
    n: "02",
    title: "The fitting",
    body: "A ZooWork agent works through the catalog. Every step it takes lands in a live “Working on it” feed, so you can watch the stylist think.",
  },
  {
    n: "03",
    title: "The look",
    body: "She puts together looks from women’s and men’s clothing, shoes and accessories. Add the pieces to your bag and check out.",
  },
];

const TICKER = ["Fashion + Finance AI Hackathon", "AI Tinkerers × ZooWork", "1st place", "Saturday, November 7th"];

export default function SashaPage({ project }: { project: Project }) {
  const demo = project.embed ?? "";
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
            Tell her the occasion and the budget. A video avatar and a ZooWork agent take it from there and put the
            look together.
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
            That’s all Sasha needs. She was built at the Fashion + Finance AI Hackathon and lives inside{" "}
            <em>Fashion Barn</em>, a demo boutique, where she shops the whole store for you.
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

        <section className={`${s.col} ${s.try}`} aria-labelledby="sa-try">
          <div className={s.tryHead}>
            <h2 id="sa-try" className={s.h2}>
              Meet <em>Sasha</em>
            </h2>
            <p>
              This is the live demo. Open <strong>Stylist</strong> in the corner of the shop to talk to her, or type her
              a brief.
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

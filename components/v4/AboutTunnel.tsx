import Reveal from "@/components/Reveal";
import type { ReactNode } from "react";

const EDUCATION = [
  { school: "New Jersey Institute of Technology", detail: "M.S. Artificial Intelligence · GPA 3.7", time: "2024 — Present" },
  { school: "University of Illinois at Urbana-Champaign", detail: "B.S. Computer Engineering", time: "2018 — 2022" },
];

const EXPERIENCE = [
  { role: "Web Developer", org: "NJIT", time: "2023 — Present" },
  { role: "Founder", org: "Althy (Bentley Incubator)", time: "2025 — 2026" },
  { role: "Co-Founder & PM", org: "OTB English", time: "2023 — 2024" },
  { role: "IT / Web Assistant", org: "Spurlock Museum, UIUC", time: "2021 — 2022" },
];

const SKILLS = [
  { group: "Languages", items: "Python · TypeScript · Java · C/C++ · Swift · PHP" },
  { group: "AI / ML", items: "LLM integration · AI agents · NLP · biometric analysis" },
  { group: "Web", items: "React · Node · Django · Drupal · Elasticsearch" },
  { group: "Cloud & Data", items: "AWS · GCP · Azure · PostgreSQL · MongoDB · Neo4j" },
];

// a window into the single shared background tunnel (TunnelWindows clips the
// tunnel to every `.tunnel-window`); the translucent bg keeps text readable
function TunnelCard({ children }: { children: ReactNode }) {
  return (
    <div className="tunnel-window relative z-[6] rounded-2xl border border-line p-7 [text-shadow:0_1px_14px_rgba(0,0,0,0.9)]">
      {children}
    </div>
  );
}

export default function AboutTunnel() {
  return (
    <section id="about" className="wrap py-28 md:py-40">
      {/* intro: profile + statement (dark background) */}
      <div className="grid items-start gap-12 md:grid-cols-[300px_1fr] md:gap-20">
        <Reveal>
          <div
            role="img"
            aria-label="Jing Huang"
            className="aspect-[4/5] border border-line bg-[color-mix(in_srgb,var(--accent)_10%,#0a0a12)] bg-cover bg-center"
            style={{ backgroundImage: "url(/img/profile.png)" }}
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="display max-w-[20ch] text-[clamp(1.7rem,3.8vw,3rem)] leading-[1.12]">
              I&apos;m Jing — an engineer who ships across the stack and a
              founder who takes ideas from research to live product.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-10 max-w-xl text-lg leading-loose text-muted">
              Currently pursuing an M.S. in Artificial Intelligence at NJIT,
              after a B.S. in Computer Engineering at UIUC. My work spans
              biosensing wearables, embedded/IoT, full-stack web, and AI — and
              I&apos;ve led small teams to build and pitch ventures.
            </p>
          </Reveal>
        </div>
      </div>

      {/* education · experience · skills — tunnel lives inside these cards */}
      <div className="mt-24 grid gap-4 md:mt-32 md:grid-cols-3">
        <Reveal>
          <TunnelCard>
            <h3 className="font-display text-2xl">Education</h3>
            <div className="mt-2">
              {EDUCATION.map((e) => (
                <div key={e.school} className="border-t border-line py-5">
                  <div className="mono-label">{e.time}</div>
                  <div className="mt-2 leading-snug">{e.school}</div>
                  <div className="mt-1 text-muted">{e.detail}</div>
                </div>
              ))}
            </div>
          </TunnelCard>
        </Reveal>

        <Reveal delay={0.06}>
          <TunnelCard>
            <h3 className="font-display text-2xl">Experience</h3>
            <div className="mt-2">
              {EXPERIENCE.map((e) => (
                <div key={e.role + e.org} className="border-t border-line py-4">
                  <div className="mono-label">{e.time}</div>
                  <div className="mt-1 leading-snug">{e.role}</div>
                  <div className="text-muted">{e.org}</div>
                </div>
              ))}
            </div>
          </TunnelCard>
        </Reveal>

        <Reveal delay={0.12}>
          <TunnelCard>
            <h3 className="font-display text-2xl">Skills</h3>
            <div className="mt-2">
              {SKILLS.map((s) => (
                <div key={s.group} className="border-t border-line py-4">
                  <div className="mono-label mb-1">{s.group}</div>
                  <div className="leading-relaxed text-muted">{s.items}</div>
                </div>
              ))}
            </div>
          </TunnelCard>
        </Reveal>
      </div>
    </section>
  );
}

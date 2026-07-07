import Reveal from "@/components/Reveal";

const EDUCATION = [
  {
    school: "New Jersey Institute of Technology",
    detail: "M.S. Artificial Intelligence · GPA 3.7",
    time: "2024 — Present",
  },
  {
    school: "University of Illinois at Urbana-Champaign",
    detail: "B.S. Computer Engineering",
    time: "2018 — 2022",
  },
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

export default function About() {
  return (
    <section id="about" className="wrap pt-8 pb-28 md:pt-12 md:pb-40">
      <Reveal>
        <p className="mono-label mb-14">About</p>
      </Reveal>

      {/* intro: profile photo + statement */}
      <div className="grid items-start gap-12 md:grid-cols-[300px_1fr] md:gap-20">
        <Reveal>
          {/* PLACEHOLDER — swap for a real portrait */}
          <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-line bg-[color-mix(in_srgb,var(--accent)_6%,white)]">
            <span className="mono-label">Profile photo</span>
          </div>
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

      {/* details: education · experience · skills, given room to breathe */}
      <div className="mt-24 grid gap-x-14 gap-y-16 md:mt-36 md:grid-cols-3">
        <div>
          <Reveal>
            <h3 className="font-display text-2xl">Education</h3>
          </Reveal>
          <div className="mt-4">
            {EDUCATION.map((e, i) => (
              <Reveal key={e.school} delay={i * 0.05}>
                <div className="border-t border-line py-6">
                  <div className="mono-label">{e.time}</div>
                  <div className="mt-2 text-lg leading-snug">{e.school}</div>
                  <div className="mt-1 text-muted">{e.detail}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal>
            <h3 className="font-display text-2xl">Experience</h3>
          </Reveal>
          <div className="mt-4">
            {EXPERIENCE.map((e, i) => (
              <Reveal key={e.role + e.org} delay={i * 0.05}>
                <div className="border-t border-line py-6">
                  <div className="mono-label">{e.time}</div>
                  <div className="mt-2 text-lg leading-snug">{e.role}</div>
                  <div className="mt-1 text-muted">{e.org}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal>
            <h3 className="font-display text-2xl">Skills</h3>
          </Reveal>
          <div className="mt-4">
            {SKILLS.map((s, i) => (
              <Reveal key={s.group} delay={i * 0.05}>
                <div className="border-t border-line py-6">
                  <div className="mono-label mb-2">{s.group}</div>
                  <div className="leading-relaxed text-muted">{s.items}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Reveal>
        <div className="mt-20 rounded-2xl border border-line p-8 md:p-10">
          <div className="mono-label mb-3">In the community</div>
          <p className="max-w-3xl text-lg leading-relaxed text-muted">
            Active member &amp; guest speaker at Startup Grind (panelist at
            Columbia University), and a regular at AI Tinkerers and NJII startup
            events.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

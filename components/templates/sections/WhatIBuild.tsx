import Reveal from "@/components/Reveal";

const CLUSTERS = [
  {
    title: "Biosensing & Hardware",
    body: "Wearables and IoT devices — ESP32, LEDs, IMUs, ECG — that turn human signals into something you can see and feel.",
    tags: ["ESP32", "Arduino", "HealthKit", "Fabrication"],
  },
  {
    title: "Full-stack Web",
    body: "Production React/TypeScript front-ends and Node/PHP back-ends, from a university platform at scale to shipped product betas.",
    tags: ["React", "TypeScript", "Node", "Elasticsearch"],
  },
  {
    title: "AI",
    body: "LLM integration and agents woven into real workflows — code review, natural-language UX, biometric analysis, planning.",
    tags: ["Claude / OpenAI", "AI Agents", "NLP", "Prompting"],
  },
  {
    title: "Ventures",
    body: "Zero-to-one: research, UX in Figma, leading small teams, and pitching to investors and startup communities.",
    tags: ["Product", "UX", "Fundraising", "Team Lead"],
  },
];

export default function WhatIBuild() {
  return (
    <section className="wrap py-24 md:py-32">
      <Reveal>
        <p className="mono-label mb-10">What I build</p>
      </Reveal>
      <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
        {CLUSTERS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06} className="bg-bg">
            <div className="h-full p-8 md:p-10">
              <h3 className="font-display text-2xl md:text-3xl">{c.title}</h3>
              <p className="mt-3 max-w-md text-muted">{c.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span key={t} className="mono-label">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

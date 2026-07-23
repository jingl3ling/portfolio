import Reveal from "@/components/Reveal";

const LINKS = [
  { label: "Email", href: "mailto:jinghuang809@gmail.com", note: "jinghuang809@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jinghuang2022/", note: "→ Jing Huang" },
  { label: "GitHub", href: "https://github.com/jingl3ling", note: "→ jingl3ling" },
  { label: "Resume", href: "/Resume.pdf", note: "→ Resume" },
];

export default function Contact() {
  return (
    <section id="contact" className="wrap py-28 md:py-40">
      <Reveal>
        <p className="mono-label mb-8">Contact</p>
        <h2 className="display max-w-[16ch] text-[clamp(2.2rem,7vw,5.5rem)]">
          Let&apos;s build something.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <a
          href="mailto:jinghuang809@gmail.com"
          className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 text-bg transition-transform hover:-translate-y-0.5"
        >
          jinghuang809@gmail.com
        </a>
      </Reveal>

      <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {LINKS.map((l, i) => (
          <Reveal key={l.label} delay={i * 0.05} className="bg-bg">
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              data-cursor
              className="group block p-6 transition-colors hover:text-accent"
            >
              <div className="mono-label mb-2">{l.label}</div>
              <div className="text-sm text-muted group-hover:text-accent">
                {l.note}
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <footer className="mono-label mt-24 border-t border-line pt-6">
        © {new Date().getFullYear()} Jing Huang · Newark, NJ
      </footer>
    </section>
  );
}

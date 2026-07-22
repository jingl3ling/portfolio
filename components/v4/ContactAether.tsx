import dynamic from "next/dynamic";
import Reveal from "@/components/Reveal";

// WebGL canvas, only needed once the contact band scrolls into view
const ShaderBackground = dynamic(() => import("@/components/v4/ShaderBackground"), {
  ssr: false,
});

const LINKS = [
  { label: "Email", href: "mailto:jinghuang809@gmail.com", note: "jinghuang809@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jinghuang2022/", note: "→ Jing Huang" },
  { label: "GitHub", href: "https://github.com/jingl3ling", note: "→ jingl3ling" },
  { label: "Resume", href: "/Resume.pdf", note: "→ Resume" },
];

export default function ContactAether() {
  return (
    <section id="contact">
      {/* tall title band with the aurora shader background */}
      <div className="relative flex min-h-[70vh] items-end overflow-hidden">
        <ShaderBackground />
        <div className="wrap relative z-10 pb-14">
          <Reveal>
            <p className="mono-label mb-6">Contact</p>
            <h2 className="display text-[clamp(3rem,10vw,7rem)]">
              Let&apos;s build something.
            </h2>
          </Reveal>
        </div>
      </div>

      {/* email + links + footer stay on black */}
      <div className="wrap py-16 md:py-20">
        <Reveal className="text-center">
          <a
            href="mailto:jinghuang809@gmail.com"
            style={{ color: "#000" }}
            className="inline-block rounded-full bg-ink px-7 py-3.5 transition-transform hover:-translate-y-0.5"
          >
            jinghuang809@gmail.com
          </a>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map((l, i) => (
            <Reveal key={l.label} delay={i * 0.05} className="bg-[#06070b]">
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-cursor
                className="group block p-6 transition-colors hover:text-accent"
              >
                <div className="mono-label mb-2">{l.label}</div>
                <div className="text-sm text-muted group-hover:text-accent">{l.note}</div>
              </a>
            </Reveal>
          ))}
        </div>

        <footer className="mono-label mt-20 border-t border-line pt-6">
          © {new Date().getFullYear()} Jing Huang · Newark, NJ
        </footer>
      </div>
    </section>
  );
}

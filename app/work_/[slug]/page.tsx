import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProject } from "@/lib/projects";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return {
    title: `${project.title} — Jing Huang`,
    description: project.tagline,
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const trackLabel = project.track === "technical" ? "Technical" : "Venture";

  return (
    <main className="wrap pt-32 pb-32 md:pt-40">
      <Reveal>
        <Link
          href="/#work"
          data-cursor
          className="mono-label transition-colors hover:text-accent"
        >
          ← Back to work
        </Link>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mono-label mt-10 flex flex-wrap gap-x-4 gap-y-1">
          <span>{trackLabel}</span>
          <span>· {project.year}</span>
          {project.role && <span>· {project.role}</span>}
        </div>
        <h1 className="display mt-4 max-w-[16ch] text-[clamp(2.4rem,7vw,5.5rem)]">
          {project.title}
        </h1>
        {project.award && (
          <p className="mono-label mt-4 text-accent">★ {project.award}</p>
        )}
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">
          {project.tagline}
        </p>
      </Reveal>

      {project.links && project.links.length > 0 && (
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                data-cursor
                className="rounded-full border border-line px-5 py-2 text-sm transition-colors hover:border-ink hover:text-accent"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </Reveal>
      )}

      {/* media placeholder — swap for real screenshots / video / diagram */}
      <Reveal delay={0.1}>
        <div className="mt-14 flex aspect-[16/9] w-full items-center justify-center border border-line bg-[color-mix(in_srgb,var(--accent)_5%,white)]">
          <span className="mono-label">Media coming soon</span>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-14 md:grid-cols-[2fr_1fr]">
        <div>
          <Reveal>
            <h2 className="mono-label mb-4">Overview</h2>
            <p className="max-w-2xl text-lg leading-relaxed">{project.overview}</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mono-label mb-4 mt-14">Highlights</h2>
            <ul className="max-w-2xl space-y-4">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-4 border-t border-line pt-4">
                  <span className="mono-label text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed text-muted">{h}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <aside>
          <Reveal>
            <h2 className="mono-label mb-4">Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line px-3 py-1 text-sm text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>

          {project.attribution && (
            <Reveal delay={0.05}>
              <h2 className="mono-label mb-3 mt-12">Attribution</h2>
              <p className="text-sm leading-relaxed text-muted">
                {project.attribution}
              </p>
            </Reveal>
          )}
        </aside>
      </div>
    </main>
  );
}

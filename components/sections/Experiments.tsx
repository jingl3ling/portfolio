import Reveal from "@/components/Reveal";
import { experiments, type Experiment } from "@/lib/projects";

export default function Experiments() {
  return (
    <section className="wrap py-24 md:py-32">
      <Reveal>
        <p className="mono-label mb-10">Experiments &amp; creative</p>
      </Reveal>
      <div className="grid gap-8 md:grid-cols-3">
        {experiments.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.06}>
            {e.href ? (
              <a
                href={e.href}
                target="_blank"
                rel="noreferrer"
                data-cursor
                className="group block h-full border-t border-line pt-5 transition-colors hover:border-ink"
              >
                <ExperimentBody
                  title={e.title}
                  year={e.year}
                  blurb={e.blurb}
                  kind={e.kind}
                  image={e.image}
                  audio={e.audio}
                  link
                />
              </a>
            ) : (
              <div className="h-full border-t border-line pt-5">
                <ExperimentBody
                  title={e.title}
                  year={e.year}
                  blurb={e.blurb}
                  kind={e.kind}
                  image={e.image}
                  audio={e.audio}
                />
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ExperimentBody({
  title,
  year,
  blurb,
  kind,
  image,
  audio,
  link,
}: {
  title: string;
  year: string;
  blurb: string;
  kind?: Experiment["kind"];
  image?: string;
  audio?: string;
  link?: boolean;
}) {
  return (
    <>
      {kind === "painting" && (
        <div
          className="mb-4 flex aspect-[4/5] items-center justify-center overflow-hidden border border-line bg-cover bg-center"
          style={
            image
              ? { backgroundImage: `url(${image})` }
              : { backgroundColor: "color-mix(in srgb, var(--accent) 6%, white)" }
          }
        >
          {!image && <span className="mono-label">Painting</span>}
        </div>
      )}
      <div className="mono-label mb-3">{year}</div>
      <h3 className="font-display text-xl transition-colors group-hover:text-accent">
        {title}
        {link && <span className="text-accent"> ↗</span>}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{blurb}</p>
      {kind === "music" && (
        <audio controls className="mt-4 w-full" src={audio}>
          Your browser doesn&apos;t support audio playback.
        </audio>
      )}
    </>
  );
}

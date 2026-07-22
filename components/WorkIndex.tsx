import Link from "next/link";
import Reveal from "@/components/Reveal";
import { projects, type Track } from "@/lib/projects";

const GROUPS: { key: Track; label: string }[] = [
  { key: "technical", label: "Technical" },
  { key: "venture", label: "Entrepreneurship" },
];

export default function WorkIndex({ basePath = "/work" }: { basePath?: string }) {
  return (
    <div>
      {GROUPS.map((g) => {
        const list = projects.filter((p) => p.track === g.key);
        if (list.length === 0) return null;

        return (
          <div key={g.key} className="mb-16 last:mb-0">
            <Reveal>
              <p className="mono-label mb-10">{g.label}</p>
            </Reveal>

            <div className="border-t border-line">
              {list.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.04}>
                  <Link
                    href={`${basePath}/${p.slug}`}
                    data-cursor
                    className="group flex flex-col gap-5 border-b border-line py-8 md:flex-row md:items-center md:gap-8"
                  >
                    <span className="mono-label md:w-8 md:self-start md:pt-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* PLACEHOLDER — set project.image to a /public path to replace */}
                    <div className="w-full shrink-0 md:w-64">
                      <div
                        className="flex aspect-[16/10] items-center justify-center overflow-hidden border border-line bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
                        style={
                          p.thumbnail
                            ? { backgroundImage: `url(${p.thumbnail})` }
                            : {
                                backgroundColor:
                                  "color-mix(in srgb, var(--accent) 6%, white)",
                              }
                        }
                      >
                        {!p.thumbnail && <span className="mono-label">Image</span>}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display text-3xl transition-colors group-hover:text-accent md:text-4xl">
                        {p.title}
                      </h3>
                      {p.award && (
                        <p className="mono-label mt-2 text-accent">★ {p.award}</p>
                      )}
                      <p className="mt-2 max-w-xl text-muted">{p.tagline}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="mono-label rounded-full border border-line px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mono-label md:w-24 md:text-right">{p.year}</div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { projects, type Track } from "@/lib/projects";

const TABS: { key: Track; label: string }[] = [
  { key: "technical", label: "Technical" },
  { key: "venture", label: "Ventures" },
];

export default function WorkIndex({ basePath = "/work" }: { basePath?: string }) {
  const [track, setTrack] = useState<Track>("technical");
  const reduced = useReducedMotion();
  const list = projects.filter((p) => p.track === track);

  return (
    <div>
      <div className="mb-10 flex gap-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTrack(t.key)}
            aria-pressed={track === t.key}
            className={`rounded-full px-7 py-2.5 text-base font-medium transition-colors ${
              track === t.key
                ? "bg-ink text-bg"
                : "border border-line hover:border-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="border-t border-line">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.slug}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{
                duration: 0.4,
                delay: reduced ? 0 : i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

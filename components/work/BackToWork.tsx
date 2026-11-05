"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import s from "./BackToWork.module.css";

/**
 * Pinned under the nav's name in the top-left corner on every case study.
 * Goes back to wherever you came from: the journey's planet for this project
 * (/#<slug>, the default) or the explore map focused on it (/explore#<slug>,
 * when the case study was opened with ?from=explore). Colors come from the
 * route's theme tokens (--accent, --bg, --line set by ImmersiveTheme), so it
 * matches each project's style.
 */
function BackLink({ slug }: { slug: string }) {
  const fromExplore = useSearchParams().get("from") === "explore";
  return <Pill href={fromExplore ? `/explore#${slug}` : `/#${slug}`} label={fromExplore ? "Return to explore" : "Return to journey"} />;
}

function Pill({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} data-cursor className={s.link}>
      <span aria-hidden>←</span> {label}
    </Link>
  );
}

export default function BackToWork({ slug }: { slug: string }) {
  return (
    <div className={s.bar}>
      <div className="wrap">
        {/* useSearchParams needs a Suspense boundary to keep the page prerendered */}
        <Suspense fallback={<Pill href={`/#${slug}`} label="Return to journey" />}>
          <BackLink slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}

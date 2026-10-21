import Link from "next/link";
import s from "./BackToWork.module.css";

/**
 * "← Back to work", pinned under the nav's name in the top-left corner on
 * every case study. Colors come from the route's theme tokens (--accent,
 * --bg, --line set by ImmersiveTheme), so it matches each project's style.
 */
export default function BackToWork() {
  return (
    <div className={s.bar}>
      <div className="wrap">
        <Link href="/#work" data-cursor className={s.link}>
          <span aria-hidden>←</span> Back to work
        </Link>
      </div>
    </div>
  );
}

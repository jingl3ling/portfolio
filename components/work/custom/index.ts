import type { ComponentType } from "react";
import type { Project } from "@/lib/projects";
import HackclawPage from "./hackclaw/HackclawPage";
import HermesdayPage from "./hermesday/HermesdayPage";

/**
 * Case studies with their own bespoke design, keyed by project slug.
 * /work/[slug] renders the component here when one exists and falls back to
 * the shared template otherwise. To give a project its own style, add a
 * folder next to hermesday/ (page component + its own CSS module) and
 * register it below; the project's data still lives in lib/projects.ts.
 */
export const customPages: Record<string, ComponentType<{ project: Project }>> = {
  hermesday: HermesdayPage,
  "openclaw-agent-team": HackclawPage,
};

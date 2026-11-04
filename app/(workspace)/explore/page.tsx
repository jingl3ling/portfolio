import type { Metadata } from "next";
import ExploreLoader from "@/components/workspace/explore/ExploreLoader";

export const metadata: Metadata = {
  title: "Explore my work universe — Jing Huang",
  description:
    "An interactive map of Jing Huang's projects as a solar system — drag to orbit, click a planet to fly to it.",
};

export default function ExplorePage() {
  return <ExploreLoader />;
}

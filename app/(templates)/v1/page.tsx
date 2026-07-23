import Hero from "@/components/templates/sections/Hero";
import About from "@/components/templates/sections/About";
import WhatIBuild from "@/components/templates/sections/WhatIBuild";
import Experiments from "@/components/sections/Experiments";
import Contact from "@/components/templates/sections/Contact";
import SignalLine from "@/components/templates/SignalLine";
import WorkIndex from "@/components/WorkIndex";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <SignalLine />

      <section id="work" className="wrap py-24 md:py-32">
        <Reveal>
          <div className="mb-12 flex items-end justify-between gap-4">
            <h2 className="display text-[clamp(2rem,6vw,4rem)]">Selected Work</h2>
            <span className="mono-label hidden sm:block">switch tracks →</span>
          </div>
        </Reveal>
        <WorkIndex />
      </section>

      <WhatIBuild />
      <SignalLine />
      <Experiments />
      <SignalLine />
      <Contact />
    </main>
  );
}

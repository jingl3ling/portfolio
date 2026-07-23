import ImmersiveTheme from "@/components/ImmersiveTheme";
import PixelCluster from "@/components/workspace/PixelCluster";

export default function TestPixelClusterPage() {
  return (
    <>
      <ImmersiveTheme accent="#8ec5ff" bg="#05060a" />
      <main className="relative min-h-screen">
        <div className="wrap pointer-events-none absolute inset-x-0 top-28 z-10">
          <p className="mono-label mb-2">Test — pixel art</p>
          <h1 className="display text-[clamp(1.8rem,4vw,3rem)]">Pixel Cluster</h1>
          <p className="mt-3 max-w-md text-sm text-muted">
            A tiny 96×54 canvas scaled up with hard pixel edges instead of a
            smooth blur — inspired by the galaxy model&apos;s looping-animation
            bug, where the point cloud kept snapping back to a blinking white
            cluster. Same charm, on purpose this time.
          </p>
        </div>

        <div className="fixed inset-0 -z-0">
          <PixelCluster />
        </div>
      </main>
    </>
  );
}

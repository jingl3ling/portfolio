import ImmersiveTheme from "@/components/ImmersiveTheme";

export default function TestSaturnModelPage() {
  return (
    <>
      <ImmersiveTheme accent="#8ec5ff" bg="#05060a" />
      <main className="wrap pt-32 pb-32 md:pt-40">
        <p className="mono-label mb-2">Test — Sketchfab embed (not a downloaded file)</p>
        <h1 className="display text-[clamp(1.8rem,4vw,3rem)]">Saturn&apos;s Rings</h1>
        <p className="mt-3 max-w-md text-sm text-muted">
          Embedded straight from Sketchfab&apos;s own viewer via iframe, instead of
          downloading and self-hosting a glTF like the other two tests. No file
          size or compression to manage on our end, but it depends on
          Sketchfab staying up and loads their full player UI.
        </p>

        <div className="mt-14 aspect-[16/9] w-full overflow-hidden border border-line">
          <iframe
            title="What are Saturn's ring made of?"
            className="h-full w-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/0ee8157b24474555ae0de635793d337c/embed"
          />
        </div>

        <p className="mono-label mt-4 text-[11px] text-muted">
          <a
            href="https://sketchfab.com/3d-models/what-are-saturns-ring-made-of-0ee8157b24474555ae0de635793d337c?utm_medium=embed&utm_campaign=share-popup&utm_content=0ee8157b24474555ae0de635793d337c"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            What are Saturn&apos;s ring made of?
          </a>{" "}
          by{" "}
          <a
            href="https://sketchfab.com/sorlando?utm_medium=embed&utm_campaign=share-popup&utm_content=0ee8157b24474555ae0de635793d337c"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            Salvatore Orlando
          </a>{" "}
          on{" "}
          <a
            href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=0ee8157b24474555ae0de635793d337c"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            Sketchfab
          </a>
        </p>
      </main>
    </>
  );
}

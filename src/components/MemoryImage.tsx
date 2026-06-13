import { useSignedImage } from "@/lib/site";

export function MemoryImage({
  path,
  alt,
}: {
  path: string | null;
  alt: string;
}) {
  const url = useSignedImage(path);
  if (!path) {
    return (
      <div className="flex aspect-[3/2] items-center justify-center bg-[oklch(0.93_0.025_40)] text-[color:var(--muted-foreground)]">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
          <path d="M3 6h18v12H3z M3 16l5-5 4 4 3-3 6 6"/>
          <circle cx="8" cy="9" r="1.5"/>
        </svg>
      </div>
    );
  }
  if (!url) {
    return <div className="aspect-[3/2] animate-pulse bg-[oklch(0.93_0.025_40)]" />;
  }
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      className="aspect-[3/2] w-full object-cover"
    />
  );
}
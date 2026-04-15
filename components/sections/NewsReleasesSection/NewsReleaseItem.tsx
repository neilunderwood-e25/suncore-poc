import type { NewsRelease } from "@/lib/sections/types";

type NewsReleaseItemProps = {
  release: NewsRelease;
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = Math.round(bytes / 1024);
  if (kb < 1024) return `${kb} KB`;
  const mb = (bytes / (1024 * 1024)).toFixed(1);
  return `${mb} MB`;
}

function getTypeLabel(release: NewsRelease): string {
  if (release.pdfDocument?.url) {
    const parts = ["PDF"];
    if (release.pageCount && release.pageCount > 0) {
      parts.push(`${release.pageCount} page${release.pageCount > 1 ? "s" : ""}`);
    }
    if (release.pdfDocument.size) {
      parts.push(formatFileSize(release.pdfDocument.size));
    }
    return `(${parts.join(", ")})`;
  }
  if (release.externalUrl) {
    return "External website";
  }
  return "";
}

function getReleaseHref(release: NewsRelease): string | null {
  if (release.pdfDocument?.url) return release.pdfDocument.url;
  if (release.externalUrl) return release.externalUrl;
  return null;
}

export function NewsReleaseItem({ release }: NewsReleaseItemProps) {
  const href = getReleaseHref(release);
  const typeLabel = getTypeLabel(release);

  return (
    <article className="border-b border-light-grey px-4 py-5">
      {release.releaseDate && (
        <time
          dateTime={release.releaseDate}
          className="mb-1 block text-xs text-dark-grey-70"
        >
          {formatDate(release.releaseDate)}
        </time>
      )}

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <h3 className="text-sm font-bold leading-snug text-midnight transition-colors group-hover:text-dusty-blue">
            {release.title}
          </h3>
        </a>
      ) : (
        <h3 className="text-sm font-bold leading-snug text-midnight">
          {release.title}
        </h3>
      )}

      {typeLabel && (
        <p className="mt-1 text-xs text-dark-grey-70">{typeLabel}</p>
      )}
    </article>
  );
}

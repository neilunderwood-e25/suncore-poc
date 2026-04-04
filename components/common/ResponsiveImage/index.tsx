import type { ImageEntry } from "@/lib/sections/types";

type ResponsiveImageProps = {
  image: ImageEntry;
  className?: string;
};

export function ResponsiveImage({ image, className }: ResponsiveImageProps) {
  if (!image.desktop?.url) return null;

  return (
    <picture>
      {image.mobile?.url && (
        <source media="(max-width: 767px)" srcSet={image.mobile.url} />
      )}
      <img
        src={image.desktop.url}
        alt={image.altText ?? ""}
        width={image.desktop.width ?? undefined}
        height={image.desktop.height ?? undefined}
        className={className}
      />
    </picture>
  );
}

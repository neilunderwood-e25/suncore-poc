import type { VideoEntry } from "@/lib/sections/types";

type ResponsiveVideoProps = {
  video: VideoEntry;
  className?: string;
};

export function ResponsiveVideo({ video, className }: ResponsiveVideoProps) {
  if (!video.desktop?.url) return null;

  const autoplay = video.autoplay ?? false;
  const loop = video.loop ?? false;
  const muted = video.muted ?? autoplay; // muted defaults to true when autoplay is on

  return (
    <video
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      playsInline={autoplay}
      controls={!autoplay}
      poster={video.posterImage?.url ?? undefined}
      aria-label={video.altText ?? undefined}
      className={className}
    >
      {/* Mobile source — smaller viewport */}
      {video.mobile?.url && (
        <source
          src={video.mobile.url}
          type={video.mobile.contentType ?? "video/mp4"}
          media="(max-width: 767px)"
        />
      )}

      {/* Desktop source */}
      <source
        src={video.desktop.url}
        type={video.desktop.contentType ?? "video/mp4"}
      />

      {video.altText ?? "Your browser does not support the video tag."}
    </video>
  );
}

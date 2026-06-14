"use client";

import MuxVideo from "@mux/mux-video-react";

// Mux playback ID from the next-video asset in /videos (get-started.mp4.json).
// Swap this for the real MVP Bullies clip's playback ID when ready.
const PLAYBACK_ID = "sxY31L6Opl02RWPpm3Gro9XTe7fRHBjs92x93kiB1vpc";

/**
 * Full-bleed, muted, looping Mux video used as the hero background.
 * Sits behind the hero content; non-interactive.
 */
export function HeroVideo() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <MuxVideo
        playbackId={PLAYBACK_ID}
        streamType="on-demand"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={`https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.4,
        }}
      />
    </div>
  );
}

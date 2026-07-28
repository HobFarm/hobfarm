import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { providers } from "../../data/providers";
import type { ProviderInfo } from "../../data/providers";

type MediaType = "image" | "video";

interface LightboxState {
  src: string;
  type: MediaType;
  providerSlug?: string;
  caption?: string;
  alt?: string;
  group?: string;
  index: number;
  total: number;
}

function resolveProvider(slug?: string): ProviderInfo | undefined {
  if (!slug) return undefined;
  return providers[slug] || undefined;
}

function findTargetMedia(
  target: HTMLElement
): HTMLImageElement | HTMLVideoElement | null {
  if (target instanceof HTMLImageElement || target instanceof HTMLVideoElement) {
    return target;
  }

  return target.querySelector<HTMLImageElement | HTMLVideoElement>("img, video");
}

function resolveTargetSource(target: HTMLElement): string {
  const explicitSource = target.dataset.lightbox?.trim();
  if (explicitSource) return explicitSource;

  const media = findTargetMedia(target);
  return media?.currentSrc || media?.src || "";
}

function resolveTargetAlt(target: HTMLElement): string | undefined {
  const explicitAlt = target.dataset.lightboxAlt?.trim();
  if (explicitAlt) return explicitAlt;

  const media = findTargetMedia(target);
  return media instanceof HTMLImageElement ? media.alt : undefined;
}

export default function Lightbox() {
  const [data, setData] = useState<LightboxState | null>(null);
  const allTargets = useRef<HTMLElement[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const close = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
    }
    setData(null);
  }, []);

  const collectTargets = useCallback((group?: string) => {
    allTargets.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-lightbox]")
    ).filter((target) => {
      const targetGroup = target.dataset.lightboxGroup;
      return group ? targetGroup === group : !targetGroup;
    });
  }, []);

  const openAt = useCallback((index: number, group?: string) => {
    collectTargets(group);
    const targets = allTargets.current;
    if (targets.length === 0) return;
    const idx = ((index % targets.length) + targets.length) % targets.length;
    const el = targets[idx];
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
    }
    const src = resolveTargetSource(el);
    if (!src) return;

    setData({
      src,
      type: (el.dataset.lightboxType as MediaType) || "image",
      providerSlug: el.dataset.lightboxProvider,
      caption: el.dataset.lightboxCaption,
      alt: resolveTargetAlt(el),
      group,
      index: idx,
      total: targets.length,
    });
  }, [collectTargets]);

  const navigate = useCallback(
    (direction: 1 | -1) => {
      if (!data) return;
      openAt(data.index + direction, data.group);
    },
    [data, openAt]
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("[data-lightbox]") as HTMLElement | null;
      if (target) {
        e.preventDefault();
        const group = target.dataset.lightboxGroup;
        collectTargets(group);
        const idx = allTargets.current.indexOf(target);
        openAt(idx >= 0 ? idx : 0, group);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        navigate(1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        navigate(-1);
      }
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [close, navigate, collectTargets, openAt]);

  useEffect(() => {
    if (data?.type !== "video" || !videoRef.current) return;
    videoRef.current.defaultMuted = true;
    videoRef.current.muted = true;
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [data]);

  if (!data) return null;

  const providerInfo = resolveProvider(data.providerSlug);
  const isWebUi = providerInfo?.webui === true;

  const overlay = (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-base-950/95 backdrop-blur-sm"
      onClick={close}
    >
      {/* Navigation Arrows */}
      {data.total > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-base-900/60 hover:bg-base-800 text-base-400 hover:text-white transition-colors border border-base-800/50"
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-base-900/60 hover:bg-base-800 text-base-400 hover:text-white transition-colors border border-base-800/50"
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </>
      )}

      {/* Media Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12 overflow-hidden">
        {data.type === "video" ? (
          <video
            ref={videoRef}
            key={data.src}
            src={data.src}
            className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-sm"
            controls
            autoPlay
            muted
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img
            src={data.src}
            alt={data.alt || "Fullscreen image"}
            className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {/* Footer */}
      <div
        className="w-full bg-base-900/80 border-t border-base-800 px-4 py-3 md:px-8 md:py-4 cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Provider Badge */}
          <div className="flex items-center gap-3">
            {providerInfo && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: providerInfo.color }}
                />
                <span className="text-sm font-mono text-white">{providerInfo.name}</span>
                {isWebUi && (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 uppercase tracking-wider">
                    Web UI
                  </span>
                )}
              </div>
            )}
            {!providerInfo && data.providerSlug && (
              <span className="text-sm font-mono text-base-300">{data.providerSlug}</span>
            )}
          </div>

          {/* Description + Counter */}
          <div className="flex items-center gap-4">
            {providerInfo && (
              <span className="text-xs text-base-400 hidden sm:inline">{providerInfo.description}</span>
            )}
            {data.total > 1 && (
              <span className="text-xs font-mono text-base-500">
                {data.index + 1} / {data.total}
              </span>
            )}
          </div>
        </div>

        {data.caption && (
          <p className="text-base-400 font-serif italic text-xs md:text-sm max-w-3xl mx-auto text-center mt-2">
            "{data.caption}"
          </p>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={close}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-base-900/50 hover:bg-base-800 text-base-400 hover:text-white transition-colors border border-base-800/50"
        aria-label="Close Lightbox"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  );

  return createPortal(overlay, document.body);
}

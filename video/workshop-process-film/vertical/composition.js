(() => {
  const root = document.querySelector("[data-composition-id]");
  const manifest = window.WORKSHOP_PROCESS_FILM;
  const variant = root.dataset.variant;
  const compositionId = root.dataset.compositionId;
  const totalDuration = manifest.variants[variant].duration;

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const cropClass = (crop) => crop || "cover";
  const renderSrc = (src) => {
    if (src.endsWith("/psygoth/zima-primary.mp4")) return "assets/zima-primary.mp4";
    if (src.endsWith("/psygoth/zima-primary.webp")) return "assets/zima-primary.webp";
    if (src.endsWith("/stills/psygoth-zima-blue-v2.png")) return "assets/psygoth-zima-blue-v2.png";
    return src;
  };
  const stageNumber = (index) => String(index + 1).padStart(2, "0");
  const meter = (index) => manifest.stages
    .map((_, meterIndex) => {
      const state = meterIndex < index ? "is-complete" : meterIndex === index ? "is-current" : "";
      return `<i class="${state}"></i>`;
    })
    .join("");

  root.classList.add(`variant-${variant}`);
  root.innerHTML = manifest.stages.map((stage, index) => {
    const timing = stage.timing[variant];
    const main = stage.media.find((item) => item.role === "main" || item.role === "video");
    const reference = stage.media.find((item) => item.role === "reference");
    const isVideo = main.role === "video";
    const mediaElement = isVideo
      ? `<div class="avatar-sequence" data-start="${timing.start}" data-duration="${timing.duration}" data-track-index="0" role="img" aria-label="${escapeHtml(main.alt)}">${Array.from({ length: 10 }, (_, frameIndex) => `<img src="assets/zima-avatar-frame-${String(frameIndex + 1).padStart(2, "0")}.jpg" alt="">`).join("")}</div>`
      : `<img src="${escapeHtml(renderSrc(main.src))}" alt="${escapeHtml(main.alt)}">`;
    const endCopy = index === manifest.stages.length - 1
      ? `<p class="scene__end anim" data-layout-allow-overlap data-layout-allow-occlusion><span>One stable character.</span> Sheets, outfits, scenes, avatars, stories, and products.</p><div class="scene__resolve" data-layout-allow-occlusion></div>`
      : "";

    return `
      <section class="scene" data-scene="${index}" data-crop="${escapeHtml(cropClass(main.crop))}" data-layout-allow-occlusion aria-label="Stage ${index + 1}: ${escapeHtml(stage.label)}">
        <div class="scene__inner">
          <div class="scene__glow scene__glow--one" data-layout-allow-overflow></div>
          <div class="scene__glow scene__glow--two" data-layout-allow-overflow></div>
          <div class="scene__number" data-layout-allow-occlusion>${stageNumber(index)}</div>
          <header class="scene__topbar anim">
            <span>HobFarm / Workshop process</span>
            <strong>${stageNumber(index)} / 06</strong>
          </header>
          <div class="scene__grid">
            <div class="scene__copy">
              <p class="scene__kicker anim">${escapeHtml(stage.label)}</p>
              <h2 class="scene__headline anim">${escapeHtml(stage.headline)}</h2>
              <p class="scene__explanation anim">${escapeHtml(stage.explanation)}</p>
              <p class="scene__direction anim">${escapeHtml(stage.shotDirection)}</p>
            </div>
            <div class="scene__media anim">
              <div class="scene__media-viewport" data-layout-allow-overflow>${mediaElement}</div>
              <p class="scene__media-label">${isVideo ? "Blue gives the system structure, distance, and atmosphere." : escapeHtml(main.alt)}</p>
              <aside class="scene__reference anim">
                <img src="${escapeHtml(renderSrc(reference.src))}" alt="">
                <span><strong>Reference</strong>${escapeHtml(reference.alt)}</span>
              </aside>
            </div>
            <div class="scene__rules anim">
              <div class="scene__rule"><strong>Locked</strong>${escapeHtml(stage.locked.join(" / "))}</div>
              <div class="scene__rule scene__rule--variable"><strong>Variable</strong>${escapeHtml(stage.variable.join(" / "))}</div>
            </div>
          </div>
          <footer class="scene__footer anim">
            <span>Identity-preserve / Zima</span>
            <span class="stage-meter">${meter(index)}</span>
          </footer>
          ${endCopy}
        </div>
      </section>`;
  }).join("");

  const scenes = [...root.querySelectorAll(".scene")];
  const tl = gsap.timeline({ paused: true, defaults: { overwrite: false } });

  tl.set(scenes, { opacity: 0, zIndex: 1 }, 0);
  tl.set(scenes[0], { opacity: 1, zIndex: 2 }, 0);
  tl.set(root.querySelectorAll(".anim"), { opacity: 0 }, 0);

  scenes.forEach((scene, index) => {
    const stage = manifest.stages[index];
    const timing = stage.timing[variant];
    const start = timing.start;
    const duration = timing.duration;
    const mediaViewport = scene.querySelector(".scene__media-viewport");
    const media = scene.querySelector(".scene__media img, .scene__media video, .avatar-sequence");

    if (index > 0) {
      const transitionStart = Math.max(start - 0.52, 0);
      const revealFrom = index === 4
        ? { clipPath: "circle(0% at 54% 48%)", filter: "blur(0px)" }
        : index === 5
          ? { clipPath: "inset(0 0 0 0)", filter: "blur(22px)", scale: 1.035 }
          : { clipPath: index % 2 ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)", filter: "blur(0px)" };
      const revealTo = { clipPath: "inset(0 0 0 0)", filter: "blur(0px)", scale: 1 };

      tl.set(scene, { opacity: 1, zIndex: index + 2 }, transitionStart);
      tl.fromTo(scene, revealFrom, { ...revealTo, duration: 0.52, ease: "power3.inOut" }, transitionStart);
      tl.set(scenes[index - 1], { opacity: 0 }, start + 0.02);
    }

    tl.fromTo(scene.querySelector(".scene__topbar"),
      { opacity: 0, y: -28 },
      { opacity: 1, y: 0, duration: 0.48, ease: "power2.out" }, start + 0.08);
    tl.fromTo(scene.querySelector(".scene__kicker"),
      { opacity: 0, x: -46 },
      { opacity: 1, x: 0, duration: 0.5, ease: "expo.out" }, start + 0.14);
    tl.fromTo(scene.querySelector(".scene__headline"),
      { opacity: 0, y: 58 },
      { opacity: 1, y: 0, duration: 0.68, ease: "power4.out" }, start + 0.2);
    tl.fromTo(scene.querySelector(".scene__explanation"),
      { opacity: 0, y: 34 },
      { opacity: 1, y: 0, duration: 0.58, ease: "power2.out" }, start + 0.36);
    tl.fromTo(scene.querySelector(".scene__direction"),
      { opacity: 0, x: -32 },
      { opacity: 1, x: 0, duration: 0.55, ease: "back.out(1.1)" }, start + 0.48);
    tl.fromTo(scene.querySelector(".scene__media"),
      { opacity: 0, x: variant === "wide" ? 72 : 0, y: variant === "vertical" ? 62 : 0, scale: 0.965 },
      { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.72, ease: "power3.out" }, start + 0.24);
    tl.fromTo(scene.querySelector(".scene__reference"),
      { opacity: 0, x: 36, y: 22 },
      { opacity: 1, x: 0, y: 0, duration: 0.52, ease: "back.out(1.35)" }, start + 0.62);
    tl.fromTo(scene.querySelector(".scene__rules"),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.52, ease: "power2.out" }, start + 0.72);
    tl.fromTo(scene.querySelector(".scene__footer"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.46, ease: "sine.out" }, start + 0.84);

    tl.fromTo(mediaViewport,
      { scale: 1.035, xPercent: index % 2 ? 1.4 : -1.4 },
      { scale: 1.095, xPercent: index % 2 ? -1.2 : 1.2, duration: Math.max(duration - 0.2, 0.5), ease: "none" }, start + 0.12);
    tl.fromTo(scene.querySelector(".scene__glow--one"),
      { x: -18, y: 12, scale: 0.96 },
      { x: 20, y: -14, scale: 1.04, duration: duration, ease: "sine.inOut" }, start);
    tl.fromTo(scene.querySelector(".scene__glow--two"),
      { x: 16, y: -10, scale: 1.03 },
      { x: -14, y: 13, scale: 0.97, duration: duration, ease: "sine.inOut" }, start);

    const avatarFrames = [...scene.querySelectorAll(".avatar-sequence img")];
    if (avatarFrames.length) {
      const frameStep = Math.max(duration - 0.3, 0.5) / avatarFrames.length;
      avatarFrames.forEach((frame, frameIndex) => {
        tl.set(frame, { opacity: 1 }, start + 0.12 + frameIndex * frameStep);
        if (frameIndex > 0) {
          tl.set(avatarFrames[frameIndex - 1], { opacity: 0 }, start + 0.12 + frameIndex * frameStep);
        }
      });
    }

    const end = scene.querySelector(".scene__end");
    if (end) {
      tl.fromTo(scene.querySelector(".scene__resolve"),
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: "power2.out" }, totalDuration - 1.45);
      tl.fromTo(end,
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.68, ease: "power3.out" }, totalDuration - 1.25);
    }
  });

  tl.to({}, { duration: Math.max(0, totalDuration - tl.duration()) });
  window.__processTimeline = tl;
  root.dataset.timelineReady = compositionId;
})();

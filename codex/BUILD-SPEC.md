# Codex build specification: California Used to Race Here

> Workflow update: HobFarm now uses `main` as its only working and publishing
> branch. Any older branch language in this completed task record is superseded
> by `AGENTS.md`.

## Status

This is the approved second-round implementation task for the HobFarm article package begun under `reports/california-racing/`.

The first preparation round is already complete. Preserve it.

Verified prior work:

- 18 normalized source images were uploaded and checksum-verified under `https://cdn.hob.farm/articles/california-racing/`.
- `reports/california-racing/README.md` and `reports/california-racing/upload-manifest.json` record the research handoff, rights decisions, object keys, checksums, and public verification.
- Three Coachella Valley Water District images were approved by the user for limited editorial fair use in the Plank Road comparison, with nearby CVWD credit.
- `ArticleLayout.astro` now contains a mixed-aspect, uncropped `.article-archive-viewer` treatment.
- Metadata scans, the unverified 1943 Gilmore advertisement, and the copyrighted *Xanadu* poster remain off the CDN.
- `npm run build`, `npx astro check`, and `npm test` passed after the first round.
- No production deployment occurred.

Do not redo, overwrite, or casually broaden those decisions. Inspect the current repository evidence before changing anything.

## Goal

Build a production-ready local HobFarm article at the repository-valid route for:

**California Used to Race Here**

Deck:

**The wooden roads, vanished speedways, movie locations, and car cultures buried beneath Southern California’s studios, malls, condos, warehouses, and parking lots.**

The finished page should operate as a long visual magazine feature and as the pilot for a future place-history format tentatively called **Built Over**. Do not create a new top-level site department solely for this article. Use the current `Magazine Time Machine` taxonomy unless the live repository proves a better existing fit.

The article should be readable, funny, documentary, image-rich, and grounded. Real photographs, maps, films, and archival evidence carry the package. Original diagrams explain chronology, geography, and mechanism. AI-generated imagery is not required and should not displace documentary material.

## Supplied package

Treat the following as the editorial handoff:

```text
article/california-used-to-race-here.md
editorial/VISUAL-PLAN.md
editorial/SOCIAL-BRANCHES.md
data/source-ledger.csv
data/track-ledger.json
data/timeline.json
data/fact-check-queue.csv
data/image-acquisition-shortlist.csv
data/asset-manifest.json
```

Also treat the existing repository files as source of truth:

```text
reports/california-racing/README.md
reports/california-racing/upload-manifest.json
reports/california-racing/source-asset-manifest.json
src/layouts/ArticleLayout.astro
```

The article draft contains media-slot comments and publication receipts. Adapt its working frontmatter to the real article schema. Preserve its thesis, first-person engine, distinctions, and source notes. Edit for repository style and verified evidence, not toward generic tourism copy.

## Hard boundaries

You are authorized to:

- inspect the repository and current HobFarm instructions;
- work directly on `main`;
- create the article in the existing article collection;
- create original SVG, HTML, CSS, and local raster collage assets described below;
- perform the remaining research and fact checks;
- upload a small second set of approved publication assets under the existing `articles/california-racing/` R2 prefix;
- add article-specific components or styles when the existing system cannot express a required visual cleanly;
- run local tests, builds, link checks, media checks, and browser QA;
- commit validated work to `main` and push `origin/main`.

Do not:

- create or leave work on another branch;
- run a direct Cloudflare deployment command;
- delete or overwrite existing R2 objects;
- upload the *Xanadu* poster, metadata scans, private notes, raw prompts, or unverified advertisement;
- treat a search-engine thumbnail as an image source;
- create a parallel article framework;
- add a client-side mapping runtime when a static SVG and HTML list can do the job;
- use unlicensed Google Maps or Google Earth screenshots;
- make the article’s visual identity depend on AI-generated cars, people, or fake historical scenes;
- turn the piece into a partisan California-politics argument.

If the `main` worktree contains unrelated changes that make safe editing
impossible, preserve them and report the exact conflict. Do not create another
branch or worktree.

## Editorial thesis

The article is about a regional machine.

Southern California’s car cultures grew through overlapping physical systems:

- cheap peripheral land;
- roads and dry lakes;
- racetracks;
- aircraft and defense manufacturing;
- garages, machine shops, body shops, and upholstery shops;
- clubs, timing organizations, magazines, and speed shops;
- movie studios and stunt work;
- year-round weather and a population organized around the automobile.

The recurring land cycle is:

```text
cheap edge land
-> experimental public use
-> crowds and supporting businesses
-> surrounding development
-> rising land value
-> demolition or closure
-> culture moves farther out, becomes temporary, or survives through another form
```

Racetracks are the visible historical skeleton. Do not claim that all Southern California car culture descended directly from racing.

Lowriding must retain its own Mexican American, Chicano, Native, borderlands, club, neighborhood, artistic, family, and political history. Present it as a parallel culture sharing regional roads, parts, fabrication skills, and public space, not as a decorative branch of hot rodding.

## Required article arc

1. **Farmers Market discovery**
   - Open with the author learning from a historical sign that Gilmore Stadium once occupied the familiar Third and Fairfax landscape.
   - Establish the narrator as someone who lived around Southern California after most of the major tracks had vanished.

2. **Plank Road prologue**
   - Use the San Diego-to-Yuma route as the prehistory of the automobile region.
   - Keep the Salton Sea material compact and point toward a separate future article.

3. **Board-track era**
   - Playa del Rey, Beverly Hills, and Culver City.
   - Explain the engineering, danger, speed, short operating lives, and land-value cycle.

4. **Third and Fairfax, layer by layer**
   - Dairy farm, oil field, Farmers Market, Gilmore Stadium, Gilmore Field, Gilmore Drive-In, Pan-Pacific Auditorium, Television City, The Grove.
   - State precisely that The Grove did not directly replace Gilmore Stadium. Television City occupies the stadium parcel. The Grove roughly occupies the drive-in parcel.

5. **Gilmore as a flexible public room**
   - Midget racing, football, soccer, cricket, boxing, motorcycles, and other events.
   - Use the racing, sports, empty-grandstand, and demolition photographs.

6. **The postwar machine**
   - Dry lakes, SCTA, *Hot Rod*, NHRA, Lions, OCIR, aircraft skills, garages, speed shops, and the Solar midget as a photographed artifact.

7. **Film archaeology**
   - *The Love Bug* and *Pit Stop* as opposite late-1960s views of the same regional ecosystem.
   - Disney sunshine versus figure-eight collision culture.
   - Treat film frames as evidence of specific places and architecture, not as decorative screenshots.

8. **The land is always worth more later**
   - Riverside, Ontario, Ascot, OCIR, Irwindale.
   - Use verified replacement-use cards without flattening every closure into one cause.

9. **The culture gets out**
   - Hot rods, lowriders, motorcycles, swap meets, parking-lot shows, clubs, and parts networks.
   - Use the author’s San Diego photographs.

10. **Survivors and adaptations**
    - El Mirage, Willow Springs, Paramount Raceway traces, Long Beach as a temporary street circuit.

11. **Coda**
    - Ask what happens when the retail or commercial use that replaced a racetrack becomes obsolete.
    - Keep dead malls as a future article seed rather than allowing them to take over this piece.

## Required factual distinctions

Maintain these distinctions in copy and captions:

- The Grove did not replace Gilmore Stadium.
- Gilmore Stadium’s racing ended in 1950, demolition was photographed in 1951, and Television City opened in 1952.
- Gilmore Field was a separate neighboring baseball park and survived until 1958.
- The Plank Road belongs to the lineage of the San Diego-Imperial-Yuma automobile corridor. Do not describe every section as the exact modern I-8 alignment.
- Board tracks were dangerous and maintenance-heavy. Do not add unsupported claims about oil-soaked boards, smoke exposure, flying splinters, or specific injury mechanics without receipts.
- *The Love Bug* and *Pit Stop* are constructed films whose backgrounds have documentary value. Do not call one “real” and the other “fake.”
- The Solar midget’s existence and museum label can be shown. Production counts and designer details require a stronger source.
- Lowriding is not a direct descendant of organized racing.
- Track closure can involve noise, safety, lease structure, redevelopment, economics, or changing use. Do not use “developers killed it” as a universal explanation.
- Current parcel use and active-track status must be rechecked on the implementation date.

## Personal material approved for use

The author has approved the following first-person facts from the current editorial thread:

- lived in Southern California from 2006 to 2014;
- lived in or around Los Angeles, San Diego, Santa Ana, Corona, and Salton City;
- visited Original Farmers Market many times;
- learned about Gilmore Stadium from historical material at Farmers Market;
- visited the present Pan-Pacific Park before understanding what stood there;
- attended and photographed the 2013 Big 3 Parts Exchange at Qualcomm Stadium;
- photographed vehicles and exhibits at the San Diego Automotive Museum.

Do not add the author’s 1969 Chevrolet van unless the author separately asks for it.

## Source validation

Use `source-ledger.csv` as the starting source map. For every material factual sentence:

1. Open the source.
2. Record the exact passage or evidence in a local source-audit note.
3. Prefer official, archival, museum, government, preservation, or original organization sources.
4. Use secondary synthesis only where it is clearly labeled and appropriate.
5. Narrow the article sentence when the source supports less than the draft claims.
6. Preserve uncertainty where sources disagree or a footprint remains approximate.
7. Keep quotations short.
8. Record access dates.

High-priority open items from `fact-check-queue.csv`:

### F01: *The Love Bug* scene audit

Watch a legal copy. Log:

```text
start timestamp
end timestamp
visible course
location identification
landmarks or track geometry
source supporting identification
newly filmed or reused material if known
confidence
frame selected for commentary
```

D23 establishes broad filming locations. It does not assign every sequence to a track.

### F02: *Pit Stop* scene audit

Log Ascot figure-eight footage, street-racing locations, and any stock or reused material. AFI establishes Ascot as the chosen figure-eight environment and Los Angeles-area production, but the article still needs precise frame notes.

### F03 and F05: Third and Fairfax parcel overlay

Build verified decade layers for:

- Gilmore Stadium;
- Gilmore Field;
- Farmers Market;
- Gilmore Drive-In;
- Pan-Pacific Auditorium;
- Television City;
- The Grove.

Use the Los Angeles Conservancy Television City assessment, Farmers Market history, institutional maps, historical aerials, parcel records, and other rights-clear sources. Label approximations.

### F07: Solar midget receipt

Find a manufacturer, museum-curatorial, period advertisement, catalog, or other strong primary receipt for:

- Solar Aircraft involvement;
- 1945-1946 dates;
- Elmer Ross attribution;
- production count or kit sales.

If a strong source remains unavailable, keep the article at the museum-object level and omit the numerical production claim.

### F09: *La Muerte* biography

Use the author-owned exterior, interior, and hydraulic photographs. Do not reproduce the owner’s biography, name, family history, or community program from the museum label until permission or public-identification preferences are clear.

### F11: current replacement land uses

Verify each card immediately before final copy. Record the source and date for every current-use label.

## Visual system

Follow `editorial/VISUAL-PLAN.md`.

The hierarchy is:

1. Real historical or author-owned photographs that prove or embody the claim.
2. Original maps, timelines, overlays, diagrams, and accessible HTML tables.
3. Limited film frames used for direct commentary after a scene audit and rights record.
4. Original local collage work for the hero.
5. No decorative AI imagery unless separately approved and demonstrably useful.

The page should feel like a magazine archive, race program, historical field report, and land-use autopsy. Keep it lively, not museum beige.

### Required original visuals

Create at minimum:

1. **Third and Fairfax layer map**
2. **Southern California track map with status and type**
3. **The board-track land cycle**
4. **The Southern California speed machine**
5. **Film archaeology comparison: *The Love Bug* / *Pit Stop***
6. **What is there now? replacement cards**
7. **Compact 1910-2026 timeline**

Use SVG or semantic HTML/CSS. Core information must remain available without JavaScript. If a slider or toggle is added, supply a complete static fallback.

### Hero

Create an original editorial collage from:

- public-domain board-track imagery;
- public-domain Gilmore imagery;
- author-owned museum or swap-meet photographs;
- original track lines, map geometry, labels, halftone, paper, asphalt, and parking-lot markings.

Concept:

A single racing curve changes material across the frame. It begins as wooden banking, becomes Gilmore dirt, becomes a mid-century road course, and finishes as a shopping-center or condo access road. The city layers rise around it.

Avoid:

- Disney characters or logos;
- fake vintage photographs;
- recognizable copyrighted film characters;
- generic AI cars;
- a clean corporate real-estate rendering;
- text baked into the master hero.

Required outputs:

```text
articles/california-racing/hero/california-used-to-race-here-2400x1350.jpg
articles/california-racing/hero/california-used-to-race-here-og-1200x630.jpg
articles/california-racing/hero/california-used-to-race-here-square-1080.jpg
articles/california-racing/hero/california-used-to-race-here-vertical-1080x1350.jpg
```

Use the established article prefix and only create new keys. Inspect existing keys before upload.

## Existing first-round media

Use `reports/california-racing/upload-manifest.json` as the exact source of truth for names, URLs, dimensions, checksums, credit, rights, and public verification.

The existing 18-file set includes:

- Big 3 Parts Exchange photographs;
- California plate, Solar midget, Model T, and Plank Road museum photographs;
- seven public-domain Gilmore Stadium photographs;
- three user-approved CVWD editorial-fair-use photographs.

Do not infer a URL from an asset ID when the manifest provides the exact URL.

Use `.article-archive-viewer` for mixed portrait, landscape, panoramic, and scanned evidence. Preserve full frames. Do not crop crash, demolition, map, or archival evidence merely to create matching rectangles.

## Second media pass

A second upload pass is approved only for a selective set used in the finished article. Use new keys only and record everything in an updated or versioned manifest.

Priority set:

1. `playa-del-rey-motordrome-1910-bystander`
2. `playa-del-rey-motordrome-1914-map`
3. `beverly-hills-1920-bennett-hill`
4. `pan-pacific-auditorium-entrance-habs`
5. `pan-pacific-auditorium-1985-cc0`
6. `ascot-park-aerial-1972`
7. `riverside-final-nascar-race-1988`
8. `la-muerte-1979-monte-carlo-exterior-2019`
9. `la-muerte-interior-2019`
10. `la-muerte-hydraulics-2019`
11. optional `fonzie-triumph-tr5-1949-2019`
12. optional `fonzie-triumph-label-2019`

Do not upload all unused source-manifest records merely because they exist.

For CC BY-SA material, preserve linked attribution and record derivative/share-alike handling. For HABS and federal images, preserve institution and photographer credit. For author-owned images, credit `Photograph by HobFarm`.

The following remain excluded unless a new explicit decision is recorded:

- *Xanadu* poster;
- archive metadata scans;
- unverified 1943 Gilmore football advertisement;
- *La Muerte* owner biography panel;
- Morgan images;
- any image without a stable source page and rights statement.

## Film-frame rights procedure

Film frames from *The Love Bug* and *Pit Stop* may be used only after the scene audits are complete.

For each frame record:

- film title;
- year;
- timestamp;
- rights holder;
- frame dimensions;
- crop or edit;
- exact claim the frame supports;
- why a photograph or diagram cannot communicate the same point as effectively;
- amount used;
- placement beside commentary;
- local path;
- R2 key if uploaded;
- public URL;
- checksum.

Keep the number small. The article must still work if all film frames are omitted.

## Article integration

Inspect at least three current long-form HobFarm articles, including strong Magazine Time Machine or visual-history examples. Determine:

- article collection path and extension;
- exact frontmatter schema;
- department and tag values;
- publication date/status handling;
- hero and Open Graph fields;
- source-note convention;
- figure markup and caption pattern;
- related-content fields;
- support CTA behavior;
- article JSON-LD behavior;
- RSS and article-index behavior.

Create the article in that system. Do not build a bespoke route.

Suggested values, adapted to current schema:

```text
slug: california-used-to-race-here
title: California Used to Race Here
department: Magazine Time Machine
format: visual history / field archive
tags: Southern California, racing, Los Angeles history, car culture, film locations, urban history
```

Add a related-content or future-series note only through existing mechanisms. Do not launch a new `Built Over` department in this task.

Use the existing default support CTA for Magazine Time Machine unless repository evidence says otherwise.

## Prose pass

Apply the repository’s regular-prose guide.

Preserve:

- the first-person discovery;
- the line “I found the racetrack at Farmers Market about eighty years after somebody removed it”;
- the line “Before Southern California built racetracks out of wood, it built the road itself out of wood”;
- the line “The tracks disappeared. The culture escaped”;
- the distinction between public experiment and maximum land yield;
- the author’s blunt but specific view of The Grove and generic replacement development;
- the film contrast;
- the archival humor.

Scan for and rewrite:

- repeated balanced reversals;
- generic assistant transitions;
- overuse of three-item lists;
- repetitive “not X but Y” phrasing;
- abstract “ecosystem” language where a shop, club, track, parcel, or organization can be named;
- moralizing nostalgia;
- blanket claims about California decline or migration;
- captions that simply repeat the paragraph.

The article can be 5,000 to 8,000 words when the images and section rhythm justify it. Do not shorten it into a 1,200-word summary.

## Accessibility and performance

- One `h1`.
- Correct heading order.
- Useful alt text for every image.
- Every diagram gets a caption and text explanation.
- Every source link has meaningful link text.
- Maps and timelines must remain legible at 390px.
- Do not rely on color alone.
- No critical content hidden behind hover.
- Respect `prefers-reduced-motion`.
- No autoplay media.
- No global Three.js or mapping runtime.
- Preserve full archival frames through `.article-archive-viewer`.
- Use responsive image sizing and current repository CDN helpers.
- Keep below-the-fold archival images lazy-loaded according to current practice.
- Do not ship high-resolution source scans when a normalized publication derivative is sufficient.

## Reports to create or update

Use the existing report directory:

```text
reports/california-racing/
  README.md
  source-audit.md
  rights-ledger.md
  source-asset-manifest.json
  upload-manifest.json
  article-asset-manifest.json
  rejected-image-leads.md
  browser-qa.md
  completion-report.md
  screenshots/
```

Do not erase first-round receipts. Append, version, or clearly distinguish second-round records.

Every public asset requires:

- asset ID;
- source page;
- direct source asset URL when available;
- creator or institution;
- title and date;
- rights/license statement;
- public-domain flag;
- editorial purpose;
- crop/edit/normalization description;
- alt text;
- caption;
- credit;
- dimensions and MIME;
- checksum;
- local path;
- R2 object key;
- public CDN URL;
- upload and verification timestamps.

## Validation

Run the repository’s current real commands. At minimum, if still valid:

```text
npm test
npx astro check
npm run build
```

Also run:

- article/frontmatter schema validation;
- source-note rendering check;
- internal and external link check for the article;
- missing-media and CDN URL check;
- MIME and dimensions check;
- alt/credit/caption audit;
- heading and landmark inspection;
- Open Graph and canonical metadata inspection;
- JSON-LD inspection;
- browser QA at 1440, 1024, 768, and 390 px;
- horizontal overflow check;
- keyboard check for any enhanced visual;
- reduced-motion check;
- JS-disabled core-content check;
- archive-viewer no-crop inspection across portrait, panorama, and landscape files;
- full rendered copy read, including captions and source notes.

Capture desktop and mobile screenshots.

Do a final factual spot audit of at least:

- Plank Road 1912/1915/1916/1926 sequence;
- Playa del Rey operating dates;
- Beverly Hills and Culver City board-track chronology;
- Gilmore opening, last season, demolition, and Television City opening;
- Gilmore Field 1958 demolition;
- drive-in versus Grove parcel distinction;
- *The Love Bug* broad locations and exact selected frame locations;
- *Pit Stop* and Ascot;
- SCTA, *Hot Rod*, and NHRA chronology;
- Lions opening and closure;
- OCIR lease/development context;
- Long Beach Formula 5000, Formula One, and CART sequence;
- Irwindale final event;
- lowrider archive claims;
- Big 3 2013 event identity;
- every current-use card.

## Completion conditions

The task is complete when:

1. The article exists in the real article collection at a repository-valid slug.
2. The copy has passed source, prose, and caption audits.
3. The Third and Fairfax layer map is accurate and labels approximation.
4. The track map, timeline, land-cycle diagram, speed-machine diagram, film comparison, and replacement cards exist and are accessible.
5. The documentary image package is integrated and rights-audited.
6. Any film frames have timestamped fair-use records, or have been cleanly omitted.
7. Existing and second-pass CDN URLs return successfully with expected MIME types.
8. The page preserves mixed-aspect archive images without cropping.
9. Tests, Astro check, production build, links, media checks, and responsive QA pass.
10. Reports contain exact evidence and unresolved items.
11. No production deployment or merge occurs.

## Blocked stop conditions

Stop the affected path and report when:

- repository instructions conflict with this task;
- the `main` worktree cannot be safely edited without overwriting existing work;
- a source contradicts a material premise;
- a required image lacks a defensible rights basis;
- a film scene cannot be confidently assigned to a location;
- current land use cannot be verified;
- R2 credentials or prefix checks fail;
- a destination object already exists and versioning has not been chosen;
- unrelated repository failures block validation;
- a paid operation would incur a new charge.

A blocker report must include:

1. action attempted;
2. evidence gathered;
3. exact blocker;
4. safest fallback;
5. approval or input required.

## Completion report

Return:

1. branch and commit status;
2. article file and final local route;
3. file-by-file implementation summary;
4. editorial changes from the supplied draft;
5. source-audit results and claims narrowed or removed;
6. Third and Fairfax map sources and confidence notes;
7. film-audit timestamps and frame decisions;
8. final visual list;
9. every new R2 key, public URL, MIME, dimensions, checksum, rights basis, and credit;
10. rejected image leads and reasons;
11. test/build/check output;
12. browser QA matrix;
13. remaining manual approvals or future enhancements;
14. exact merge and deployment actions that were not run.

Work on `main` and push the validated commit. Do not run a direct Cloudflare
deployment command.

# California racing article preparation

This directory contains the research, media, implementation, and QA record for
`california-used-to-race-here`. The article now lives at
`src/content/articles/california-used-to-race-here.mdx`, and
`codex/BUILD-SPEC.md` records the second-round brief.

## Second-round implementation

- `source-audit.md`: material claim checks and claims narrowed or omitted.
- `rights-ledger.md`: practical media-use record.
- `article-asset-manifest.json`: four verified second-pass CDN uploads.
- `rejected-image-leads.md`: media deliberately left out.
- `browser-qa.md`: responsive, metadata, accessibility, and media checks.
- `completion-report.md`: final branch, file, validation, and deployment status.

## Research files

- `source-ledger.csv`: 41 sources and the claims they support.
- `track-ledger.json`: 15 Southern California tracks and venue records.
- `timeline.json`: working chronology from 1880 through 2026.
- `fact-check-queue.csv`: unresolved research, caption, and clearance work.
- `image-acquisition-shortlist.csv`: images still worth locating or licensing.
- `source-asset-manifest.json`: the original 42-record research manifest.
- `upload-manifest.json`: the 18 files actually normalized, uploaded, and
  verified in this pass.

The source manifest retains the prospective `hobfarm-cdn/...` keys from the
research handoff. The upload manifest uses R2-relative destination keys under
the `hobfarm-cdn` bucket.

## Uploaded media

Eighteen approved source files were resized without cropping to fit within
2048 by 2048 pixels, saved as optimized quality-90 JPEGs, and uploaded to:

```text
https://cdn.hob.farm/articles/california-racing/
```

The set contains:

- Two HobFarm photographs from the 2013 Big 3 Parts Exchange.
- Six HobFarm museum photographs covering California plates, the Solar midget
  racer, a Model T on preserved Plank Road boards, its crank start, the Plank
  Road mural, and the museum history panel.
- Seven public-domain Los Angeles Daily News images covering Gilmore Stadium
  racing, soccer, cricket, crashes, the empty grandstands, and demolition.
- Three CVWD archive photographs used by the user's explicit editorial
  fair-use direction: two views of the surviving Plank Road and E.N.T.
  Burnett's 1922 Salton Sea road-trip photograph.

Each item in `upload-manifest.json` records its original local filename,
normalized dimensions, byte count, SHA-256 checksum, credit, rights status,
public URL, upload result, and public verification result.

## Use limits and files not uploaded

The CVWD photographs should appear only in the Plank Road comparison, with a
nearby credit to the Coachella Valley Water District historical archive. The
1922 photograph should also name E.N.T. Burnett where space permits.

The following attached files remain outside the public article prefix:

- The three archive metadata scans. They are documentation, not article art.
- The 1943 Gilmore football advertisement. Its exact Commons file page still
  needs verification.
- The `Xanadu` poster. It remains an editorial reference pending a fair-use or
  permission decision.

The 19 records in the source manifest that were not among the attached source
files were not downloaded or uploaded in this pass.

## Archive viewer

`ArticleLayout.astro` now provides the scoped `article-archive-viewer` class for
mixed portrait, landscape, panoramic, and scanned-document media. It places the
whole image on a consistent dark stage and uses `object-fit: contain`, so the
article does not crop historical evidence merely to make every frame the same
shape.

Use this markup in the future article:

```html
<figure class="article-archive-viewer">
  <img
    src="https://cdn.hob.farm/articles/california-racing/gilmore-1941-night-midget-race.jpg"
    alt="Midget cars race under the lights at Gilmore Stadium in 1941."
    width="2048"
    height="1155"
    loading="lazy"
    decoding="async"
    data-lightbox
  />
  <figcaption>
    Night racing at Gilmore Stadium, 1941. Los Angeles Daily News,
    via Wikimedia Commons. Public domain in the United States.
  </figcaption>
</figure>
```

Keep captions tied to the rights and credit fields in the upload manifest.
Use the fact-check queue before writing definitive scene-to-track captions,
current parcel claims, owner biography, Solar production totals, or film-frame
identifications.

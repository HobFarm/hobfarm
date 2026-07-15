# Other Alice approved asset R2 promotion

## Result

All three approved public assets are present under `hobfarm-cdn/pages/other-alice-adventures/`. Direct R2 downloads match the local files by byte count and SHA-256. The three public CDN URLs return HTTP 200 with the correct MIME type and a one-year immutable cache policy.

## Preflight

- Wrangler version: 4.103.0
- Authenticated remote R2 access: available
- Bucket: `hobfarm-cdn`
- Requested key prefix: `pages/other-alice-adventures/`
- Public domain: `https://cdn.hob.farm`
- Custom-domain mapping: active and serving the requested bucket objects
- Secrets printed: none

## Object record

| Object key | Action | Type | Bytes | SHA-256 | CDN verification |
| --- | --- | --- | ---: | --- | --- |
| `pages/other-alice-adventures/oaa-map-wonderland-living-atlas-v01-16x9.avif` | Uploaded | `image/avif` | 598334 | `8a32ce2725333fb9707398860a09d54ea087fda235d758f21a53b77ee7b29f17` | 200, exact length, immutable |
| `pages/other-alice-adventures/oaa-map-wonderland-living-atlas-v01-16x9.webp` | Existing bytes matched; identical content re-uploaded to update cache metadata | `image/webp` | 715956 | `56cb06efd0e69eb2718e4b17a1c11a5aeb77fe1de283104f2e458d48eae90003` | 200, exact length, immutable |
| `pages/other-alice-adventures/oaa-poster-other-alice-two-worlds-v01-2x3.avif` | Uploaded | `image/avif` | 279138 | `c2d9721963ce94c3f1bd1fa0ca76918dcdd0d7405250c8ff0d2905e8518025e4` | 200, exact length, immutable |

Final URLs:

- `https://cdn.hob.farm/pages/other-alice-adventures/oaa-map-wonderland-living-atlas-v01-16x9.avif`
- `https://cdn.hob.farm/pages/other-alice-adventures/oaa-map-wonderland-living-atlas-v01-16x9.webp`
- `https://cdn.hob.farm/pages/other-alice-adventures/oaa-poster-other-alice-two-worlds-v01-2x3.avif`

## Verification performed

For each object:

1. Checked remote existence before mutation.
2. Compared existing content where present.
3. Uploaded only an approved local source file.
4. Set the expected MIME type.
5. Set `Cache-Control: public, max-age=31536000, immutable`.
6. Downloaded the remote object through Wrangler.
7. Compared the remote byte count and SHA-256 with the local source and the existing asset manifest record.
8. Checked the public CDN URL for status, content type, content length, and cache policy.

The atlas WebP already existed with the correct bytes and SHA-256. Its earlier CDN response used a one-hour cache policy. Re-uploading the identical local bytes changed only the requested object metadata; a cache-busted CDN check confirmed the immutable one-year policy.

## Exclusions and safety

- No motion study was uploaded.
- No generated study, motion-review frame, rejected atlas, supplied Alice PNG, character source, or new character art was uploaded.
- No R2 object was deleted.
- No mismatched existing checksum was overwritten.
- Local source files were retained.
- No Worker deployment occurred. A separate, later Cloudflare Pages production deployment published the completed site update.

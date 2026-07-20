# Workshop Process Film

This HyperFrames project renders the vertical homepage film and wide Workshop film from `src/data/workshop-process-film.json`.

## Build data

Run from the repository root:

```powershell
$env:PATH = "<folder-containing-ffmpeg>;$env:PATH"
node scripts/build-workshop-process-film.mjs
```

The script copies the shared manifest and presentation files into both self-contained HyperFrames composition folders.

The ignored `source/` directory must contain the user-supplied `psygoth-zima-blue-v2.png` reference before syncing.

## Validate

```powershell
npx hyperframes lint video/workshop-process-film/vertical
npx hyperframes validate video/workshop-process-film/vertical
npx hyperframes inspect video/workshop-process-film/vertical --samples 15

npx hyperframes lint video/workshop-process-film/wide
npx hyperframes validate video/workshop-process-film/wide
npx hyperframes inspect video/workshop-process-film/wide --samples 15
```

## Render

```powershell
npx hyperframes render video/workshop-process-film/vertical --output renders/zima-process-film-vertical-v2.mp4 --fps 30 --quality high
npx hyperframes render video/workshop-process-film/wide --output renders/zima-process-film-wide-v2.mp4 --fps 30 --quality high
```

The source Zima avatar clip is muted inside the compositions. Stage copy and the website transcript carry the complete meaning.

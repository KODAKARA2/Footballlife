# Football protagonist artwork

2026-10-07: Replaced all 30 original protagonist images and added the approved `hero_pro_gk` sample. Other 17 keeper variants are documented separately in `art-hero-gk-manifest.json`.

Each image was independently generated using the built-in image generator, with original identity references and the approved football sample as style reference. Original pixels were reviewed before generation; generated previews and the two final contact sheets were visually reviewed. The three appearance identities, age-appropriate youth scenes, injury, slump, victory and retirement contexts are preserved. No baseball equipment remains in this set. Retirement portraits include football tactics boards; victory portraits carry fictional football trophies.

Full-resolution generated files remain in `assets/football-generated/`. Runtime portraits use 512×768 RGBA PNG with lossless PNG compression after high-quality resampling. Alpha integrity, hashes, sizes, returned generation paths and prompts are in `art-hero-manifest.json`. The source sample's foreground alpha is typically 253 rather than 255; this is native generator output and retains a visible solid silhouette. Background alpha is zero.

Original artwork is recoverable from commit `13699caa17f363ae7d020959eef35c98f34d6cfb`; per-file original SHA-256 values are recorded. No gameplay, save structure, or remote publication was changed by this artwork task.

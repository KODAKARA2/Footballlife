# Eight role drills: presentation integration

Base: Footballlife main `b2995e19`. Only extra-drill presentation, its CSS and tests change. No engine, probability, reward, save keys, or existing six-drill rules changed. No unrelated league branch imported.

- Volley: airborne approach, wind-up, 0.6–0.8 s target band around the existing 0.7 s charge; release kick, rotating/perspective flight, existing grade-based GOAL/failure.
- Run: three lane choices advance the runner through visible defenders and their line.
- Scan: chosen receiver is revealed; the ball travels to that player before the pass result.
- Rhythm: alternating strides on a running track, quiet step cues, recovery/result.
- Intercept: defender shifts into the selected lane; successful contact traps the ball, a miss passes beyond the line.
- Line: two teammates and the formation marker move together; player position remains controlled by the original rule.
- Claim: low ball travels into the keeper's hands; high ball gets a short jump/punch away; misses continue past the keeper.
- Angle: the attacker-to-goal angle is visible; shot travels to the keeper on a good grade or the goal on a poor grade.

Resolution freezes the original computed grade before cosmetics. A shared 560 ms presentation covers seven drills; volley uses 280 ms contact plus 620 ms flight. The existing 1100 ms result/callback delay follows. Scoped animation frames stop on cancellation or detached DOM; existing resize/hidden abort semantics remain. Reduced motion skips presentation movement and retains grade/result. All sounds use the existing quiet, persisted, capped WebAudio engine. Minigame grades/probabilities are distinct from the later card outcome.

## Required volley artwork is NOT included

The exact user original is Library `libfile_22be612ea7f48191893367f53ce42a51`, `image(20261008-023859).png`, expected 920×788 / 1,229,313 bytes. `prepare_materialize` targeted this consumer's `/workspace/volley-reference`. Preparation succeeded; the current official `library_file_transfer.py materialize` received the complete transfer object, then exited 1 with `library file transfer failed: download failed`. The authorized single supported retry is exhausted. No access bypass, substitute image, or generated replacement was used. No original pixels were available for inspection here.

`VOLLEY_IMPACT_ORIGINAL=null` deliberately disables the image panel without a broken image request. The remaining volley motion is usable. The requested original image cutin is an outstanding item, not a completed feature. After a supported original transfer and pixel inspection, install the verified image, preserve provenance and metadata, set this path, and verify its `contain` 920:788 panel with upper-left `퍽!` for 280 ms. Latest scope authorization permits the independent seven improvements and distinguishes the omitted original cutin in the release report.

## Checks

- `tools/volley-impact-check.js`: four unchanged grades/probabilities, one release kick, repeat guard, real touch/keyboard, 6 s timeout, cancel/remove/resize/hidden/restart/reduced motion at 320/390/1280. A synthetic in-memory SVG checks panel timing/layout only; never shipped or counted as original-art verification.
- `tools/extra-motion-check.js`: seven success/failure motions, freeze/repeat guard, every lifecycle interruption, no frames continuing after cleanup, muted zero oscillator creation, reduced motion, high/low crosses, untouched storage at 320/390/1280.
- Existing full regression runner includes both checks. Existing role-drill test waits for cosmetic resolution before expecting the callback.
- Existing feedback tests separately verify persisted preferences, first gesture unlocking, quiet waveform levels, cancellation, and no RNG use. Browser playback calls/offline signal levels do not constitute human listening.

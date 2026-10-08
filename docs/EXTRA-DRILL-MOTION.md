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

## Volley artwork: newly generated with explicit approval

The first release omitted the user's original after a supported Library transfer failed (`download failed`). On 2026-10-08 the user explicitly requested a similar newly drawn cutin instead. The original was not downloaded, copied or recovered. A new image was made with the built-in image generator and saved directly in this execution environment, then inspected before integration.

The game now uses `images/minigames/volley-impact-generated.png` with a centered, original-aspect panel, `object-fit: contain`, separate upper-left UI text `퍽!`, and 280 ms duration. Generation provenance is in `docs/VOLLEY-ART-PROVENANCE.md`. Missing or unloaded images skip the panel without delaying the existing flight or judgment.

## Checks

- `tools/volley-impact-check.js`: four unchanged grades/probabilities, one release kick, repeat guard, real touch/keyboard, 6 s timeout, cancel/remove/resize/hidden/restart/reduced motion at 320/390/1280. The actual generated PNG is decoded and checked for dimensions, aspect ratio, panel timing, safe layout and failed-image fallback.
- `tools/extra-motion-check.js`: seven success/failure motions, freeze/repeat guard, every lifecycle interruption, no frames continuing after cleanup, muted zero oscillator creation, reduced motion, high/low crosses, untouched storage at 320/390/1280.
- Existing full regression runner includes both checks. Existing role-drill test waits for cosmetic resolution before expecting the callback.
- Existing feedback tests separately verify persisted preferences, first gesture unlocking, quiet waveform levels, cancellation, and no RNG use. Browser playback calls/offline signal levels do not constitute human listening.

# Detailed minigame artwork integration

The eight runtime PNGs and provenance documents come from asset commit `e61cc6b0a1e891f1c29360db5c254af3c4059004`. No existing character artwork, goalkeeper mapping, or historical credits are replaced by this integration.

`decorate()` in `js/minigames.js` attaches presentation to existing rule nodes. Shooting/keeper use `field_goal`, defense/dribble/pass use `field_topdown`, and tactics uses `tactics_background`. The five transparent assets supply the protagonist, orange opponents, receiving teammate, goalkeeper, and goal net. The corrected native vector ball is retained.

Actor centers stay on the existing anchors. The goalkeeper's canvas glove contact is `(0.5, 0.4)` and its blue catch indicator marks that exact logical point. The goal net keeps its natural 2:1 canvas, including transparent margins; the approximately 3.4:1 mouth is not stretched. Shot arrival uses a safe inset within the visible upper-left mouth. Neither the shot grade nor its probability changes.

Images have fixed presentation sizes and load asynchronously. New artwork does not delay input or consume gameplay random numbers. The original pitch and marker visuals remain behind decorative images, and are restored on error. New PNGs total 1,656,960 bytes; only the assets for the opened drill are requested and normal browser caching applies. There are no new audio files or services.

Validation: `npm test` (22 tests, zero failures), `feedback-check.js`, `feedback-browser-check.js`, and `npm run build`. `minigame-art-check.js` checks every asset across six drills at 320/390/1280px, goal aspect ratio, goalkeeper anchor, vector ball, cancellation, and successful play when all eight new image URLs are blocked. Existing curve, round-ball, coach, action, UI, engine, and simulations remain covered. Tests ran in Chromium; physical iOS devices and direct human sound listening were not available.

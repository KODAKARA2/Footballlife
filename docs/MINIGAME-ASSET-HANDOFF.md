# Minigame asset handoff

Prepared on `art/minigame-detail`, based on `5b89761a184fdddf20c43d4be601f0c3f10f21ef`. Assets and QA documentation only. No game JavaScript/CSS changes, main merge, or deployment. A separate asset branch is published for fetch/cherry-pick integration.

All runtime paths below are relative to repository root (`/workspace/football-life-publish`).

| Path | Dimensions | Placement |
| --- | --- | --- |
| images/minigames/field_goal.png | 512×512 RGB | Shooting/keeper stadium background, center crop |
| images/minigames/field_topdown.png | 512×512 RGB | Pass/dribble/defense overhead turf, center crop |
| images/minigames/tactics_background.png | 512×512 RGB | Optional blank tactics board; stretch cautiously or cover |
| images/minigames/player_run.png | 256×256 RGBA | Blue protagonist, center anchor (0.5,0.5) |
| images/minigames/defender_ready.png | 256×256 RGBA | Orange defender, center anchor (0.5,0.5) |
| images/minigames/player_receive.png | 256×256 RGBA | Blue teammate with pale sleeves, center anchor (0.5,0.5) |
| images/minigames/keeper_ready.png | 256×320 RGBA | Green goalkeeper, glove contact center (0.5,0.4) |
| images/minigames/goal_net.png | 512×256 RGBA | Transparent net, center anchor (0.5,0.5), preserve aspect ratio |

Coordinates are normalized from canvas top left. Use `translate(-50%,-40%)` for the goalkeeper if its positioned coordinate represents glove contact; other actor centers use `translate(-50%,-50%)`. Keep actor hitboxes and timing target logic independent of decorative silhouette. All actors have no baked ball or motion trail. Backgrounds have no goals, actors, text, or timing markings.

Preserve the existing corrected native `H.ball` vector. There is no runtime raster ball. Earlier ball/gloves/three-quarter-run prototypes are retained only in full-resolution provenance and must not be integrated.

Visual limits: the field players use a steep angled overhead view (some front torso is visible), while keeper is frontal. Goal opening is approximately 3.4:1 and has subtle blue outline shading; do not stretch it to force an exact mouth ratio. Its canvas contains transparent top/bottom padding. Shooting and goalkeeper should overlay this goal independently of the stadium field. Stadium detail occupies the top ~23%; turf center remains clear.

Validation: all 8 PNG files decoded; exact dimensions/modes and SHA256 recorded in `minigame-assets.json`; all five sprite canvases have transparent corners. Runtime total is 1,656,960 bytes. Generated source and final pixels were visually inspected, including goal mesh transparency, actor limbs, distinct uniform colors, and goalkeeper gloves.

Chromium asset gallery checked at 320, 390, and 1280 px: all 8 images loaded at each width; no horizontal overflow. Evidence: `minigame-assets-{320,390,1280}.png`, `minigame-assets-contact.jpg`, and standalone `minigame-assets-preview.html`. These checks are asset-preview checks, not gameplay integration tests; gameplay motion/collision/mobile checks belong to the code integration task.

Original generated images are preserved in `assets/minigame-generated/` and original `/workspace/generated_images/` paths. Exact prompts and source/runtime hashes are in `minigame-backgrounds.json`, `minigame-players.json`, `minigame-keeper.json`, and `minigame-props.json`. Existing main-game art credits and licenses were untouched.

## Distribution and source / license record

This handoff commit includes only the 8 optimized runtime PNGs and 6 handoff/provenance documents. High-resolution generation outputs, rejected prototypes, and browser-preview evidence mentioned above remain in the producing workspace and are intentionally excluded from this commit. Source paths in manifests are provenance records, not required runtime dependencies.

All eight new assets were created with OpenAI built-in ImageGen. Existing generated Football Life character artwork was used as the identity/style reference where recorded in each prompt. No new third-party stock assets were downloaded. This handoff does not assign or change a repository-wide license. Historical artwork credits and five CC source records remain in `data/settings.js` and `docs/GRAPHICS-WORKFLOW.md`; existing assets and Pretendard OFL license records are unchanged. These historical CC notices are not a claim that the newly generated images use the same license.

# Career and role-drill improvements

Base: `598b188` (PR #4), merged normally into the isolated feature checkout. The eight detailed minigame assets, 130 character/background images, goalkeeper mappings, provenance, six original drills, curved shots, GOAL/boo feedback, pass praise, dribble and coach reactions remain intact. No files in Baseball Life or Bad0ae were modified. The separately blocked European leagues branch was not merged or cherry-picked. No new image generation, external service, payment, domain, or referee cut-in was added.

## Career intervals

An ordinary pro card records one half-season interval. It keeps the starting team, contract, position, ability/condition and injury information. Explicit selection-based promotion/demotion applies to that interval; automatic end-of-turn demotion affects the following interval. Explicit transfers take effect after the interval. Each interval owns its appearances and prorated wage. Annual settlement sums the ledger once, so late promotion does not invent a full season and demotion does not erase earlier appearances. Partial retirement settles only completed intervals. Contract renewal and result/system cards do not create additional intervals. Domestic tenure includes mixed domestic/overseas seasons.

Completed legacy v2 records are preserved. Format 3 remains inside football-only v2 keys; unfinished legacy intervals are marked unknown, retain prorated contract wages, and do not fabricate historical appearances. The game displays that migration limitation.

## Save files and decisions

The save menu is available on both setup and game menus. JSON export includes current career (including unsaved in-memory progress), collection and next-generation bonus. Import is limited to 2 MiB, checks transfer version and game/schema, rejects dangerous prototype keys and HTML markup, and shows a preview followed by an explicit overwrite action. Preview/cancel does not write. A recovery snapshot precedes changes and partial write failures restore prior active keys. A malformed current save is retained separately when restoring a valid file. Saving reports the last successful time and visible quota errors. This is local browser storage, with no accounts or server synchronization.

Choice previews inspect only declared effects; they never roll RNG. They disclose major happiness/relationship losses, injury duration, existing costs, and capped rewards. Results retain direct-effect chips and show actual before/after values, split between immediate changes and subsequent growth, aging, recovery, relationship and settlement effects.

## Goals, practice, endings

One season goal can be selected: role skill, passing, starting status, or injury-free intervals. Skill options already too close to the current cap are omitted. Priority story cards retain their precedence. Goal hints appear on related choices and a follow-up evaluation grants at most happiness +3 once (clamped to 100). Free-time practice now lets the player choose one eligible role ability for exactly +1; navigation/cancel is free and existing caps remain. No additional minigame reward is attached to free-time practice.

The original highest-priority special ending remains the representative narrative and bonus source. Other simultaneously satisfied specials appear under “함께 이룬 것들” and are collected once. Spouse endings, titles and career choices remain. Collection records also remember life IDs to prevent replaying an already-recorded life if its saved UI flag is stale.

## Four five-slot role pools: 14 unique games, 20 slots

| Role | Five default drills |
| --- | --- |
| FW | Shooting (`miniBat`), dribble (`miniSteal`), pass (`miniThrow`), volley power (`miniVolley`), run lanes (`miniRun`) |
| MF | Pass, tactics memory (`miniSigns`), dribble, passing vision (`miniScan`), stamina rhythm (`miniRhythm`) |
| DF | Tackle timing (`miniTimer`), interception (`miniIntercept`), line tracking (`miniLine`), tactics memory, pass |
| GK | Save (`miniPitch`), cross decision (`miniClaim`), angle positioning (`miniAngle`), pass, tactics memory |

The original six implementations are unchanged except exposing their shared session lifecycle and permitting the new board presentation. The eight new actions are respectively hold/release charging, repeated lane routing, remembering an unmarked receiver, alternating rhythmic footwork, predicting a moving pass, continuously following a line, choosing catch/punch at the correct cross height/time, and manually positioning on the angle bisector. Shared session/grade code is reused; these are not renamed copies.

Championship choices explicitly map finishing to shooting, connecting teammates to passing and following instructions to positioning/tactics. Rewards are identical to the prior championship choice. Other explicit goalkeeper/interception moments have context metadata; generic showdowns keep the role pool fallback. Contextual repeat avoidance may select another of the 14 games evaluating the same relevant ability, outside that role's default five-slot pool. All evaluation abilities remain relevant to the position. The same game cannot be drawn three times consecutively. All 14 games are available in the practice menu.

Touch and keyboard inputs are documented in the game. Reduced-motion and sound preferences use the existing feedback system. Cancellation, restart, hidden tabs and resize release active sessions; cancelling career play leaves the choice and save unchanged. Gameplay-essential motion is retained when reducing decorative motion.

## Validation and limits

See `tools/results/test-report-all.json`, `test-report-engine.json`, `test-report-browser.json` and the new career/role/save checks for the final run evidence. Browser checks use Chromium at 320, 390 and 1280 pixels. Physical iOS Safari and human listening were not performed. Existing audio tests inspect real AudioContext starts and rendered signal levels, not subjective sound quality.

# 그래픽 후속 작업 목록

이번 전환은 이미지 생성·교체를 하지 않습니다. `images/`의 110개 파일과 `assets/` 원본·후보 이미지·라이선스는 원본 그대로 보존합니다. 아래 목록은 실행 소스의 정적 참조와 동적 키 사용을 정리했습니다. 모든 이미지가 육안 검수를 마쳤다는 뜻은 아닙니다.

직접 확인한 `hero_pro.png`에는 야구 유니폼·모자·글러브가, `bg_stadium.png`에는 다이아몬드·마운드와 **HANBIT BASEBALL** 문구가 남습니다. `heroine2_meet.png`는 기자 소품을 사용합니다. 선수·감독·동료의 외모별 그림은 후속 그래픽 작업에서 축구 복장과 장비로 검토해야 합니다. 생활·연애·결혼·자녀 그림은 임시 재사용합니다.

`js/ui.js`가 시기별 주인공 그림에 `_plain`/`_ugly`를 붙이고, 관계에 따라 히로인 그림을 고릅니다. `js/panels.js` 도감에도 표시됩니다. `hero_mlb`와 `mlb_teammate` 파일명은 자산 정체성을 보존하기 위해 유지하며 게임 UI의 리그 명칭과는 별개입니다. `assets/semirealistic/`와 `assets/fine-pixel/`의 과거 시안·프롬프트·정적 카탈로그도 수정하지 않았습니다.

원본 이미지 해시와 참조 목록: `docs/graphics-inventory.json`. 출처는 게임 메뉴의 그림 출처 및 `data/settings.js`에 유지됩니다. 저작자와 CC 라이선스 링크, `assets/fonts/pretendard/LICENSE`도 보존합니다.

| 파일 | 상태 / 남은 작업 | 코드 연결 |
|---|---|---|
| `images/agent.png` | 생활·인물 그림 임시 재사용 | `data/mlb/mlb_cards.js`, `data/cards/pro_events.js`, `data/cards/sacrifice.js`, `data/cards/pro_more.js`, `data/cards/retire.js`, `data/cards/looks.js` |
| `images/bg_classroom.jpg` | 생활·인물 그림 임시 재사용 | `data/settings.js` |
| `images/bg_hall.jpg` | 생활·인물 그림 임시 재사용 | `data/settings.js` |
| `images/bg_home.jpg` | 생활·인물 그림 임시 재사용 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/bg_indoor.png` | 생활·인물 그림 임시 재사용 | `js/ui.js` |
| `images/bg_office.jpg` | 생활·인물 그림 임시 재사용 | `data/settings.js` |
| `images/bg_room.jpg` | 생활·인물 그림 임시 재사용 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/bg_school.jpg` | 생활·인물 그림 임시 재사용 | `data/settings.js` |
| `images/bg_stadium.png` | 교체 필요 확인: 다이아몬드·마운드·HANBIT BASEBALL | `js/ui.js` |
| `images/bg_street.png` | 생활·인물 그림 임시 재사용 | `js/ui.js` |
| `images/buddy.png` | 우선 교체 검토: 선수 복장·장비 | `data/cards/emergency.js`, `data/cards/pro_season.js`, `data/cards/pro_more.js`, `data/cards/high.js`, `data/cards/college.js`, `data/cards/retire.js`, `data/cards/looks.js`, `data/cards/elementary.js`, `data/cards/middle.js` |
| `images/child.png` | 생활·인물 그림 임시 재사용 | `data/heroines/romance_common.js`, `data/cards/emergency.js` |
| `images/coach_high.png` | 우선 교체 검토: 선수 복장·장비 | `data/cards/draft.js`, `data/cards/pro_more.js`, `data/cards/high.js`, `data/cards/middle.js` |
| `images/coach_little.png` | 우선 교체 검토: 선수 복장·장비 | `data/cards/elementary.js` |
| `images/hero_college.png` | 우선 교체 검토: 선수 복장·장비 | `data/settings.js` |
| `images/hero_college_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_college_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_elementary.png` | 우선 교체 검토: 선수 복장·장비 | `data/settings.js` |
| `images/hero_elementary_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_elementary_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_high.png` | 우선 교체 검토: 선수 복장·장비 | `data/settings.js` |
| `images/hero_high_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_high_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_injured.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js`, `data/cards/pro_events.js` |
| `images/hero_injured_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_injured_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_middle.png` | 우선 교체 검토: 선수 복장·장비 | `data/settings.js` |
| `images/hero_middle_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_middle_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_mlb.png` | 우선 교체 검토: 선수 복장·장비 | `data/mlb/mlb_settings.js` |
| `images/hero_mlb_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_mlb_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_pro.png` | 교체 필요 확인: 야구 유니폼·모자·글러브 | `js/ui.js`, `data/settings.js` |
| `images/hero_pro_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_pro_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_retired.png` | 우선 교체 검토: 선수 복장·장비 | `js/panels.js`, `js/ui.js`, `data/settings.js` |
| `images/hero_retired_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_retired_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_slump.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js` |
| `images/hero_slump_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_slump_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_victory.png` | 우선 교체 검토: 선수 복장·장비 | `js/season.js`, `data/heroines/heroine3.js`, `data/mlb/mlb_cards.js`, `data/cards/pro_events.js`, `data/cards/pro_more.js`, `data/cards/retire.js`, `data/cards/pro.js` |
| `images/hero_victory_plain.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/hero_victory_ugly.png` | 우선 교체 검토: 선수 복장·장비 | `js/ui.js / js/panels.js 동적 외모·관계·배경 키 또는 보존용` |
| `images/heroine10.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine10.js` |
| `images/heroine10_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine10.js` |
| `images/heroine10_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine10.js` |
| `images/heroine10_wife.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine10.js` |
| `images/heroine11.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine11.js` |
| `images/heroine11_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine11.js` |
| `images/heroine11_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine11.js` |
| `images/heroine11_wife.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine11.js` |
| `images/heroine12.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine12.js` |
| `images/heroine12_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine12.js` |
| `images/heroine12_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine12.js` |
| `images/heroine12_wife.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine12.js` |
| `images/heroine13.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine13.js` |
| `images/heroine13_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine13.js` |
| `images/heroine13_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine13.js` |
| `images/heroine13_wife.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine13.js` |
| `images/heroine14.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine14.js` |
| `images/heroine14_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine14.js` |
| `images/heroine14_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine14.js` |
| `images/heroine14_wife.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine14.js` |
| `images/heroine15.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine15.js` |
| `images/heroine15_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine15.js` |
| `images/heroine15_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine15.js` |
| `images/heroine15_wife.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine15.js` |
| `images/heroine1_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine1.js` |
| `images/heroine1_meet.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine1.js` |
| `images/heroine1_spouse.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine1.js` |
| `images/heroine1_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine1.js` |
| `images/heroine2_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine2.js` |
| `images/heroine2_meet.png` | 직접 확인: 기자 소품, 임시 재사용 가능 | `data/heroines/heroine2.js` |
| `images/heroine2_spouse.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine2.js` |
| `images/heroine2_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine2.js` |
| `images/heroine3_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine3.js` |
| `images/heroine3_meet.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine3.js` |
| `images/heroine3_spouse.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine3.js` |
| `images/heroine3_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine3.js` |
| `images/heroine4_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine4.js` |
| `images/heroine4_meet.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine4.js` |
| `images/heroine4_spouse.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine4.js` |
| `images/heroine4_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine4.js` |
| `images/heroine5_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine5.js` |
| `images/heroine5_meet.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine5.js` |
| `images/heroine5_spouse.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine5.js` |
| `images/heroine5_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine5.js` |
| `images/heroine6_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine6.js` |
| `images/heroine6_meet.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine6.js` |
| `images/heroine6_spouse.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine6.js` |
| `images/heroine6_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine6.js` |
| `images/heroine7.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine7.js` |
| `images/heroine7_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine7.js` |
| `images/heroine7_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine7.js` |
| `images/heroine7_wife.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine7.js` |
| `images/heroine8.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine8.js` |
| `images/heroine8_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine8.js` |
| `images/heroine8_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine8.js` |
| `images/heroine8_wife.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine8.js` |
| `images/heroine9.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine9.js` |
| `images/heroine9_lover.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine9.js` |
| `images/heroine9_wedding.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine9.js` |
| `images/heroine9_wife.png` | 생활·인물 그림 임시 재사용 | `data/heroines/heroine9.js` |
| `images/interpreter.png` | 생활·인물 그림 임시 재사용 | `data/mlb/mlb_cards.js` |
| `images/manager_pro.png` | 우선 교체 검토: 선수 복장·장비 | `data/heroines/date_surprises.js`, `data/cards/pro_events.js`, `data/cards/pro_season.js`, `data/cards/pro_extra.js`, `data/cards/pro.js` |
| `images/mlb_teammate.png` | 우선 교체 검토: 선수 복장·장비 | `data/mlb/mlb_cards.js`, `data/cards/humor.js` |
| `images/parents.png` | 생활·인물 그림 임시 재사용 | `data/mlb/mlb_cards.js`, `data/cards/draft.js`, `data/cards/emergency.js`, `data/cards/pro_more.js`, `data/cards/college.js`, `data/cards/retire.js`, `data/cards/elementary.js`, `data/cards/middle.js`, `data/cards/military.js` |
| `images/rival.png` | 우선 교체 검토: 선수 복장·장비 | `data/characters.js`, `data/heroines/date_surprises.js`, `data/mlb/mlb_cards.js`, `data/cards/rival.js` |
| `images/teammate.png` | 우선 교체 검토: 선수 복장·장비 | `data/cards/humor.js` |

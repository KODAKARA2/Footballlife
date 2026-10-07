# 축구판 그래픽 검수 목록

2026-10-07 기존 110장 전체를 새로 생성해 교체하고 골키퍼 전용 18장을 추가했습니다. 같은 감독의 성공·실패 컷인2종까지 총130장입니다. 새 인물이 추가된 것은 아닙니다. 인물은512×768 투명PNG, 배경은1200×800입니다. 원본 이미지는 Git 이력과 기존 `assets/` 자료에 보존합니다.

축구 유니폼·공·골대·키퍼 장갑을 확인하고, 학생의 연령에 맞는 일상과 히로인15명의 직업·인물 정체성을 유지했습니다. 각 변형은 독립 생성이며 단순 색상·도형 치환을 사용하지 않았습니다. 이미지 파일명은 기존 카드·저장 연결의 안정성을 위해 유지합니다. `hero_mlb` 등은 내부 파일명이며 야구 그림이 아닙니다.

모든130장의 픽셀 검수 완료. 모바일·PC 브라우저 및 효과음 통합 검증 결과는 `tools/results/graphics/report.json`과 `docs/art-progress.json`에 기록합니다. 아직 실행하지 않은 검사를 통과로 표시하지 않습니다.

## 원본·생성 내역

- 기준 원본 해시: `docs/graphics-inventory.json`
- 최종 해시·검증 상태: `docs/art-progress.json`
- 주인공: `docs/art-hero-manifest.json`
- 골키퍼: `docs/art-hero-gk-manifest.json`
- 히로인: `docs/art-heroines-completion.json` 및 세 묶음 상세manifest
- 감독 컷인: `docs/art-coach-cutins.json`
- 조연: `docs/art-support-generation.json`
- 배경: `docs/art-background-manifest.json`
- 절차와 출처 설명: `docs/GRAPHICS-WORKFLOW.md`

과거 원본 출처(CC5건) 및 글꼴 라이선스는 그대로 보존합니다. 생성 원본은 `assets/football-generated/`에 보존합니다. 검수용 원본 복사본 폴더는 로컬 보관하며, 공개 저장소에서는 변경 전 커밋6235f47에서 원본을 복구할 수 있습니다.

## 파일별 상태

| 파일 | 픽셀 검수 |
|---|---|
| `images/agent.png` | 완료 |
| `images/bg_classroom.jpg` | 완료 |
| `images/bg_hall.jpg` | 완료 |
| `images/bg_home.jpg` | 완료 |
| `images/bg_indoor.png` | 완료 |
| `images/bg_office.jpg` | 완료 |
| `images/bg_room.jpg` | 완료 |
| `images/bg_school.jpg` | 완료 |
| `images/bg_stadium.png` | 완료 |
| `images/bg_street.png` | 완료 |
| `images/buddy.png` | 완료 |
| `images/child.png` | 완료 |
| `images/coach_high.png` | 완료 |
| `images/coach_little.png` | 완료 |
| `images/hero_college.png` | 완료 |
| `images/hero_college_plain.png` | 완료 |
| `images/hero_college_ugly.png` | 완료 |
| `images/hero_elementary.png` | 완료 |
| `images/hero_elementary_plain.png` | 완료 |
| `images/hero_elementary_ugly.png` | 완료 |
| `images/hero_high.png` | 완료 |
| `images/hero_high_plain.png` | 완료 |
| `images/hero_high_ugly.png` | 완료 |
| `images/hero_injured.png` | 완료 |
| `images/hero_injured_plain.png` | 완료 |
| `images/hero_injured_ugly.png` | 완료 |
| `images/hero_middle.png` | 완료 |
| `images/hero_middle_plain.png` | 완료 |
| `images/hero_middle_ugly.png` | 완료 |
| `images/hero_mlb.png` | 완료 |
| `images/hero_mlb_plain.png` | 완료 |
| `images/hero_mlb_ugly.png` | 완료 |
| `images/hero_pro.png` | 완료 |
| `images/hero_pro_plain.png` | 완료 |
| `images/hero_pro_ugly.png` | 완료 |
| `images/hero_retired.png` | 완료 |
| `images/hero_retired_plain.png` | 완료 |
| `images/hero_retired_ugly.png` | 완료 |
| `images/hero_slump.png` | 완료 |
| `images/hero_slump_plain.png` | 완료 |
| `images/hero_slump_ugly.png` | 완료 |
| `images/hero_victory.png` | 완료 |
| `images/hero_victory_plain.png` | 완료 |
| `images/hero_victory_ugly.png` | 완료 |
| `images/heroine10.png` | 완료 |
| `images/heroine10_lover.png` | 완료 |
| `images/heroine10_wedding.png` | 완료 |
| `images/heroine10_wife.png` | 완료 |
| `images/heroine11.png` | 완료 |
| `images/heroine11_lover.png` | 완료 |
| `images/heroine11_wedding.png` | 완료 |
| `images/heroine11_wife.png` | 완료 |
| `images/heroine12.png` | 완료 |
| `images/heroine12_lover.png` | 완료 |
| `images/heroine12_wedding.png` | 완료 |
| `images/heroine12_wife.png` | 완료 |
| `images/heroine13.png` | 완료 |
| `images/heroine13_lover.png` | 완료 |
| `images/heroine13_wedding.png` | 완료 |
| `images/heroine13_wife.png` | 완료 |
| `images/heroine14.png` | 완료 |
| `images/heroine14_lover.png` | 완료 |
| `images/heroine14_wedding.png` | 완료 |
| `images/heroine14_wife.png` | 완료 |
| `images/heroine15.png` | 완료 |
| `images/heroine15_lover.png` | 완료 |
| `images/heroine15_wedding.png` | 완료 |
| `images/heroine15_wife.png` | 완료 |
| `images/heroine1_lover.png` | 완료 |
| `images/heroine1_meet.png` | 완료 |
| `images/heroine1_spouse.png` | 완료 |
| `images/heroine1_wedding.png` | 완료 |
| `images/heroine2_lover.png` | 완료 |
| `images/heroine2_meet.png` | 완료 |
| `images/heroine2_spouse.png` | 완료 |
| `images/heroine2_wedding.png` | 완료 |
| `images/heroine3_lover.png` | 완료 |
| `images/heroine3_meet.png` | 완료 |
| `images/heroine3_spouse.png` | 완료 |
| `images/heroine3_wedding.png` | 완료 |
| `images/heroine4_lover.png` | 완료 |
| `images/heroine4_meet.png` | 완료 |
| `images/heroine4_spouse.png` | 완료 |
| `images/heroine4_wedding.png` | 완료 |
| `images/heroine5_lover.png` | 완료 |
| `images/heroine5_meet.png` | 완료 |
| `images/heroine5_spouse.png` | 완료 |
| `images/heroine5_wedding.png` | 완료 |
| `images/heroine6_lover.png` | 완료 |
| `images/heroine6_meet.png` | 완료 |
| `images/heroine6_spouse.png` | 완료 |
| `images/heroine6_wedding.png` | 완료 |
| `images/heroine7.png` | 완료 |
| `images/heroine7_lover.png` | 완료 |
| `images/heroine7_wedding.png` | 완료 |
| `images/heroine7_wife.png` | 완료 |
| `images/heroine8.png` | 완료 |
| `images/heroine8_lover.png` | 완료 |
| `images/heroine8_wedding.png` | 완료 |
| `images/heroine8_wife.png` | 완료 |
| `images/heroine9.png` | 완료 |
| `images/heroine9_lover.png` | 완료 |
| `images/heroine9_wedding.png` | 완료 |
| `images/heroine9_wife.png` | 완료 |
| `images/interpreter.png` | 완료 |
| `images/manager_pro.png` | 완료 |
| `images/mlb_teammate.png` | 완료 |
| `images/parents.png` | 완료 |
| `images/rival.png` | 완료 |
| `images/teammate.png` | 완료 |
| `images/hero_college_gk.png` | 완료 |
| `images/hero_college_gk_plain.png` | 완료 |
| `images/hero_college_gk_ugly.png` | 완료 |
| `images/hero_elementary_gk.png` | 완료 |
| `images/hero_elementary_gk_plain.png` | 완료 |
| `images/hero_elementary_gk_ugly.png` | 완료 |
| `images/hero_high_gk.png` | 완료 |
| `images/hero_high_gk_plain.png` | 완료 |
| `images/hero_high_gk_ugly.png` | 완료 |
| `images/hero_middle_gk.png` | 완료 |
| `images/hero_middle_gk_plain.png` | 완료 |
| `images/hero_middle_gk_ugly.png` | 완료 |
| `images/hero_mlb_gk.png` | 완료 |
| `images/hero_mlb_gk_plain.png` | 완료 |
| `images/hero_mlb_gk_ugly.png` | 완료 |
| `images/hero_pro_gk.png` | 완료 |
| `images/hero_pro_gk_plain.png` | 완료 |
| `images/hero_pro_gk_ugly.png` | 완료 |
| `images/coach_tactics_success.png` | 완료 |
| `images/coach_tactics_failure.png` | 완료 |

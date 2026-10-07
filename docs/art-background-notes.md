# Football Life 새 배경 9장

2026-10-07, built-in `image_gen.imagegen`으로 각각 독립 생성했습니다. 도구가 반환한 실제 파일 경로에서 원본을 복사했고, 저장된 생성본과 게임 파일의 실제 픽셀을 확인했습니다. 세부 프롬프트·원본/생성본/출력 SHA-256·경로·용량은 `art-background-manifest.json`에 있습니다.

새 배경은 불투명 3:2 세밀한 픽셀아트입니다. 경기장은 야간 축구장으로 직사각 피치, 중앙선/원, 페널티박스, 양끝 골대와 망을 확인했습니다. 실내의 야구공 그림은 축구공 그림으로 바뀌었습니다. 학교는 소규모 축구 연습장을 포함합니다. 교실·가족 거실·개인 방·사무실·행사장·거리는 원래 생활 맥락을 유지합니다. 등장인물이 없는 배경이라 인체 검수 대상은 없습니다. 야구 장비와 실제 구단 표시는 발견하지 않았습니다.

원본 9장은 `assets/football-generated/background-originals/`에 그대로 보존했습니다. 기존 이미지 출처와 라이선스는 `images/README.md`, `data/settings.js`의 그림출처 및 저장소 역사에 남아 있습니다. 특히 기존 무료 배경의 OpenGameArt 작가 Midnight68 (CC0), Homunculus (CC BY 3.0), Spiral Atlas (CC BY 4.0), DasBilligeAlien (CC0), frances (CC BY 3.0)의 귀속은 새 AI 생성본의 출처로 오인하지 않도록 구분합니다. 새 배경은 이 작업의 imagegen 생성 자산입니다.

웹 출력은 기존 경로와 확장자를 유지한 1200×800 RGB입니다. 크기 변환은 Pillow Lanczos, JPEG 6장은 quality 88 / progressive / optimize, PNG 3장은 lossless optimize로 저장했습니다. 창작 비트맵 자체는 전부 imagegen이 생성했으며 코드로 그림을 대체하지 않았습니다. 합계 6,355,437바이트. 생성 원본은 별도 보존합니다.

배경 파일 9개 디코딩·해시·치수 검사는 통과했습니다. 모바일 및 PC 실제 게임 UI 통합 검수는 전체 인물 교체 후 부모 작업에서 수행해야 합니다. 이 작업에서는 게임 코드·저장 구조·매핑을 바꾸지 않았고 공개 push/배포도 실행하지 않았습니다.

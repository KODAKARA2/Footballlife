# Football Life — 축구 인생 카드

가상의 국내·해외 구단에서 축구 선수의 삶을 이어가는 정적 HTML/CSS/JS 게임입니다. 유소년·학교 → 입단 제안·대학·공개 테스트 → 국내 프로 → 해외 도전·복귀 → 은퇴로 이어집니다. 연애·결혼·자녀·2세·자유행동·상점·도감을 유지합니다.

## 온라인 실행

저장소: https://github.com/KODAKARA2/Footballlife

GitHub Pages 주소: https://kodakara2.github.io/Footballlife/

최초 1회 저장소 **Settings → Pages → Source → GitHub Actions**로 설정합니다. `Publish Football Life` 작업이 성공하면 위 주소에서 실행할 수 있습니다. 이후 `main` 변경 시 자동 배포합니다. 원본 야구 도메인은 사용하지 않습니다.

## 로컬 실행

`index.html`을 브라우저로 열거나, 이 폴더에서 다음 명령을 실행한 뒤 같은 컴퓨터의 `http://localhost:8173`에 접속합니다.

```sh
python3 -m http.server 8173 --bind 127.0.0.1
```

빌드·온라인 서비스·외부 API가 필요 없습니다. 개발 검증 도구는 Node.js를 사용합니다. 클라우드 내부 localhost는 사용자 PC에서 접근하는 공개 주소가 아닙니다.

## 개발 검증

게임 실행 자체에는 npm 설치가 필요 없습니다. 테스트는 Node.js 20 이상에서 실행합니다.

```sh
npm install
npm test
npm run test:graphics
npm run test:feedback
```

브라우저 검사는 설치된 Chromium/Chrome 또는 Playwright Chromium을 사용합니다. 필요하면 `npx playwright install chromium`으로 설치하거나 `CHROMIUM_PATH`에 실행 파일 경로를 지정하세요. `npm run test:engine`은 화면 없는 검사, `npm run test:browser`는 실제 브라우저 검사입니다. 상세 결과는 `tools/results/test-report-all.json`과 각 `.log` 파일에 기록됩니다.

## 원본과 격리

- 원본: https://github.com/KODAKARA2/baseball-life
- 기준 main: `5301925c86c12997f56732d8b97dc23e24f12405` (2026-10-07 원격 확인)
- 검증 원본 작업 폴더: `/workspace/football-life`, 출판 작업 폴더: `/workspace/football-life-publish`. 기존 야구 프로젝트는 수정하지 않았습니다.
- 저장: `football-life-save-v2`, `football-life-bonus-looks-v2`, `football-life-collection-v2`. 기존 야구 저장은 읽거나 삭제하지 않습니다.
- 원본 `CNAME`은 `CNAME.disabled`로 보관했습니다. 사용자의 2026-10-07 후속 승인에 따라 새 `KODAKARA2/Footballlife` 저장소와 GitHub Pages만 게시 대상으로 사용합니다.

## 수정과 검증

데이터 작성법은 [안내서](안내서.md), 인수인계와 검증 결과는 [개발노트](개발노트.md)를 참고하세요. 원본 문서는 `docs/upstream/`에 출처 기록으로 보존합니다.

기존110장 전체 교체와 골키퍼 전용18장 추가를 포함한 감독 컷인2종까지 총130장 제작 내역은 [그래픽 제작 기록](docs/GRAPHICS-WORKFLOW.md)과 [진행 목록](docs/art-progress.json)에 기록합니다. [그래픽 검수 목록](docs/GRAPHICS-TODO.md)에서 완료 상태와 연결 위치를 확인할 수 있습니다. 기존 `data/settings.js`의 그림 출처, `assets`의 원본·프롬프트·라이선스, Pretendard OFL 라이선스를 보존합니다.

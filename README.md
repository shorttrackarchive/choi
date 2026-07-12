# 최민정 은퇴 헌정 웹앱

대한민국 쇼트트랙 선수 최민정의 은퇴를 기리는 독립형 디지털 헌정 웹앱입니다.

현재 버전은 실제 기록과 사진을 임의로 넣지 않고, 추후 제공될 자료를 입력하면 바로 공개 가능한 구조와 화면을 먼저 완성하는 것을 목표로 합니다.

## 기술 구조

- Vinext / Next App Router
- React 19
- TypeScript
- Tailwind CSS 진입점 위에 커스텀 CSS
- Supabase REST API 연동 구조
- pnpm

## 주요 파일

- 메인 페이지: `app/page.tsx`
- 관리자 페이지: `app/admin/page.tsx`
- 전체 스타일: `app/globals.css`
- 콘텐츠 데이터: `src/data/tributeData.ts`
- 헌정 페이지 컴포넌트: `src/components/tribute/`
- 메시지 관리자 컴포넌트: `src/components/admin/`
- Supabase REST 연동: `src/lib/supabaseRest.ts`
- IP 제한 투표 API 안내: `docs/ip-limited-poll-api.md`
- 콘텐츠 입력 가이드: `docs/content-entry-guide.md`
- Supabase SQL/RLS 설계: `docs/supabase-schema.sql`

## 로컬 실행

```bash
pnpm install
pnpm run dev
```

로컬 미리보기:

- 헌정 페이지: `http://localhost:3000/`
- 메시지 관리자: `http://localhost:3000/admin`

## 빌드

```bash
pnpm run build
```

## 환경변수

`.env.example`을 참고해 배포 환경에 등록합니다.

```env
NEXT_PUBLIC_SITE_URL=https://your-site.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_POLL_API_URL=https://your-project.supabase.co/functions/v1/poll-vote
NEXT_PUBLIC_TRIBUTE_DEMO_MODE=false
```

GitHub Pages 배포에서는 저장소 Variables에 `VITE_POLL_API_URL`을 등록하면
정적 빌드에 투표 API 주소가 주입됩니다.

## 실제 자료 입력

대부분의 자료는 `src/data/tributeData.ts`에 입력합니다. 이미지 파일은 `public/images/tribute/` 아래 섹션별 폴더에 추가한 뒤 데이터의 `image.src`에 경로를 연결합니다.

BGM은 `public/audio/tribute-bgm.mp3`에 음원 파일을 추가하면 됩니다. 페이지는 로드 직후 재생을 시도하고, 브라우저가 막으면 우측 하단의 BGM 버튼이나 첫 화면 상호작용으로 다시 재생을 시도합니다.

## GitHub Pages

GitHub Pages용 정적 빌드는 별도로 준비되어 있습니다.

```bash
pnpm run build:github
```

GitHub 저장소에서는 `Settings -> Pages -> Source`를 `GitHub Actions`로 설정한 뒤
`main` 브랜치에 push하면 `.github/workflows/github-pages.yml`이 `dist-github/`
결과물을 배포합니다. 자세한 안내는 `docs/github-pages.md`를 확인하세요.

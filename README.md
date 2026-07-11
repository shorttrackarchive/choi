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
NEXT_PUBLIC_TRIBUTE_DEMO_MODE=false
```

## 실제 자료 입력

대부분의 자료는 `src/data/tributeData.ts`에 입력합니다. 이미지 파일은 `public/images/tribute/` 아래 섹션별 폴더에 추가한 뒤 데이터의 `image.src`에 경로를 연결합니다.

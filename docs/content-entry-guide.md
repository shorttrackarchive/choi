# 최민정 은퇴 헌정 웹앱 콘텐츠 입력 가이드

이 프로젝트는 실제 기록, 인터뷰, 사진을 코드 곳곳에 흩어 넣지 않고 `src/data/tributeData.ts` 한 파일에서 관리하도록 만들었습니다.

## 핵심 입력 파일

- 콘텐츠 데이터: `src/data/tributeData.ts`
- 공통 이미지 컴포넌트: `src/components/tribute/TributeImage.tsx`
- 팬 메시지 및 관리자 Supabase 연결: `src/lib/supabaseRest.ts`
- Supabase 테이블/RLS 설계: `docs/supabase-schema.sql`

## 섹션별 데이터 위치

- 오프닝 히어로: `tributeData.hero`
- 최민정이 남긴 기록: `tributeData.careerSummary.metrics`
- 최민정이 달려온 시간: `tributeData.timeline`
- 우리가 기억하는 순간: `tributeData.highlights`
- 최민정을 말하는 키워드: `tributeData.keywords`
- 눈물의 기록: `tributeData.tears`
- 최민정의 목소리: `tributeData.quotes`
- 당신의 최민정: `tributeData.polls`
- 오랫동안 기억하겠습니다: `tributeData.closing`

## 이미지 폴더

사진은 다음 폴더에 나누어 넣습니다.

- 히어로: `public/images/tribute/hero/`
- 기록: `public/images/tribute/career/`
- 시즌별 시간: `public/images/tribute/timeline/`
- 하이라이트: `public/images/tribute/highlights/`
- 키워드: `public/images/tribute/keywords/`
- 눈물의 기록: `public/images/tribute/tears/`
- 인터뷰/목소리: `public/images/tribute/quotes/`
- 마지막 장면: `public/images/tribute/closing/`

## 이미지 연결 방법

이미지 파일을 `public/images/tribute/highlights/highlight-01.webp`처럼 추가한 뒤 `src/data/tributeData.ts`에서 해당 항목의 `image.src`를 입력합니다.

```ts
image: {
  src: "/images/tribute/highlights/highlight-01.webp",
  alt: "하이라이트 장면 설명",
  placeholder: "HIGHLIGHT 01",
  position: "50% 35%",
  ratio: "16 / 10",
}
```

`src`가 비어 있으면 디자인된 placeholder가 표시되고, `src`가 입력되면 placeholder 식별자는 자동으로 사라집니다.

## 팬 메시지 운영 흐름

1. 팬이 `최민정에게` 섹션에서 닉네임과 150자 이내 메시지를 제출합니다.
2. 메시지는 `pending` 상태로 저장됩니다.
3. 관리자가 `/admin`에서 Supabase Auth로 로그인합니다.
4. 관리자는 승인 대기, 승인됨, 거절됨 상태를 필터링해 확인합니다.
5. 승인된 메시지만 공개 페이지의 메시지 월에 표시됩니다.

## 환경변수

Next/Vinext 구조이므로 공개 클라이언트 환경변수는 `NEXT_PUBLIC_` 접두사를 사용합니다.

```env
NEXT_PUBLIC_SITE_URL=https://your-site.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_TRIBUTE_DEMO_MODE=false
```

## 로컬 실행

```bash
pnpm install
pnpm run dev
```

로컬 주소는 기본적으로 `http://localhost:3000/`입니다. 관리자 화면은 `http://localhost:3000/admin`입니다.

## 배포

GitHub에 업로드한 뒤 Sites, Netlify, Cloudflare Pages 등 정적/프론트엔드 호스팅에 연결할 수 있습니다.

기본 빌드 명령:

```bash
pnpm run build
```

환경변수는 배포 서비스의 설정 화면에 등록합니다.

## 실제 자료를 받았을 때 주로 수정할 파일

대부분의 실제 자료 입력은 `src/data/tributeData.ts`에서 끝나야 합니다.

수정 대상이 될 수 있는 파일:

- 실제 콘텐츠와 이미지 경로: `src/data/tributeData.ts`
- Supabase 테이블 적용: `docs/supabase-schema.sql`
- 필요 시 메시지/투표 저장 로직 확장: `src/lib/supabaseRest.ts`

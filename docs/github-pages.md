# GitHub Pages 배포 가이드

이 프로젝트는 GitHub Pages용 정적 빌드를 별도로 제공합니다. 기존
Vinext/Sites 빌드는 유지하고, GitHub Pages에서는 `dist-github` 결과물만
배포합니다.

## 로컬 확인

```bash
pnpm install
pnpm run build:github
```

빌드 결과는 `dist-github/`에 생성됩니다.

## GitHub 저장소 설정

1. 이 프로젝트를 GitHub 저장소의 `main` 브랜치에 올립니다.
2. GitHub 저장소에서 `Settings -> Pages`로 이동합니다.
3. `Build and deployment`의 `Source`를 `GitHub Actions`로 선택합니다.
4. `main` 브랜치에 push하면 `.github/workflows/github-pages.yml`이 실행됩니다.
5. 배포가 끝나면 Actions 결과 또는 Pages 설정 화면에서 URL을 확인합니다.

## Supabase 환경 변수

팬 메시지와 관리자 승인을 실제로 쓰려면 GitHub 저장소의
`Settings -> Secrets and variables -> Actions -> Variables`에 아래 값을
추가합니다.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

변수를 비워두면 사이트는 데모 모드로 열리고, 메시지는 실제 저장소에 저장되지
않습니다.

## 이미지 경로

이미지는 계속 `public/images/tribute/` 아래에 넣습니다. 데이터 파일에서는 기존과
같이 `/images/tribute/...` 경로를 사용하면 됩니다. GitHub Pages가
`/repo-name/` 아래에서 열릴 때도 정적 빌드가 이미지 base path를 보정합니다.

## 관리자 페이지

GitHub Pages 배포 후 관리자 페이지는 아래 형식입니다.

```text
https://<owner>.github.io/<repo>/admin/
```

사용자/조직 페이지 저장소(`<owner>.github.io`)인 경우에는 아래 형식입니다.

```text
https://<owner>.github.io/admin/
```

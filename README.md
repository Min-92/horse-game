# 말 뽑기 도감 (Horse Game)

TypeScript + React + Vite로 만든 정적 웹 프로젝트입니다.

## 기능
- 말 뽑기 (20종 랜덤)
- 획득한 말 도감 보기
- 최근 뽑기 이력 보기
- localStorage 저장 (새로고침 후 유지)

## 개발 실행
```bash
npm install
npm run dev
```

## 빌드
```bash
npm run build
npm run preview
```

## GitHub Pages 배포 팁
- 이 프로젝트는 `vite.config.ts`에서 `base: './'`로 설정되어 있어 정적 호스팅에 바로 올리기 쉽습니다.
- `dist/` 폴더를 GitHub Pages에 배포하면 됩니다.

# Nico – Lernplan 🎒

독일 어린이를 위한 학습 계획 웹앱. GitHub Pages에서 바로 실행됩니다.

## 파일 구조

```
nico-lernplan/
├── index.html          ← 메인 (달력 + 과목 개요)
├── deutsch.html        ← 독일어 루틴
├── mathe.html          ← 수학 루틴
├── natur.html          ← 자연과학 루틴
├── englisch.html       ← 영어 루틴
├── css/
│   └── style.css       ← 공통 스타일 (다크모드 포함)
└── js/
    ├── store.js        ← localStorage 데이터 관리
    ├── calendar.js     ← 달력 렌더 + 날짜별 기록
    ├── nav.js          ← 네비게이션 + 날짜 표시
    └── subject.js      ← 체크박스 + 진행률 공통 로직
```

## GitHub Pages 배포 방법

1. GitHub에서 새 Repository 생성
2. 이 폴더의 파일을 전부 업로드 (또는 `git push`)
3. Settings → Pages → Source: `main` 브랜치 루트 선택
4. 저장 후 `https://{username}.github.io/{repo-name}/` 접속

## 기능

- 📅 달력 — 날짜 클릭 시 그날 공부 기록 표시, 과목별 색깔 점
- 📖🔢🌿🌍 4과목 페이지 — 예습/1차복습/저녁공부/2차복습 루틴
- ✅ 체크박스 — localStorage에 자동 저장 (새로고침 유지)
- 🌙 다크모드 — OS 설정에 따라 자동 전환
- 📱 반응형 — 모바일/태블릿 대응

## 모듈 역할

| 파일 | 역할 |
|------|------|
| `store.js` | localStorage 읽기/쓰기, 데모 데이터 시드 |
| `calendar.js` | 달력 렌더, 날짜 클릭 핸들러, 과목 점 표시 |
| `nav.js` | 네비게이션 링크 렌더, 날짜 문자열 포맷 |
| `subject.js` | 체크박스 토글, 진행률 계산, 상태 복원, 탭 전환 |

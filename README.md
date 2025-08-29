# 🌱 Pleanet (플리닛) - Frontend

작은 약속(Pledge)이 지구(Planet)를 바꿉니다.  

Pleanet은 일상 속 친환경 활동을 게임처럼 즐기고, 실질적인 보상으로 연결하여 꾸준한 습관 형성을 돕는 친환경 루틴 챌린지 앱입니다.  
이 저장소는 Pleanet의 프론트엔드 개발을 위한 공간입니다.

---

## ✨ 주요 기능 (Key Features)

- 📸 간편한 챌린지 인증: 텀블러 사용, 걷기 등 다양한 친환경 활동을 사진과 GPS로 인증
- 🤖 AI 자동 판별: TensorFlow Lite를 활용하여 제출된 인증 사진을 자동으로 판별
- 🎮 게이미피케이션: 포인트, 레벨, 랭킹, 뱃지 시스템을 통해 지속적인 동기부여
- 💸 실질적인 리워드: 포인트를 제로페이로 전환하거나 나무 심기 프로젝트에 기부 가능
- 🤝 지역 상생 모델: 개인의 친환경 활동이 지역 경제 활성화로 이어지는 선순환 구조 지향

---

## 🛠️ 기술 스택 (Tech Stack)

- Main: `React Native`, `Expo`
- Navigation: `React Navigation` (예정)
- State Management: `Zustand` (예정)
- Collaboration: `Git`, `GitHub`, `Figma`

---

## 🏗️ 아키텍처 (Architecture)

본 프로젝트는 MVVM (Model-View-ViewModel) 패턴을 Custom Hooks를 활용해 구현합니다.  
이 구조는 UI와 비즈니스 로직을 명확하게 분리하여 유지보수성과 테스트 용이성을 높입니다.

- View: UI 렌더링 및 사용자 입력 처리 (`/screens`)
- ViewModel: View를 위한 상태와 비즈니스 로직 관리 (`/hooks`)
- Model: API 통신 등 데이터 관련 로직 처리 (`/api`)

---

## 🌿 Branch 전략

본 프로젝트는 Gitflow 브랜치 전략을 따릅니다.

<img width="600" height="800" alt="git" src="https://github.com/user-attachments/assets/6754c9a1-072e-4b74-b10d-a885f6887de4" />

- `main`: 배포 가능한 단위의 브랜치
- `release`: 배포 전 테스트용 브랜치
- `develop`: 개발 중인 브랜치
- `feature/#issue_number`: 개발 단위별 브랜치
- `hotfix`: `master` 브랜치의 긴급 버그 수정 브랜치

### 개발 흐름
1. 개발할 기능에 대한 이슈 등록 후 번호 발급  
2. `develop` 브랜치에서 분기 → `feature/#issue_number` 브랜치 생성 및 작업  
3. 작업 완료 후 Pull Request 작성 → 리뷰 후 병합  

---

## 📝 Commit 규칙

형식:
| 헤더      | 설명 |
|-----------|------|
| feat      | 새로운 기능 추가 |
| fix       | 버그 수정 |
| build     | 빌드 관련 수정 / 모듈 설치·삭제 |
| chore     | 기타 자잘한 수정 |
| ci        | CI 관련 설정 수정 |
| docs      | 문서 수정 |
| style     | 코드 스타일·포맷 수정 |
| refactor  | 코드 리팩토링 |
| test      | 테스트 코드 수정 |
| perf      | 성능 개선 |

#### 예시
---

## 📌 Issue

- Feature Template: 기능 추가용 이슈  
- Bug Template: 버그 수정용 이슈  

---

## 🔀 Pull Request

- PR은 저장소에 등록된 템플릿을 사용하여 작성합니다.  

---

## 🎯 Convention

### 네이밍 규칙
- 코틀린 파일 이름: `PascalCase`  
- 패키지 이름: 소문자  
- 컴포저블 함수: `PascalCase`  
- 일반 함수: 동사 시작 `camelCase`  
- 변수명: `camelCase` (람다 변수 포함)  
- 한국어 발음 표기 금지  
- 상수: 대문자 `SNAKE_CASE`  
- 콜백 함수: `on` 접두사 사용 (ex: `onButtonClicked`, `onDataLoaded`)  
- 상태 변수: `is`, `has` 접두사 사용 (ex: `isLoading`, `hasError`)  

---

## 🚀 시작하기 (Getting Started)

```bash
# 1. 저장소 복제
git clone https://github.com/9oormthon-univ/2025_SEASONTHON_TEAM_83_FE.git

# 2. 폴더 이동
cd 2025_SEASONTHON_TEAM_83_FE

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npx expo start
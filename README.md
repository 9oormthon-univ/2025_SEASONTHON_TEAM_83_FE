<div align="center">

# 🌱 Pleanet (플리닛) - Frontend

**작은 약속(Pledge)이 지구(Planet)를 바꿉니다.**

</div>

<br>

Pleanet은 일상 속 친환경 활동을 게임처럼 즐기고, 실질적인 보상으로 연결하여 꾸준한 습관 형성을 돕는 **친환경 루틴 챌린지 앱**입니다. 이 저장소는 Pleanet의 프론트엔드 개발을 위한 공간입니다.

---

## ✨ 주요 기능 (Key Features)

- **📸 간편한 챌린지 인증**: 텀블러 사용, 걷기 등 다양한 친환경 활동을 사진과 GPS로 간편하게 인증합니다.
- **🤖 AI 자동 판별**: TensorFlow Lite를 활용하여 제출된 인증 사진을 자동으로 판별합니다.
- **🎮 즐거운 게이미피케이션**: 포인트, 레벨, 랭킹, 뱃지 시스템을 통해 지속적인 동기를 부여합니다.
- **💸 실질적인 리워드**: 누적된 포인트를 제로페이로 전환하거나 나무 심기 프로젝트에 기부할 수 있습니다.
- **🤝 지역 상생 모델**: 개인의 친환경 활동이 지역 경제 활성화로 이어지는 선순환 구조를 지향합니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Main**: `React Native`, `Expo`
- **Navigation**: `React Navigation` (예정)
- **State Management**: `Zustand` (예정)
- **Collaboration**: `Git`, `GitHub`, `Figma`

---

## 🏗️ 아키텍처 (Architecture)

본 프로젝트는 **MVVM (Model-View-ViewModel) 패턴**을 **Custom Hooks**를 활용하여 구현합니다. 이 구조는 UI와 비즈니스 로직을 명확하게 분리하여 코드의 유지보수성과 테스트 용이성을 높입니다.

- **View**: UI 렌더링 및 사용자 입력 처리 (`/screens`)
- **ViewModel**: View를 위한 상태와 비즈니스 로직 관리 (`/hooks`)
- **Model**: API 통신 등 데이터 관련 로직 처리 (`/api`)

---

## 🚀 시작하기 (Getting Started)

```bash
# 1. 저장소 복제
git clone [https://github.com/9oormthon-univ/2025_SEASONTHON_TEAM_83_FE.git](https://github.com/9oormthon-univ/2025_SEASONTHON_TEAM_83_FE.git)

# 2. 폴더 이동
cd 2025_SEASONTHON_TEAM_83_FE

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npx expo start
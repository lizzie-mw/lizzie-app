# 꼬물톡 (Ggomul-Talk) - 테스트 리포트

## 테스트 환경

| 항목 | 내용 |
|------|------|
| 테스트 일자 | 2026-02-07 |
| 시뮬레이터 | iPhone 17 Pro (iOS 26.2) |
| Expo SDK | 54.0.33 |
| Metro Bundler | localhost:8081 |
| Backend API | https://web-production-7cd80.up.railway.app |

---

## 1. 빌드 테스트

### 1.1 TypeScript 컴파일
- **상태**: PASS
- **명령어**: `npx tsc --noEmit`
- **결과**: 에러 없이 통과. 모든 10개 iteration의 변경사항이 타입 안전함을 확인.

### 1.2 Metro 번들링
- **상태**: PASS
- **명령어**: `npx expo start --port 8081`
- **결과**: Metro Bundler 정상 시작, iOS 번들 생성 완료

### 1.3 Development Build
- **상태**: PASS (빌드 성공, 설치 성공)
- **명령어**: `npx expo run:ios --device "iPhone 17 Pro"`
- **결과**: Xcode 빌드 성공, 시뮬레이터 설치 완료

---

## 2. 런타임 테스트

### 2.1 Development Build 런타임
- **상태**: PASS
- **결과**: 앱 정상 실행, 로그인 화면 렌더링 성공
- **이전 이슈 해결**:
  - ~~`[WorkletsError] Mismatch between JavaScript part and native part of Worklets`~~ → `react-native-worklets@0.5.1` 명시적 pinning으로 해결
  - ~~`Native module RNFBAppModule not found`~~ → 클린 빌드로 해결 (Firebase 의존성 없음 확인)

### 2.2 해결 내용
- `react-native-worklets@0.5.1`을 package.json에 명시적으로 추가 (Expo SDK 54 호환 버전)
- `expo@~54.0.33`, `expo-router@~6.0.23`으로 업데이트 (`npx expo install --check` 권장 버전)
- `@react-native-community/netinfo@11.4.1`로 다운그레이드 (Expo SDK 54 호환 버전)
- ios/, node_modules/, bun.lock 전체 클린 후 재빌드

---

## 3. 코드 품질 테스트

### 3.1 Iteration별 변경사항 타입 검증
모든 iteration 후 `npx tsc --noEmit` 통과 확인:

| Iteration | 검증 | 커밋 |
|-----------|------|------|
| 1. Safe Area & Layout | PASS | ✅ |
| 2. API Error & Optimistic Delete | PASS | ✅ |
| 3. SSE Retry & Korean Particles | PASS | ✅ |
| 4. Input Focus & Chat UX | PASS | ✅ |
| 5. EmptyState & List Items | PASS | ✅ |
| 6. Onboarding & Login | PASS | ✅ |
| 7. Pull-to-Refresh | PASS | ✅ |
| 8. Date Separators | PASS | ✅ |
| 9. Network Banner & Haptics | PASS | ✅ |
| 10. Design Refinement | PASS | ✅ |

### 3.2 FSD 아키텍처 규칙 준수
- **import 방향**: 모든 변경사항이 상위→하위 레이어 import 규칙 준수
  - `widgets` → `entities`, `shared` ✅
  - `features` → `entities`, `shared` ✅
  - `entities` → `shared` ✅
- **공개 API**: 모든 새 컴포넌트/함수가 index.ts를 통해 export ✅

### 3.3 Expo 의존성 호환성
- `npx expo install --check`: 모든 패키지 호환 확인 ✅

---

## 4. 시각적 검증

### 4.1 로그인 화면
- **상태**: PASS
- 꼬물톡 로고 및 앱 이름 표시 ✅
- "도마뱀과 함께하는 케어 파트너" 서브타이틀 ✅
- Google 로그인 버튼 ✅
- DEV: Mock 로그인 버튼 (개발 환경) ✅
- 이용약관 안내 텍스트 ✅
- 배경 장식 요소 (연두색 원형) ✅

### 4.2 홈 화면
- **상태**: PASS (Mock 로그인 + Maestro E2E)
- 헤더: 꼬물톡 로고 + 설정 아이콘 ✅
- LizardProfileCard: 이름(리치), 종류(레오파드 게코), 나이(3살), 성격(활발한), 편집 아이콘 ✅
- 대화 섹션: "대화" 타이틀 + "0 / 5" 카운터 뱃지 ✅
- EmptyState: "아직 대화가 없어요" + 안내 메시지 ✅
- FAB (NewChatButton): 하단 우측 초록색 버튼 ✅

### 4.3 설정 화면
- **상태**: PASS
- 프로필 헤더: LizardAvatar + "리치" + 서브타이틀 ✅
- 메뉴 아이템: "도마뱀 정보" (초록 아이콘) ✅
- 메뉴 아이템: "계정" (초록 아이콘) ✅
- 메뉴 아이템: "로그아웃" (빨간 아이콘, 별도 카드) ✅
- 버전 표시: "꼬물톡 v1.0.0" (하단) ✅

### 4.4 도마뱀 정보 화면
- **상태**: PASS
- 프로필 이미지: LizardAvatar + 카메라 아이콘 + "탭하여 사진 변경" ✅
- 기본 정보 카드: 이름(리치), 종류(레오파드 게코), 생년월(2023-01) ✅
- 성격 정보 카드: 성별(수컷), 성격(활발한) ✅
- 폼 필드: Input, Select 컴포넌트 정상 렌더링 ✅

### 4.5 계정 화면
- **상태**: PASS
- 계정 정보 카드: 이메일(-), 가입일(-) 아이콘 + 라벨 ✅
- 위험 영역: 빨간 카드 + 경고 문구 + "계정 삭제" 버튼 ✅

### 4.6 네비게이션
- **상태**: PASS
- 홈 → 설정 (gear icon tap) ✅
- 설정 → 도마뱀 정보 (메뉴 아이템 tap) ✅
- 도마뱀 정보 → 설정 (back button) ✅
- 설정 → 계정 (메뉴 아이템 tap) ✅
- 계정 → 설정 → 홈 (back navigation) ✅

### 4.7 미검증 화면
- [ ] 채팅 화면 (실제 백엔드 인증 필요)
- [ ] 온보딩 화면 (도마뱀 미등록 상태 필요)
- [ ] 네트워크 끊김 (NetworkBanner)

### 4.8 알려진 시각적 이슈
- MaterialCommunityIcons `lizard` 아이콘이 "?" 로 표시됨 (폰트 로딩 이슈, 기능에는 영향 없음)

---

## 5. Maestro E2E 테스트

### 5.1 테스트 플로우
- **파일**: `.maestro/ux-full-verification.yaml`
- **도구**: Maestro CLI v2.1.0
- **방식**: Mock 로그인 → 전체 화면 탐색 → 스크린샷 캡처

### 5.2 결과
| 단계 | 화면 | 상태 |
|------|------|------|
| ux-01 | 로그인 화면 | PASS |
| ux-02 | 홈 화면 | PASS |
| ux-03 | 설정 화면 | PASS |
| ux-04 | 도마뱀 정보 화면 | PASS |
| ux-05 | 설정 (뒤로) | PASS |
| ux-06 | 계정 화면 | PASS |
| ux-07 | 홈 (최종) | PASS |

---

## 6. 테스트 결론

### 통과 항목
- TypeScript 정적 타입 검증: **10/10 iterations PASS**
- FSD 아키텍처 규칙: **PASS**
- Expo 의존성 호환성: **PASS**
- 빌드 (번들링 & 네이티브 빌드): **PASS**
- 런타임 실행: **PASS**
- 로그인 화면 시각적 검증: **PASS**
- 홈 화면 시각적 검증: **PASS**
- 설정 화면 시각적 검증: **PASS**
- 도마뱀 정보 화면 시각적 검증: **PASS**
- 계정 화면 시각적 검증: **PASS**
- 전체 네비게이션 흐름: **PASS**
- Maestro E2E (7 steps): **PASS**

### 미통과 항목
- 없음

### 추가 테스트 필요
- 채팅 화면 (실제 백엔드 인증 필요)
- 온보딩 화면 (도마뱀 미등록 상태)
- 네트워크 끊김 시 NetworkBanner 동작

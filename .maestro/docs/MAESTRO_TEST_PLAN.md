# Maestro E2E Test Plan - Lizzie App

**분석 일시**: 2026-01-10
**분석 대상**: Lizzie App (도마뱀 반려인 AI 챗봇)
**프레임워크**: React Native + Expo Router
**Maestro 버전**: 2.0.10

## Executive Summary

Lizzie 앱의 E2E 테스트 현황을 분석한 결과, 기본적인 Happy Path는 커버되어 있으나 핵심 기능인 **채팅 플로우**와 **온보딩 플로우**가 누락되어 있습니다.

## 1. 화면/기능 분석 결과

### 1.1 식별된 화면

| 화면명 | 경로 | 주요 기능 | testID 현황 |
|--------|------|-----------|-------------|
| 로그인 화면 | `app/(auth)/login.tsx` | Google 로그인, Mock 로그인 | ✅ 완전 |
| 온보딩 화면 | `app/(auth)/onboarding.tsx` | 도마뱀 등록 폼 | ✅ 완전 |
| 홈 화면 | `app/(main)/index.tsx` | 채팅 목록, 프로필 카드, FAB | ✅ 완전 |
| 채팅방 화면 | `app/(main)/chat/[chatId].tsx` | 메시지 표시, 입력, SSE 스트리밍 | ❌ 누락 |
| 설정 메뉴 | `app/(main)/settings/index.tsx` | 도마뱀 정보, 계정, 로그아웃 | ⚠️ 부분 |
| 도마뱀 정보 설정 | `app/(main)/settings/lizard.tsx` | 도마뱀 정보 수정 | ⚠️ 부분 |
| 계정 설정 | `app/(main)/settings/account.tsx` | 계정 정보, 계정 삭제 | ❌ 누락 |

### 1.2 식별된 주요 기능

| 기능 | 위치 | testID 현황 |
|------|------|-------------|
| Google 로그인 | `features/auth/ui/GoogleLoginButton.tsx` | ✅ `login-google-button` |
| 도마뱀 등록 | `features/register-lizard/ui/LizardForm.tsx` | ✅ 완전 (폼 전체) |
| 채팅방 생성 | `features/create-chat/ui/NewChatButton.tsx` | ✅ `fab-new-chat` |
| 메시지 전송 | `features/send-message/ui/ChatInput.tsx` | ❌ testID 누락 |
| 채팅 목록 아이템 | `entities/chat/ui/ChatListItem.tsx` | ❌ testID 누락 |
| 채팅 버블 | `entities/message/ui/ChatBubble.tsx` | ❌ testID 누락 |
| 프로필 카드 | `widgets/lizard-profile-card/ui/LizardProfileCard.tsx` | ✅ `edit-lizard-button` |

### 1.3 testID 현황 요약

- **존재**: 21개 testID (로그인, 홈, 온보딩 폼)
- **누락 (Critical)**: 7개 (채팅 관련 UI)
- **누락 (Major)**: 4개 (설정 화면)

## 2. 기존 Maestro 플로우 분석

### 2.1 커버된 시나리오

| 파일명 | 시나리오 | 태그 | 상태 |
|--------|----------|------|------|
| `01-app-launch.yaml` | 앱 실행 및 로그인 화면 검증 | smoke, regression | ✅ |
| `02-login-flow.yaml` | Mock 로그인 플로우 | smoke, regression, auth | ✅ |
| `03-home-navigation.yaml` | 홈 화면 요소 확인 | smoke, regression, navigation | ✅ |
| `04-settings-flow.yaml` | 도마뱀 정보 편집 진입 | smoke, regression, settings | ⚠️ 불완전 |
| `05-edge-cases.yaml` | 빈 상태 확인 | regression, edge-cases | ✅ |

### 2.2 서브플로우

| 파일명 | 설명 | 상태 |
|--------|------|------|
| `login-subflow.yaml` | 로그인 헬퍼 (text 기반) | ⚠️ testID로 개선 필요 |
| `navigate-to-settings.yaml` | 설정 화면 이동 | ✅ |

## 3. 누락된 Critical 시나리오

### 3.1 온보딩 플로우 (Critical)

**누락 이유**: 신규 사용자 첫 실행 시 필수 플로우
**설명**: 로그인 후 도마뱀 미등록 상태 → 온보딩 화면 → 도마뱀 등록 → 홈 진입

### 3.2 채팅방 생성 플로우 (Critical)

**누락 이유**: 핵심 비즈니스 기능
**설명**: FAB 버튼 탭 → 채팅방 생성 → 채팅방 진입

### 3.3 메시지 전송 플로우 (Critical)

**누락 이유**: 앱의 핵심 가치 제공 기능
**설명**: 채팅방 진입 → 메시지 입력 → 전송 → AI 응답 확인

### 3.4 채팅방 제한 테스트 (Major)

**누락 이유**: 비즈니스 규칙 검증 (최대 5개)
**설명**: 5개 채팅방 생성 후 추가 생성 시도 → 경고 확인

### 3.5 설정 플로우 개선 (Major)

**누락 이유**: 현재 04번 플로우가 불완전
**설명**: 설정 → 도마뱀 정보 수정 → 저장 → 홈 복귀 → 변경 확인

### 3.6 로그아웃 플로우 (Major)

**누락 이유**: 인증 플로우 역방향 테스트
**설명**: 설정 → 로그아웃 → 확인 → 로그인 화면 복귀

## 4. testID 추가 권장 목록

### 4.1 Critical (반드시 추가)

| 컴포넌트 | 파일 | 권장 testID | 사유 |
|----------|------|-------------|------|
| ChatInput (전체) | `features/send-message/ui/ChatInput.tsx` | `chat-input` | 메시지 입력 플로우 필수 |
| ChatInput (TextInput) | 동일 | `chat-input-field` | 입력 필드 직접 접근 |
| ChatInput (Send Button) | 동일 | `chat-send-button` | 전송 버튼 클릭 |
| ChatBubble (user) | `entities/message/ui/ChatBubble.tsx` | `chat-bubble-user` | 사용자 메시지 확인 |
| ChatBubble (assistant) | 동일 | `chat-bubble-assistant` | AI 응답 확인 |
| ChatListItem | `entities/chat/ui/ChatListItem.tsx` | `chat-list-item-{id}` | 채팅방 선택 |
| ChatRoom | `widgets/chat-room/ui/ChatRoom.tsx` | `chat-room-screen` | 채팅방 화면 확인 |

### 4.2 Major (권장)

| 컴포넌트 | 파일 | 권장 testID | 사유 |
|----------|------|-------------|------|
| SettingsScreen | `app/(main)/settings/index.tsx` | `settings-screen` | 설정 화면 확인 |
| Settings 항목들 | 동일 | `settings-item-lizard`, `settings-item-account`, `settings-item-logout` | 개별 메뉴 접근 |
| AccountScreen | `app/(main)/settings/account.tsx` | `account-screen` | 계정 화면 확인 |
| Delete Account Button | 동일 | `button-delete-account` | 계정 삭제 버튼 |

### 4.3 Minor (선택)

| 컴포넌트 | 파일 | 권장 testID | 사유 |
|----------|------|-------------|------|
| LizardAvatar | `entities/lizard/ui/LizardAvatar.tsx` | `lizard-avatar` | 프로필 이미지 확인 |
| TypingIndicator | `entities/message/ui/TypingIndicator.tsx` | `typing-indicator` | 입력 중 상태 확인 |
| ImagePicker | `features/upload-image/ui/ImagePicker.tsx` | `image-picker` | 이미지 업로드 |

## 5. 생성된 신규 플로우 파일

| 파일명 | 시나리오 | 태그 | 우선순위 |
|--------|----------|------|----------|
| `06-onboarding-flow.yaml` | 신규 사용자 온보딩 (도마뱀 등록) | smoke, regression, onboarding | Critical |
| `07-create-chat-flow.yaml` | 채팅방 생성 및 진입 | smoke, regression, chat | Critical |
| `08-send-message-flow.yaml` | 메시지 전송 및 AI 응답 | smoke, regression, chat | Critical |
| `09-chat-limit-flow.yaml` | 채팅방 5개 제한 테스트 | regression, edge-cases, chat | Major |
| `10-logout-flow.yaml` | 로그아웃 플로우 | regression, auth | Major |

## 6. 테스트 우선순위 및 권장 실행 순서

### 6.1 Smoke Test (빌드 검증용)

```bash
maestro test .maestro/flows/ --include-tags smoke
```

- 01-app-launch
- 02-login-flow
- 03-home-navigation
- 06-onboarding-flow
- 07-create-chat-flow
- 08-send-message-flow

### 6.2 Regression Test (전체)

```bash
maestro test .maestro/flows/ --include-tags regression
```

### 6.3 Feature Test (기능별)

```bash
# 인증 플로우
maestro test .maestro/flows/ --include-tags auth

# 채팅 플로우
maestro test .maestro/flows/ --include-tags chat

# Edge Cases
maestro test .maestro/flows/ --include-tags edge-cases
```

## 7. testID 추가 작업 계획

### Phase 1: Critical testID 추가 (필수)

**목표**: 채팅 관련 핵심 플로우 테스트 가능하도록

1. ChatInput 컴포넌트에 testID 3개 추가
2. ChatBubble에 role 기반 testID 추가
3. ChatListItem에 동적 testID 추가
4. ChatRoom에 screen testID 추가

**예상 작업 시간**: 30분

### Phase 2: Major testID 추가 (권장)

**목표**: 설정 화면 플로우 테스트 가능하도록

1. SettingsScreen 및 메뉴 항목에 testID 추가
2. AccountScreen에 testID 추가

**예상 작업 시간**: 20분

### Phase 3: 플로우 검증 및 안정화

**목표**: 모든 플로우 실제 디바이스/시뮬레이터에서 검증

1. iOS Simulator에서 전체 플로우 실행
2. Android Emulator에서 전체 플로우 실행
3. 실패하는 플로우 디버깅 및 수정

**예상 작업 시간**: 1시간

## 8. 알려진 제약사항

### 8.1 SSE Streaming 테스트

- **문제**: AI 응답이 SSE로 스트리밍되므로 응답 완료 시점 감지 어려움
- **해결 방안**: `waitForAnimationToEnd` + 충분한 timeout 사용

### 8.2 Google OAuth 테스트

- **문제**: 실제 Google 로그인은 Maestro로 자동화 불가 (WebView, 외부 브라우저)
- **해결 방안**: `__DEV__` 환경에서 Mock 로그인 사용

### 8.3 이미지 업로드 테스트

- **문제**: 시스템 이미지 피커는 Maestro로 제어 불가
- **해결 방안**: 현재는 플로우에서 제외, 향후 Mock 이미지 선택 구현 고려

### 8.4 동적 콘텐츠

- **문제**: 채팅 목록, 메시지 등 데이터 의존적
- **해결 방안**: `clearState: true`로 깨끗한 상태에서 시작, 또는 Mock 데이터 주입

## 9. 다음 단계

1. **testID 추가 작업** (Phase 1: Critical)
   - ChatInput, ChatBubble, ChatListItem, ChatRoom에 testID 추가
   - 예상 시간: 30분

2. **신규 플로우 검증**
   - 06-10번 플로우 파일을 iOS/Android에서 실행
   - 실패 시 디버깅 및 수정

3. **CI/CD 통합** (선택)
   - GitHub Actions 또는 EAS Build에 Maestro 테스트 추가
   - PR 생성 시 자동 테스트 실행

4. **Phase 2 확장** (선택)
   - 설정 화면 testID 추가
   - 계정 관련 플로우 추가

## 10. 참고 자료

- Maestro 공식 문서: https://maestro.mobile.dev/
- Expo Router 테스트 가이드: https://docs.expo.dev/router/reference/testing/
- 프로젝트 Tech Spec: `/Users/ddingg/dev/lizzie-app/spec/lizzie-frontend-tech-spec.md`

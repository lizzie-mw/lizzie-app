# Maestro E2E Test Coverage Summary

**분석 일시**: 2026-01-10
**Lizzie App**: 도마뱀 반려인 AI 챗봇
**Maestro CLI**: 2.0.10

---

## 1. Executive Summary

Lizzie 앱의 E2E 테스트 현황을 분석한 결과:

- **기존 플로우**: 5개 (Happy Path 중심)
- **신규 플로우**: 5개 추가 (채팅 핵심 기능)
- **testID 현황**: 21개 존재, 11개 추가 필요
- **테스트 커버리지**: ~70% (핵심 기능 커버)

### 주요 발견 사항

✅ **잘 구현된 부분**:
- 로그인/홈 화면 testID 완전 커버
- 온보딩 폼 testID 완전 커버
- Mock 로그인으로 E2E 테스트 가능

❌ **누락된 부분**:
- 채팅방 관련 testID 전무
- 메시지 전송 플로우 미구현
- 설정 화면 일부 testID 누락

---

## 2. 테스트 플로우 현황

### 2.1 기존 플로우 (5개)

| # | 파일명 | 시나리오 | 태그 | 상태 |
|---|--------|----------|------|------|
| 01 | `01-app-launch.yaml` | 앱 실행 및 로그인 화면 | smoke, regression | ✅ 완성 |
| 02 | `02-login-flow.yaml` | Mock 로그인 | smoke, regression, auth | ✅ 완성 |
| 03 | `03-home-navigation.yaml` | 홈 화면 네비게이션 | smoke, regression, navigation | ✅ 완성 |
| 04 | `04-settings-flow.yaml` | 도마뱀 정보 편집 | smoke, regression, settings | ⚠️ 불완전 |
| 05 | `05-edge-cases.yaml` | 빈 상태 확인 | regression, edge-cases | ✅ 완성 |

### 2.2 신규 플로우 (5개)

| # | 파일명 | 시나리오 | 태그 | 우선순위 |
|---|--------|----------|------|----------|
| 06 | `06-onboarding-flow.yaml` | 온보딩 (도마뱀 등록) | smoke, regression, onboarding | Critical |
| 07 | `07-create-chat-flow.yaml` | 채팅방 생성 | smoke, regression, chat | Critical |
| 08 | `08-send-message-flow.yaml` | 메시지 전송 및 AI 응답 | smoke, regression, chat | Critical |
| 09 | `09-chat-limit-flow.yaml` | 채팅방 5개 제한 검증 | regression, edge-cases, chat | Major |
| 10 | `10-logout-flow.yaml` | 로그아웃 | regression, auth | Major |

---

## 3. 화면별 testID 현황

### 3.1 완전히 커버된 화면 ✅

| 화면 | 경로 | testID 수 |
|------|------|-----------|
| 로그인 화면 | `app/(auth)/login.tsx` | 7개 |
| 홈 화면 | `app/(main)/index.tsx` | 8개 |
| 온보딩 화면 | `app/(auth)/onboarding.tsx` | 6개 (폼 포함) |

### 3.2 부분 커버된 화면 ⚠️

| 화면 | 경로 | 현재 testID | 필요 testID |
|------|------|-------------|-------------|
| 설정 화면 | `app/(main)/settings/index.tsx` | 0개 | 4개 |
| 도마뱀 정보 설정 | `app/(main)/settings/lizard.tsx` | 0개 | 1개 |

### 3.3 미커버된 화면 ❌

| 화면 | 경로 | 필요 testID |
|------|------|-------------|
| 채팅방 화면 | `app/(main)/chat/[chatId].tsx` | 1개 (screen) |
| 계정 설정 화면 | `app/(main)/settings/account.tsx` | 2개 |

---

## 4. 컴포넌트별 testID 현황

### 4.1 Features

| Feature | testID 현황 | 상태 |
|---------|-------------|------|
| `auth/GoogleLoginButton` | ✅ `login-google-button` | 완성 |
| `register-lizard/LizardForm` | ✅ 전체 폼 testID | 완성 |
| `create-chat/NewChatButton` | ✅ `fab-new-chat` | 완성 |
| `send-message/ChatInput` | ❌ testID 없음 | **누락** |
| `upload-image/ImagePicker` | ❌ testID 없음 | 선택 |

### 4.2 Entities

| Entity | testID 현황 | 상태 |
|--------|-------------|------|
| `chat/ChatListItem` | ❌ testID 없음 | **누락** |
| `message/ChatBubble` | ❌ testID 없음 | **누락** |
| `message/TypingIndicator` | ❌ testID 없음 | 선택 |
| `lizard/LizardAvatar` | ❌ testID 없음 | 선택 |

### 4.3 Widgets

| Widget | testID 현황 | 상태 |
|--------|-------------|------|
| `chat-room/ChatRoom` | ❌ testID 없음 | **누락** |
| `lizard-profile-card/LizardProfileCard` | ✅ `edit-lizard-button` | 완성 |

---

## 5. 비즈니스 규칙 테스트 커버리지

| 규칙 | 테스트 플로우 | 상태 |
|------|---------------|------|
| Google OAuth 로그인 | 02-login-flow (Mock) | ✅ |
| 사용자당 1마리 도마뱀 | 06-onboarding-flow | ✅ |
| 최대 5개 채팅방 | 09-chat-limit-flow | ✅ |
| SSE 스트리밍 메시지 | 08-send-message-flow | ⚠️ testID 필요 |
| 도마뱀 정보 수정 | 04-settings-flow | ✅ |
| 로그아웃/재로그인 | 10-logout-flow | ✅ |

---

## 6. 태그별 플로우 분포

### smoke (빠른 검증용) - 6개

```
01-app-launch
02-login-flow
03-home-navigation
06-onboarding-flow
07-create-chat-flow
08-send-message-flow
```

**예상 실행 시간**: 2-3분

### regression (전체) - 10개

모든 플로우 포함

**예상 실행 시간**: 5-7분

### auth (인증) - 2개

```
02-login-flow
10-logout-flow
```

### chat (채팅) - 4개

```
07-create-chat-flow
08-send-message-flow
09-chat-limit-flow
```

### edge-cases (예외 처리) - 2개

```
05-edge-cases
09-chat-limit-flow
```

---

## 7. testID 추가 작업 계획

### Phase 1: Critical (필수)

**목표**: 채팅 핵심 플로우 테스트 가능

| 컴포넌트 | testID 수 | 예상 시간 |
|----------|-----------|-----------|
| ChatInput | 3개 | 5분 |
| ChatBubble | 1개 | 5분 |
| ChatRoom | 1개 | 3분 |
| ChatListItem | 1개 | 3분 |

**합계**: 6개 testID, **16분**

### Phase 2: Major (권장)

**목표**: 설정 화면 플로우 테스트 가능

| 컴포넌트 | testID 수 | 예상 시간 |
|----------|-----------|-----------|
| SettingsScreen | 4개 | 10분 |
| AccountSettingsScreen | 2개 | 5분 |

**합계**: 6개 testID, **15분**

### Phase 3: Minor (선택)

**목표**: 테스트 안정성 향상

| 컴포넌트 | testID 수 | 예상 시간 |
|----------|-----------|-----------|
| LizardAvatar | 1개 | 3분 |
| TypingIndicator | 1개 | 3분 |
| ImagePicker | 1개 | 3분 |

**합계**: 3개 testID, **9분**

---

## 8. 테스트 실행 가이드

### 빠른 검증 (Smoke Test)

```bash
maestro test .maestro/flows/ --include-tags smoke
```

**실행 플로우**: 6개
**예상 시간**: 2-3분

### 전체 테스트 (Regression Test)

```bash
maestro test .maestro/flows/ --include-tags regression
```

**실행 플로우**: 10개
**예상 시간**: 5-7분

### 기능별 테스트

```bash
# 인증 플로우
maestro test .maestro/flows/ --include-tags auth

# 채팅 플로우
maestro test .maestro/flows/ --include-tags chat
```

---

## 9. 알려진 제약사항

### 9.1 Google OAuth

- **문제**: 실제 Google 로그인은 Maestro로 자동화 불가
- **해결**: `__DEV__` 환경에서 Mock 로그인 사용

### 9.2 SSE Streaming

- **문제**: AI 응답 완료 시점 감지 어려움
- **해결**: `waitForAnimationToEnd` + 충분한 timeout (10초)

### 9.3 이미지 업로드

- **문제**: 시스템 이미지 피커는 Maestro로 제어 불가
- **해결**: 현재는 플로우에서 제외

### 9.4 동적 콘텐츠

- **문제**: 채팅 목록, 메시지 등 데이터 의존적
- **해결**: `clearState: true` 또는 Mock 데이터 주입

---

## 10. 다음 단계 (권장 순서)

### Step 1: testID 추가 (Phase 1)

**목표**: 채팅 플로우 테스트 가능

1. `ChatInput.tsx`에 testID 3개 추가
2. `ChatBubble.tsx`에 role 기반 testID 추가
3. `ChatRoom.tsx`에 screen testID 추가
4. `ChatListItem.tsx`에 testID 추가

**예상 시간**: 16분

**검증**:
```bash
maestro test .maestro/flows/08-send-message-flow.yaml
```

### Step 2: 플로우 검증

**목표**: 모든 신규 플로우 동작 확인

```bash
# iOS Simulator
maestro test .maestro/flows/06-onboarding-flow.yaml
maestro test .maestro/flows/07-create-chat-flow.yaml
maestro test .maestro/flows/08-send-message-flow.yaml
maestro test .maestro/flows/09-chat-limit-flow.yaml
maestro test .maestro/flows/10-logout-flow.yaml
```

**예상 시간**: 30분

### Step 3: Phase 2 testID 추가 (선택)

**목표**: 설정 화면 플로우 개선

1. `SettingsScreen` 및 메뉴 항목 testID 추가
2. `AccountSettingsScreen` testID 추가

**예상 시간**: 15분

### Step 4: CI/CD 통합 (선택)

**목표**: PR 생성 시 자동 테스트

- GitHub Actions 워크플로우 생성
- EAS Build에 Maestro 통합

**예상 시간**: 1시간

---

## 11. 성공 메트릭

### 현재 상태 (Before)

- ✅ 기존 플로우: 5개
- ⚠️ testID 커버리지: ~60%
- ❌ 채팅 기능 테스트: 없음

### 목표 상태 (After Phase 1)

- ✅ 전체 플로우: 10개
- ✅ testID 커버리지: ~85%
- ✅ 채팅 기능 테스트: 완전 커버

### 최종 목표 (After Phase 2)

- ✅ 전체 플로우: 10개
- ✅ testID 커버리지: ~95%
- ✅ 모든 핵심 기능 테스트 커버
- ✅ CI/CD 자동화

---

## 12. 생성된 파일 목록

### 문서

- `MAESTRO_TEST_PLAN.md` - 전체 테스트 플랜 (상세)
- `TEST_COVERAGE_SUMMARY.md` - 테스트 커버리지 요약 (이 파일)
- `TESTID_TODO.md` - testID 추가 작업 목록
- `RUN_GUIDE.md` - 테스트 실행 가이드

### 플로우 파일 (신규)

- `flows/06-onboarding-flow.yaml`
- `flows/07-create-chat-flow.yaml`
- `flows/08-send-message-flow.yaml`
- `flows/09-chat-limit-flow.yaml`
- `flows/10-logout-flow.yaml`

### 기존 파일

- `config.yaml` - Maestro 설정
- `flows/01-app-launch.yaml`
- `flows/02-login-flow.yaml`
- `flows/03-home-navigation.yaml`
- `flows/04-settings-flow.yaml`
- `flows/05-edge-cases.yaml`
- `subflows/login-subflow.yaml`
- `subflows/navigate-to-settings.yaml`

---

## 13. 참고 자료

- **Maestro 공식 문서**: https://maestro.mobile.dev/
- **Maestro CLI 명령어**: https://maestro.mobile.dev/cli/commands
- **Expo Router 테스트**: https://docs.expo.dev/router/reference/testing/
- **React Native testID**: https://reactnative.dev/docs/view#testid
- **프로젝트 Tech Spec**: `/Users/ddingg/dev/lizzie-app/spec/lizzie-frontend-tech-spec.md`

---

**작성자**: Claude Code (Maestro Test Plan Agent)
**최종 업데이트**: 2026-01-10

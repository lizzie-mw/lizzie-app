# Maestro 테스트 실행 가이드

## 사전 준비

### 1. Maestro CLI 설치 확인

```bash
maestro --version
# Expected: 2.0.10 or higher
```

### 2. 앱 빌드 및 실행

#### iOS (권장)

```bash
# 개발 빌드 실행
bunx expo start --ios

# 또는 Simulator에서 직접 실행
open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app
```

#### Android

```bash
# 개발 빌드 실행
bunx expo start --android

# 또는 Emulator 직접 실행
emulator -avd Pixel_5_API_33
```

### 3. 앱 실행 확인

- iOS: Simulator에서 Lizzie 앱이 실행 중이어야 함
- Android: Emulator에서 Lizzie 앱이 실행 중이어야 함
- App ID: `app.lizzie` (config.yaml에 정의)

---

## 테스트 실행 방법

### 1. 단일 플로우 실행

```bash
# 특정 플로우 파일 실행
maestro test .maestro/flows/01-app-launch.yaml
```

**출력 예시**:
```
Running on iOS Simulator (iPhone 15 Pro)
✓ Flow completed successfully
  Duration: 8.2s
  Screenshots: 1
```

---

### 2. 태그별 실행

#### Smoke Test (빠른 빌드 검증)

```bash
maestro test .maestro/flows/ --include-tags smoke
```

**실행되는 플로우**:
- 01-app-launch
- 02-login-flow
- 03-home-navigation
- 06-onboarding-flow
- 07-create-chat-flow
- 08-send-message-flow

**예상 시간**: 2-3분

---

#### Regression Test (전체 테스트)

```bash
maestro test .maestro/flows/ --include-tags regression
```

**실행되는 플로우**: 모든 플로우 (10개)

**예상 시간**: 5-7분

---

#### 기능별 테스트

```bash
# 인증 관련 테스트
maestro test .maestro/flows/ --include-tags auth

# 채팅 관련 테스트
maestro test .maestro/flows/ --include-tags chat

# Edge Case 테스트
maestro test .maestro/flows/ --include-tags edge-cases
```

---

### 3. 전체 플로우 실행

```bash
# 모든 플로우 실행 (태그 무관)
maestro test .maestro/flows/
```

---

### 4. 연속 실행 모드

```bash
# 파일 변경 시 자동 재실행
maestro test .maestro/flows/ --continuous
```

**사용 시나리오**: 플로우 작성 중 실시간 검증

---

## 테스트 결과 확인

### 1. 콘솔 출력

```
Running flows in .maestro/flows/
✓ 01-app-launch.yaml (8.2s)
✓ 02-login-flow.yaml (12.5s)
✗ 08-send-message-flow.yaml (FAILED after 5.3s)
  Error: Element not found: chat-input-field

Summary:
  2 passed, 1 failed
  Total time: 26.0s
```

### 2. 스크린샷

스크린샷은 `.maestro/screenshots/` 폴더에 저장됩니다.

```bash
ls .maestro/screenshots/
# 01-login-screen.png
# 02-before-login.png
# 02-after-mock-login.png
# ...
```

### 3. 리포트 생성 (선택)

```bash
# HTML 리포트 생성
maestro test .maestro/flows/ --format html --output test-report.html
```

---

## 플로우별 상세 가이드

### 01-app-launch.yaml

**목적**: 앱 실행 및 로그인 화면 검증
**전제 조건**: 없음
**예상 시간**: 5초
**스크린샷**: 1개

```bash
maestro test .maestro/flows/01-app-launch.yaml
```

---

### 02-login-flow.yaml

**목적**: Mock 로그인 플로우
**전제 조건**: 개발 환경 (`__DEV__ = true`)
**예상 시간**: 10초
**스크린샷**: 3개

```bash
maestro test .maestro/flows/02-login-flow.yaml
```

---

### 03-home-navigation.yaml

**목적**: 홈 화면 요소 확인
**전제 조건**: 로그인 상태
**예상 시간**: 10초
**스크린샷**: 1개

```bash
maestro test .maestro/flows/03-home-navigation.yaml
```

---

### 04-settings-flow.yaml

**목적**: 도마뱀 정보 편집 화면 진입
**전제 조건**: 로그인 상태
**예상 시간**: 15초
**스크린샷**: 3개

```bash
maestro test .maestro/flows/04-settings-flow.yaml
```

---

### 05-edge-cases.yaml

**목적**: 빈 상태 확인
**전제 조건**: 깨끗한 앱 상태 (`clearState: true`)
**예상 시간**: 12초
**스크린샷**: 3개

```bash
maestro test .maestro/flows/05-edge-cases.yaml
```

---

### 06-onboarding-flow.yaml (신규)

**목적**: 온보딩 플로우 (도마뱀 등록 폼)
**전제 조건**: 없음
**예상 시간**: 20초
**스크린샷**: 3개

**참고**: Mock 로그인은 도마뱀 데이터를 자동 주입하므로, 실제 온보딩 진입은 편집 화면으로 검증

```bash
maestro test .maestro/flows/06-onboarding-flow.yaml
```

---

### 07-create-chat-flow.yaml (신규)

**목적**: 채팅방 생성 및 진입
**전제 조건**: 로그인 상태
**예상 시간**: 15초
**스크린샷**: 3개

**중요**: 첫 실행 시 성공, 이후 실행 시 기존 채팅방 존재

```bash
maestro test .maestro/flows/07-create-chat-flow.yaml
```

---

### 08-send-message-flow.yaml (신규)

**목적**: 메시지 전송 및 AI 응답 확인
**전제 조건**: 로그인 상태, testID 추가 완료 (Phase 1)
**예상 시간**: 30초 (SSE 응답 대기 포함)
**스크린샷**: 4개

**현재 상태**: testID 미추가로 일부 실패 가능

```bash
maestro test .maestro/flows/08-send-message-flow.yaml
```

---

### 09-chat-limit-flow.yaml (신규)

**목적**: 채팅방 5개 제한 검증
**전제 조건**: 깨끗한 앱 상태
**예상 시간**: 60초 (5개 생성 시간 포함)
**스크린샷**: 3개

**참고**: 시간이 오래 걸리므로 일반적으로는 건너뜀

```bash
maestro test .maestro/flows/09-chat-limit-flow.yaml
```

---

### 10-logout-flow.yaml (신규)

**목적**: 로그아웃 플로우
**전제 조건**: 로그인 상태
**예상 시간**: 25초
**스크린샷**: 5개

```bash
maestro test .maestro/flows/10-logout-flow.yaml
```

---

## 문제 해결 (Troubleshooting)

### 1. "App not found" 에러

**원인**: 앱이 실행되지 않았거나 App ID가 다름

**해결 방법**:
```bash
# App ID 확인
maestro test --app-id app.lizzie

# 앱 재실행
bunx expo start --ios
```

---

### 2. "Element not found: {testID}" 에러

**원인**: testID가 코드에 추가되지 않았거나 화면에 표시되지 않음

**해결 방법**:
1. `TESTID_TODO.md` 참고하여 testID 추가
2. 화면 로딩 시간 증가: `timeout` 값 조정

```yaml
- assertVisible:
    id: "chat-input-field"
    timeout: 10000  # 10초로 증가
```

---

### 3. SSE 응답 타임아웃

**원인**: AI 응답 시간이 길어짐

**해결 방법**:
```yaml
# 대기 시간 증가
- waitForAnimationToEnd:
    timeout: 15000  # 10초 → 15초
```

---

### 4. Simulator/Emulator 느림

**원인**: 리소스 부족

**해결 방법**:
- Xcode Simulator: Settings → Graphics Quality → Low
- Android Emulator: AVD Manager → 더 낮은 해상도 선택
- 백그라운드 앱 종료

---

### 5. clearState 동작 안 함

**원인**: Expo 개발 모드에서는 AsyncStorage가 유지될 수 있음

**해결 방법**:
```bash
# iOS
xcrun simctl erase all

# Android
adb shell pm clear app.lizzie
```

---

## 권장 워크플로우

### 개발 중 (빠른 검증)

```bash
# Smoke Test만 실행
maestro test .maestro/flows/ --include-tags smoke
```

### PR 생성 전 (전체 검증)

```bash
# Regression Test 실행
maestro test .maestro/flows/ --include-tags regression
```

### 릴리스 전 (완전한 검증)

```bash
# 모든 플로우 실행 (iOS + Android)
maestro test .maestro/flows/

# iOS Simulator
maestro test .maestro/flows/ --device "iPhone 15 Pro"

# Android Emulator
maestro test .maestro/flows/ --device "emulator-5554"
```

---

## 다음 단계

1. **testID 추가** (Phase 1: Critical)
   - `TESTID_TODO.md` 참고
   - ChatInput, ChatBubble, ChatRoom, ChatListItem

2. **플로우 검증**
   - 08-send-message-flow.yaml 실행
   - 실패 시 디버깅

3. **CI/CD 통합** (선택)
   - GitHub Actions 또는 EAS Build
   - PR 생성 시 자동 테스트

---

## 참고 자료

- Maestro 공식 문서: https://maestro.mobile.dev/
- Maestro CLI 명령어: https://maestro.mobile.dev/cli/commands
- Expo Router 테스트: https://docs.expo.dev/router/reference/testing/

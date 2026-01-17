# Maestro E2E Tests for 꼬물톡 (Ggomul-Talk)

꼬물톡 앱의 E2E 테스트 자동화를 위한 Maestro 플로우 모음입니다.

## 빠른 시작

### 1. 앱 실행

```bash
# iOS Simulator
bunx expo start --ios

# Android Emulator
bunx expo start --android
```

### 2. Smoke Test 실행

```bash
maestro test .maestro/flows/ --include-tags smoke
```

**예상 시간**: 2-3분

---

## 디렉토리 구조

```
.maestro/
├── README.md                        # 이 파일
├── config.yaml                      # Maestro 설정
│
├── flows/                           # 테스트 플로우 (10개)
│   ├── 01-app-launch.yaml          # 앱 실행
│   ├── 02-login-flow.yaml          # Mock 로그인
│   ├── 03-home-navigation.yaml     # 홈 화면
│   ├── 04-settings-flow.yaml       # 도마뱀 정보 편집
│   ├── 05-edge-cases.yaml          # 빈 상태 확인
│   ├── 06-onboarding-flow.yaml     # 온보딩 (신규)
│   ├── 07-create-chat-flow.yaml    # 채팅방 생성 (신규)
│   ├── 08-send-message-flow.yaml   # 메시지 전송 (신규)
│   ├── 09-chat-limit-flow.yaml     # 채팅방 제한 (신규)
│   └── 10-logout-flow.yaml         # 로그아웃 (신규)
│
├── subflows/                        # 재사용 가능한 서브플로우
│   ├── login-subflow.yaml
│   └── navigate-to-settings.yaml
│
├── screenshots/                     # 스크린샷 저장 (gitignore)
│
└── docs/                            # 문서 (아래 파일들)
    ├── MAESTRO_TEST_PLAN.md         # 전체 테스트 플랜 (상세)
    ├── TEST_COVERAGE_SUMMARY.md     # 테스트 커버리지 요약
    ├── TESTID_TODO.md               # testID 추가 작업 목록
    └── RUN_GUIDE.md                 # 테스트 실행 가이드
```

---

## 문서 가이드

### 어떤 문서를 읽어야 할까요?

| 상황 | 읽을 문서 |
|------|-----------|
| 빠르게 테스트 실행하고 싶어요 | `RUN_GUIDE.md` |
| 테스트 커버리지 현황을 알고 싶어요 | `TEST_COVERAGE_SUMMARY.md` |
| testID를 추가해야 해요 | `TESTID_TODO.md` |
| 전체 테스트 전략을 알고 싶어요 | `MAESTRO_TEST_PLAN.md` |

---

## 플로우 개요

### Smoke Test (빠른 검증) - 6개

앱 빌드 후 빠른 검증용. PR 생성 시 자동 실행 권장.

```bash
maestro test .maestro/flows/ --include-tags smoke
```

- ✅ 01-app-launch: 앱 실행 및 로그인 화면
- ✅ 02-login-flow: Mock 로그인
- ✅ 03-home-navigation: 홈 화면 네비게이션
- ✅ 06-onboarding-flow: 온보딩 (도마뱀 등록)
- ✅ 07-create-chat-flow: 채팅방 생성
- ✅ 08-send-message-flow: 메시지 전송 및 AI 응답

### Regression Test (전체) - 10개

릴리스 전 전체 검증용.

```bash
maestro test .maestro/flows/ --include-tags regression
```

모든 플로우 실행 (Smoke Test 포함 + Edge Cases)

---

## testID 작업 현황

### Phase 1: Critical (필수) ⚠️

**목표**: 채팅 핵심 플로우 테스트 가능

- [ ] ChatInput에 testID 3개 추가 (5분)
- [ ] ChatBubble에 role 기반 testID 추가 (5분)
- [ ] ChatRoom에 screen testID 추가 (3분)
- [ ] ChatListItem에 testID 추가 (3분)

**총 예상 시간**: 16분

**상세 내용**: `TESTID_TODO.md` 참고

---

## 주요 명령어

### 단일 플로우 실행

```bash
maestro test .maestro/flows/01-app-launch.yaml
```

### 태그별 실행

```bash
# Smoke Test
maestro test .maestro/flows/ --include-tags smoke

# Regression Test
maestro test .maestro/flows/ --include-tags regression

# 인증 플로우만
maestro test .maestro/flows/ --include-tags auth

# 채팅 플로우만
maestro test .maestro/flows/ --include-tags chat
```

### 전체 실행

```bash
maestro test .maestro/flows/
```

### 연속 실행 모드 (플로우 작성 중)

```bash
maestro test .maestro/flows/ --continuous
```

---

## 현재 상태

### ✅ 완료

- 기존 플로우 5개 (로그인, 홈, 설정)
- 신규 플로우 5개 (온보딩, 채팅, 로그아웃)
- 로그인/홈 화면 testID 완전 커버
- Mock 로그인 구현

### ⚠️ 진행 필요

- Phase 1 testID 추가 (16분)
- 08-send-message-flow.yaml 검증

### 🎯 향후 계획

- Phase 2 testID 추가 (설정 화면)
- CI/CD 통합 (GitHub Actions)
- 추가 Edge Case 플로우

---

## 문제 해결

### "Element not found: chat-input-field"

**원인**: testID가 코드에 추가되지 않음

**해결**: `TESTID_TODO.md` 참고하여 testID 추가

### SSE 응답 타임아웃

**원인**: AI 응답 시간이 길어짐

**해결**: 플로우 파일에서 `timeout` 값 증가

```yaml
- waitForAnimationToEnd:
    timeout: 15000  # 10초 → 15초로 증가
```

더 많은 문제 해결: `RUN_GUIDE.md` 참고

---

## 참고 자료

- **Maestro 공식 문서**: https://maestro.mobile.dev/
- **Maestro CLI**: https://maestro.mobile.dev/cli/commands
- **프로젝트 Tech Spec**: `/spec/ggomul-talk-frontend-tech-spec.md`
- **CLAUDE.md**: 프로젝트 전체 가이드

---

## 기여 가이드

### 새 플로우 추가 시

1. `flows/` 폴더에 `{번호}-{기능}-flow.yaml` 파일 생성
2. 적절한 태그 추가 (smoke, regression, auth, chat 등)
3. 상세한 주석 작성 (각 단계 설명)
4. `TEST_COVERAGE_SUMMARY.md` 업데이트

### testID 추가 시

1. `TESTID_TODO.md`에서 작업 항목 확인
2. 코드에 testID 추가
3. 해당 플로우 실행하여 검증
4. `TESTID_TODO.md`에서 체크박스 완료 표시

---

**작성자**: Claude Code (Maestro Test Plan Agent)
**최종 업데이트**: 2026-01-10

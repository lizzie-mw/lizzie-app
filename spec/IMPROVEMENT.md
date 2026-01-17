# 꼬물톡 (Ggomul-Talk) - UI/UX 개선사항 문서

## 개요

꼬물톡 앱의 전체 플로우 검토 결과 발견된 UI/UX 문제점과 개선 방안을 정리합니다.

---

## 1. 레이아웃 및 헤더 관련 이슈

### 1.1 홈 화면 더블 헤더 문제 (높음)

**현상**: 홈 화면에서 네이티브 헤더(headerLargeTitle)와 커스텀 헤더가 동시에 표시됨

**위치**:
- `app/(main)/_layout.tsx:8-11` - `headerLargeTitle: true` 설정
- `app/(main)/index.tsx:42-54` - 커스텀 헤더 직접 구현

**해결방안**:
- (main) 레이아웃에서 홈 화면의 네이티브 헤더를 숨기고 커스텀 헤더만 사용
- 또는 커스텀 헤더를 제거하고 네이티브 헤더만 사용

---

### 1.2 설정 화면 헤더 + SafeAreaView 중복 패딩 (높음)

**현상**: 설정 관련 화면들에서 네이티브 Stack 헤더와 SafeAreaView의 top edge가 중복되어 상단 여백이 과도함

**위치**:
- `app/(main)/settings/index.tsx:85` - `edges={['bottom']}`으로 이미 처리됨 (정상)
- `app/(main)/settings/lizard.tsx:57` - `edges={['bottom']}`으로 처리됨 (정상)
- `app/(main)/settings/account.tsx:50` - `edges={['bottom']}`으로 처리됨 (정상)

**상태**: 이미 올바르게 처리됨

---

### 1.3 채팅 화면 SafeAreaView 미적용 (높음)

**현상**: ChatRoom 컴포넌트에서 SafeAreaView를 사용하지 않아 노치/홈 인디케이터 영역과 콘텐츠가 겹칠 수 있음

**위치**: `src/widgets/chat-room/ui/ChatRoom.tsx`

**해결방안**: KeyboardAvoidingView를 SafeAreaView로 감싸거나, edges 설정 추가

---

## 2. 폼 및 입력 관련 이슈

### 2.1 온보딩 LizardForm 뒤로가기 불가 (중간)

**현상**: 온보딩 화면에서 이전 화면(로그인)으로 돌아갈 수 없음

**위치**:
- `app/(auth)/_layout.tsx` - headerShown: false
- `app/(auth)/onboarding.tsx` - 뒤로가기 버튼 없음

**해결방안**:
- 온보딩 화면에 커스텀 뒤로가기 버튼 추가
- 또는 auth 레이아웃에서 온보딩에만 헤더 표시

---

### 2.2 생년월 입력 UX 개선 필요 (중간)

**현상**: 생년월을 텍스트로 직접 입력해야 하며 포맷 검증만 수행

**위치**:
- `src/features/register-lizard/ui/LizardForm.tsx:84-97`
- `app/(main)/settings/lizard.tsx:113-126`

**해결방안**:
- DatePicker 모달 사용
- 또는 년/월 분리 Select 사용

---

### 2.3 Select 컴포넌트 취소 버튼 없음 (낮음)

**현상**: Select 모달에서 명시적인 취소 버튼이 없음 (배경 탭으로만 닫기 가능)

**위치**: `src/shared/ui/Select.tsx:76-111`

**해결방안**: 모달 헤더에 "취소" 버튼 추가

---

## 3. 채팅 관련 이슈

### 3.1 채팅 삭제 기능 미구현 (중간)

**현상**: 채팅방 삭제 기능이 UI에 노출되지 않음 (API는 존재)

**위치**:
- `src/entities/chat/api/chatApi.ts` - deleteChat 존재
- `src/entities/chat/ui/ChatListItem.tsx` - 삭제 UI 없음

**해결방안**:
- 채팅 아이템 스와이프 삭제 구현
- 또는 길게 누르기 메뉴 구현

---

### 3.2 채팅 화면 첫 진입 시 빈 상태 (낮음)

**현상**: 새 채팅방 진입 시 빈 화면만 표시됨 (안내 메시지 없음)

**위치**: `src/widgets/chat-room/ui/ChatRoom.tsx`

**해결방안**: EmptyState 컴포넌트 활용하여 첫 메시지 입력 안내

---

### 3.3 메시지 전송 실패 시 재시도 UX (중간)

**현상**: SSE 스트리밍 실패 시 에러 표시만 하고 재시도 버튼 없음

**위치**: `src/features/send-message/api/useSSE.ts`

**해결방안**: 에러 발생 시 재시도 버튼 표시

---

## 4. 네비게이션 플로우 이슈

### 4.1 채팅 화면 헤더 타이틀 고정 (낮음)

**현상**: 모든 채팅 화면에서 헤더가 "채팅"으로 고정됨

**위치**: `app/(main)/_layout.tsx:15`

**해결방안**: 동적으로 채팅방 제목 표시

---

### 4.2 로그아웃 후 화면 전환 (낮음)

**현상**: 로그아웃 후 /login으로 replace하지만 깜빡임 발생 가능

**위치**: `app/(main)/settings/index.tsx:76-78`

**해결방안**: 로딩 상태 표시 후 부드러운 전환

---

## 5. UI 디자인 개선점

### 5.1 Loading 컴포넌트 색상 불일치 (낮음)

**현상**: ActivityIndicator 색상이 primary 팔레트와 다름 (#22c55e vs #5cb82f)

**위치**: `src/shared/ui/Loading.tsx:12`

**해결방안**: `#5cb82f` (primary-500)으로 통일

---

### 5.2 ImagePicker 카메라 아이콘 이모지 사용 (낮음)

**현상**: 카메라 아이콘으로 이모지(📷) 사용 중

**위치**: `src/features/upload-image/ui/ImagePicker.tsx:52`

**해결방안**: Icon 컴포넌트로 교체

---

### 5.3 계정 삭제 버튼 스타일 불일치 (낮음)

**현상**: 계정 삭제 버튼이 Button 컴포넌트지만 내부 Text로 스타일 오버라이드

**위치**: `app/(main)/settings/account.tsx:95-103`

**해결방안**: Button 컴포넌트에 danger variant 추가

---

## 6. 접근성 개선점

### 6.1 폼 필드 accessibilityLabel 미설정 (낮음)

**현상**: 입력 필드들에 접근성 레이블이 없음

**위치**: 모든 Input, Select 컴포넌트

**해결방안**: accessibilityLabel prop 추가

---

## 우선순위별 정리

### 높음 (즉시 수정)
1. ~~홈 화면 더블 헤더 문제~~ ✅ 수정 완료
2. ~~채팅 화면 SafeAreaView 미적용~~ ✅ 확인 완료 (네이티브 헤더 사용)

### 중간 (개선 필요)
3. ~~온보딩 LizardForm 뒤로가기 불가~~ ✅ 수정 완료
4. 생년월 입력 UX 개선 (DatePicker 필요)
5. ~~채팅 삭제 기능 UI 구현~~ ✅ 수정 완료 (스와이프 삭제)
6. 메시지 전송 실패 시 재시도 UX

### 낮음 (점진적 개선)
7. ~~Select 컴포넌트 취소 버튼~~ ✅ 수정 완료
8. ~~채팅 화면 빈 상태 안내~~ ✅ 수정 완료
9. ~~Loading 컴포넌트 색상 통일~~ ✅ 수정 완료
10. ~~ImagePicker 아이콘 교체~~ ✅ 수정 완료
11. ~~계정 삭제 버튼 스타일~~ ✅ 수정 완료 (danger variant 추가)
12. 접근성 레이블 추가

---

## 변경 이력

| 날짜 | 변경 내용 | 담당자 |
|------|----------|-------|
| 2024-01-15 | 초기 문서 작성 | Claude |
| 2024-01-15 | 1차 개선 완료 (6개 항목) | Claude |
| 2024-01-15 | Button danger variant 추가 및 계정 삭제 버튼 개선 | Claude |
| 2024-01-15 | 채팅방 스와이프 삭제, 동적 헤더 제목 추가 | Claude |

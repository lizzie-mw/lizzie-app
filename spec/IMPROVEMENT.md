# 꼬물톡 (Ggomul-Talk) - UI/UX 개선사항 문서

## 개요

꼬물톡 앱의 전체 플로우 검토 결과 발견된 UI/UX 문제점과 개선 방안을 정리합니다.
10차 반복 개선(방향성 → 기획 → 디자인 → 개발 → QA → 피드백)을 통해 종합적으로 개선했습니다.

---

## Iteration 1: Safe Area & Layout 수정

### 1.1 FAB 버튼 Safe Area 미적용
- **파일**: `app/(main)/index.tsx`
- **변경**: `absolute bottom-6 right-6` → `useSafeAreaInsets()` 활용 동적 bottom 계산
- **효과**: 노치/홈 인디케이터 디바이스에서 FAB이 겹치지 않음

### 1.2 Select 모달 하단 여백
- **파일**: `src/shared/ui/Select.tsx`
- **변경**: 고정 `h-8` → `useSafeAreaInsets().bottom` 동적 여백
- **효과**: 디바이스별 안전 영역 자동 대응

### 1.3 채팅 키보드 오프셋 하드코딩
- **파일**: `src/widgets/chat-room/ui/ChatRoom.tsx`
- **변경**: `keyboardVerticalOffset={90}` → `useHeaderHeight()` 동적 값
- **효과**: 모든 디바이스에서 키보드와 입력란이 정확히 맞물림

---

## Iteration 2: API 에러 처리 & 삭제 UX

### 2.1 API 에러 메시지 미표시
- **파일**: `src/shared/api/client.ts`
- **변경**: `beforeError` 훅에서 API 응답 body를 파싱, `HttpError`로 전환
- **효과**: "네트워크 에러" 대신 실제 에러 메시지 (예: "채팅방 개수 초과") 표시

### 2.2 채팅 삭제 시 즉각적 피드백 없음
- **파일**: `app/(main)/index.tsx`
- **변경**: 낙관적 업데이트 (onMutate/onError/onSettled) 적용
- **효과**: 삭제 버튼 탭 즉시 목록에서 사라짐, 실패 시 자동 롤백

---

## Iteration 3: SSE 에러 복구 & 한국어 조사

### 3.1 스트리밍 실패 시 재시도 불가
- **파일**: `src/features/send-message/api/useSSE.ts`
- **변경**: `retry()` 함수 노출, 마지막 메시지 저장
- **효과**: 에러 발생 시 재시도 버튼으로 마지막 메시지 재전송

### 3.2 에러 배너 UI
- **파일**: `src/widgets/chat-room/ui/ChatRoom.tsx`
- **변경**: `error` 구독, 인라인 에러 배너 + 재시도 버튼 추가
- **효과**: 스트리밍 실패 시 사용자 친화적 에러 표시

### 3.3 한국어 조사 오류 (와/과, 가/이)
- **파일**: `src/shared/lib/korean.ts` (신규), `app/(main)/chat/[chatId].tsx`, `src/entities/message/ui/TypingIndicator.tsx`
- **변경**: `withParticle()` 유틸 생성, 받침 여부로 올바른 조사 선택
- **효과**: "리치와의 대화" → "리치와의 대화" (받침 없음), "또리이 생각 중" → "또리가 생각 중" (받침 있음)

---

## Iteration 4: Input 포커스 & 채팅 인터랙션

### 4.1 Input 포커스 시각 피드백 없음
- **파일**: `src/shared/ui/Input.tsx`
- **변경**: NativeWind `focus:` 의사 클래스 → `useState`로 `isFocused` 관리
- **효과**: 입력 필드 포커스 시 테두리 색상 변경 (primary-500)

### 4.2 채팅 스크롤 시 키보드 유지
- **파일**: `src/widgets/chat-room/ui/ChatRoom.tsx`
- **변경**: FlatList에 `keyboardDismissMode="on-drag"` 추가
- **효과**: 메시지 스크롤 시 자연스럽게 키보드 닫힘

### 4.3 메시지 버블 너비 제한 과소
- **파일**: `src/entities/message/ui/ChatBubble.tsx`
- **변경**: `max-w-[75%]` → `max-w-[80%]`
- **효과**: 긴 한국어 텍스트도 더 여유있게 표시

---

## Iteration 5: EmptyState 애니메이션 & 리스트 아이템

### 5.1 EmptyState 애니메이션 지연 과다
- **파일**: `src/shared/ui/EmptyState.tsx`
- **변경**: `withDelay(1000)` → `withDelay(300)`
- **효과**: 빈 상태 애니메이션이 더 빠르게 시작되어 반응성 향상

### 5.2 새 대화 텍스트 표시
- **파일**: `src/entities/chat/ui/ChatListItem.tsx`
- **변경**: `message_count === 0`일 때 "새 대화" 표시
- **효과**: 메시지 없는 채팅방 구분 가능

### 5.3 아바타 이미지 깨짐 처리
- **파일**: `src/shared/ui/Avatar.tsx`
- **변경**: `onError` 핸들러로 fallback 아이콘 표시
- **효과**: 이미지 로드 실패 시 깨진 이미지 대신 기본 아바타 표시

---

## Iteration 6: 온보딩 & 로그인 개선

### 6.1 온보딩 진행 상태 표시
- **파일**: `app/(auth)/onboarding.tsx`
- **변경**: 프로그레스 바 추가 (초록색)
- **효과**: 사용자가 등록 진행 단계를 시각적으로 인지

### 6.2 온보딩 폼 키보드 겹침
- **파일**: `src/features/register-lizard/ui/LizardForm.tsx`
- **변경**: ScrollView에 `automaticallyAdjustKeyboardInsets` 추가
- **효과**: 키보드가 올라올 때 입력란이 자동으로 보이도록 조정

### 6.3 로그인 화면 접근성 개선
- **파일**: `app/(auth)/login.tsx`
- **변경**: 장식용 블롭에 `accessibilityElementsHidden` 추가, DEV 버튼 설명 텍스트 추가
- **효과**: 스크린 리더 사용자 경험 향상, 개발자 로그인 목적 명확화

---

## Iteration 7: Pull-to-Refresh

### 7.1 채팅 목록 새로고침 불가
- **파일**: `app/(main)/index.tsx`
- **변경**: FlatList에 `RefreshControl` 추가 (tintColor `#5cb82f`)
- **효과**: 당겨서 새로고침으로 채팅 목록 갱신

### 7.2 메시지 목록 새로고침 불가
- **파일**: `src/widgets/chat-room/ui/ChatRoom.tsx`
- **변경**: FlatList에 `RefreshControl` 추가
- **효과**: 당겨서 새로고침으로 메시지 목록 갱신

---

## Iteration 8: 메시지 날짜 구분선

### 8.1 날짜별 메시지 구분 없음
- **파일**: `src/shared/lib/date.ts`, `src/entities/message/ui/DateSeparator.tsx` (신규), `src/widgets/chat-room/ui/ChatRoom.tsx`
- **변경**: `formatDateSeparator`, `isSameDay` 함수 추가, DateSeparator 컴포넌트 생성, renderItem에서 날짜 변경 시 구분선 렌더
- **효과**: "오늘", "어제", "2024년 1월 15일" 형태의 날짜 구분선으로 메시지 시간 맥락 제공

---

## Iteration 9: 네트워크 상태 & 햅틱 일관성

### 9.1 오프라인 인지 불가
- **파일**: `src/shared/ui/NetworkBanner.tsx` (신규), `app/(main)/_layout.tsx`
- **변경**: 네트워크 끊김 시 빨간 배너 표시
- **효과**: 사용자가 오프라인 상태를 즉시 인지, 불필요한 조작 방지

### 9.2 스와이프 시 햅틱 미제공
- **파일**: `src/entities/chat/ui/ChatListItem.tsx`
- **변경**: `onSwipeableOpen`에 `haptics.light()` 추가
- **효과**: 스와이프 액션에 촉각 피드백 제공

---

## Iteration 10: 디자인 정리 & 마무리

### 10.1 Card 컴포넌트 Android 그림자 미표시
- **파일**: `src/shared/ui/Card.tsx`
- **변경**: `elevated` variant에 `Platform.OS === 'android'` 시 `elevation: 4` 적용
- **효과**: Android에서도 카드 그림자 표시

### 10.2 설정 화면 버전 하드코딩
- **파일**: `app/(main)/settings/index.tsx`
- **변경**: `v1.0.0` → `Constants.expoConfig?.version` 동적 읽기
- **효과**: app.json 버전과 자동 동기화

---

## 신규 파일

| 파일 | 용도 |
|------|------|
| `src/shared/lib/korean.ts` | 한국어 조사 처리 유틸 (withParticle) |
| `src/entities/message/ui/DateSeparator.tsx` | 날짜 구분선 컴포넌트 |
| `src/shared/ui/NetworkBanner.tsx` | 네트워크 끊김 배너 |

## 주요 수정 파일

| 파일 | 수정 Iteration |
|------|---------------|
| `src/widgets/chat-room/ui/ChatRoom.tsx` | 1, 3, 4, 7, 8 |
| `app/(main)/index.tsx` | 1, 2, 7 |
| `src/shared/api/client.ts` | 2 |
| `src/shared/ui/Input.tsx` | 4 |
| `src/features/send-message/api/useSSE.ts` | 3 |
| `app/(auth)/login.tsx` | 6 |
| `app/(auth)/onboarding.tsx` | 6 |
| `src/entities/chat/ui/ChatListItem.tsx` | 5, 9 |
| `src/shared/ui/Avatar.tsx` | 5 |
| `src/shared/ui/EmptyState.tsx` | 5 |
| `src/shared/ui/Card.tsx` | 10 |
| `app/(main)/settings/index.tsx` | 10 |
| `app/(main)/_layout.tsx` | 9 |

---

## 미해결 개선점

| 항목 | 우선순위 | 비고 |
|------|---------|------|
| 생년월 입력을 DatePicker로 교체 | 중간 | 현재 텍스트 직접 입력 |
| 접근성 레이블 추가 (폼 필드) | 낮음 | 전체 Input/Select 대상 |
| 로그아웃 후 전환 시 깜빡임 | 낮음 | 로딩 상태 표시 필요 |

# testID 추가 작업 목록

이 파일은 Maestro E2E 테스트를 위해 필요한 testID 추가 작업 목록입니다.

## Phase 1: Critical (필수) - 채팅 플로우 테스트용

### 1. ChatInput (`src/features/send-message/ui/ChatInput.tsx`)

**현재 상태**: testID 없음
**필요한 testID**:

```tsx
// 전체 컨테이너
<View testID="chat-input" className="...">

  // 입력 필드
  <TextInput
    testID="chat-input-field"
    className="..."
    // ...
  />

  // 전송 버튼
  <Pressable
    testID="chat-send-button"
    className="..."
    // ...
  >
```

**우선순위**: P0
**예상 작업 시간**: 5분

---

### 2. ChatBubble (`src/entities/message/ui/ChatBubble.tsx`)

**현재 상태**: testID 없음
**필요한 testID**:

```tsx
// role 기반 동적 testID
<View
  testID={`chat-bubble-${message.role}`}
  className="..."
>
```

또는 더 구체적으로:

```tsx
<View
  testID={isUser ? "chat-bubble-user" : "chat-bubble-assistant"}
  className="..."
>
```

**우선순위**: P0
**예상 작업 시간**: 5분

---

### 3. ChatRoom (`src/widgets/chat-room/ui/ChatRoom.tsx`)

**현재 상태**: testID 없음
**필요한 testID**:

```tsx
<KeyboardAvoidingView
  testID="chat-room-screen"
  className="flex-1 bg-white"
  // ...
>
```

**우선순위**: P0
**예상 작업 시간**: 3분

---

### 4. ChatListItem (`src/entities/chat/ui/ChatListItem.tsx`)

**현재 상태**: testID 없음
**필요한 testID**:

```tsx
<Pressable
  testID={`chat-list-item-${chat.id}`}
  className="..."
  onPress={handlePress}
>
```

또는 간단하게:

```tsx
<Pressable
  testID="chat-list-item"
  className="..."
  // ...
>
```

**우선순위**: P1
**예상 작업 시간**: 3분

---

**Phase 1 총 예상 시간**: 16분

---

## Phase 2: Major (권장) - 설정 플로우 테스트용

### 5. SettingsScreen (`app/(main)/settings/index.tsx`)

**현재 상태**: testID 없음
**필요한 testID**:

```tsx
<SafeAreaView testID="settings-screen" className="...">

  // 도마뱀 정보 메뉴
  <SettingsItem
    testID="settings-item-lizard"
    icon="🦎"
    title="도마뱀 정보"
    // ...
  />

  // 계정 메뉴
  <SettingsItem
    testID="settings-item-account"
    icon="👤"
    title="계정"
    // ...
  />

  // 로그아웃 메뉴
  <SettingsItem
    testID="settings-item-logout"
    icon="🚪"
    title="로그아웃"
    // ...
  />
</SafeAreaView>
```

**참고**: SettingsItem 컴포넌트에 testID prop 추가 필요

```tsx
interface SettingsItemProps {
  testID?: string;  // 추가
  icon: string;
  title: string;
  onPress: () => void;
  danger?: boolean;
}

function SettingsItem({ testID, icon, title, onPress, danger }: SettingsItemProps) {
  return (
    <Pressable
      testID={testID}  // 추가
      className="..."
      // ...
    >
```

**우선순위**: P1
**예상 작업 시간**: 10분

---

### 6. AccountSettingsScreen (`app/(main)/settings/account.tsx`)

**현재 상태**: testID 없음
**필요한 testID**:

```tsx
<SafeAreaView testID="account-screen" className="...">

  // ...

  <Button
    testID="button-delete-account"
    variant="ghost"
    // ...
  >
```

**우선순위**: P2
**예상 작업 시간**: 5분

---

**Phase 2 총 예상 시간**: 15분

---

## Phase 3: Minor (선택) - 향상된 테스트용

### 7. LizardAvatar (`src/entities/lizard/ui/LizardAvatar.tsx`)

**필요한 testID**: `lizard-avatar`
**우선순위**: P2
**예상 작업 시간**: 3분

---

### 8. TypingIndicator (`src/entities/message/ui/TypingIndicator.tsx`)

**필요한 testID**: `typing-indicator`
**우선순위**: P3
**예상 작업 시간**: 3분

---

### 9. ImagePicker (`src/features/upload-image/ui/ImagePicker.tsx`)

**필요한 testID**: `image-picker`
**우선순위**: P3
**예상 작업 시간**: 3분

---

**Phase 3 총 예상 시간**: 9분

---

## 전체 작업 요약

| Phase | 우선순위 | 컴포넌트 수 | 예상 시간 |
|-------|----------|-------------|-----------|
| Phase 1 | Critical | 4개 | 16분 |
| Phase 2 | Major | 2개 | 15분 |
| Phase 3 | Minor | 3개 | 9분 |
| **합계** | | **9개** | **40분** |

---

## 작업 순서 (권장)

1. Phase 1: ChatInput → ChatBubble → ChatRoom → ChatListItem
2. 08-send-message-flow.yaml 실행하여 검증
3. Phase 2: SettingsScreen → AccountSettingsScreen
4. 10-logout-flow.yaml 실행하여 검증
5. Phase 3: 필요 시 추가

---

## 참고: testID 네이밍 컨벤션

- **화면 레벨**: `{screen-name}-screen` (예: `chat-room-screen`)
- **주요 컴포넌트**: `{component-name}` (예: `chat-input`)
- **버튼**: `button-{action}` 또는 `{context}-button` (예: `chat-send-button`)
- **입력 필드**: `input-{field-name}` (예: `chat-input-field`)
- **리스트 아이템**: `{list-name}-item` 또는 `{list-name}-item-{id}` (예: `chat-list-item`)
- **role/type 기반**: `{component}-{type}` (예: `chat-bubble-user`)

---

## 작업 후 검증 방법

### 1. iOS Simulator에서 테스트

```bash
# Phase 1 완료 후
maestro test .maestro/flows/08-send-message-flow.yaml

# Phase 2 완료 후
maestro test .maestro/flows/10-logout-flow.yaml

# 전체 테스트
maestro test .maestro/flows/ --include-tags regression
```

### 2. Android Emulator에서 테스트

```bash
# 동일한 명령어 사용
maestro test .maestro/flows/ --include-tags smoke
```

---

## 참고 자료

- Maestro testID 문서: https://maestro.mobile.dev/api-reference/commands/tapOn#id
- React Native testID: https://reactnative.dev/docs/view#testid
- Expo 접근성: https://docs.expo.dev/guides/accessibility/

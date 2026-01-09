# Lizzie App - Claude Instructions

## Project Overview

Lizzie는 도마뱀 반려인을 위한 AI 챗봇 앱입니다. 사용자가 등록한 도마뱀의 페르소나로 대화하며 케어 정보를 제공합니다.

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Package Manager | **bun** | 1.0+ |
| Framework | React Native | 0.81+ |
| Platform | Expo | SDK 54+ |
| Language | TypeScript | 5.3+ (strict mode) |
| Routing | Expo Router | 6.0+ |
| State (Client) | Zustand | 5.0+ |
| State (Server) | TanStack Query | 5.60+ |
| Styling | NativeWind | 4.1+ |
| Auth | Supabase Auth | Google OAuth |
| Forms | React Hook Form + Zod | |
| HTTP | **ky** | 1.0+ |

## Architecture: Feature-Sliced Design (FSD)

This project uses FSD architecture. Layer imports must flow **downward only**:

```
app → widgets → features → entities → shared
```

### Layer Responsibilities

| Layer | Purpose | Example |
|-------|---------|---------|
| `app/` | Global providers, config | QueryProvider, AuthProvider |
| `widgets/` | Composed feature blocks | ChatRoom, LizardProfileCard |
| `features/` | User actions/scenarios | send-message, create-chat, auth |
| `entities/` | Business domain objects | lizard, chat, message, user |
| `shared/` | Reusable utilities | ui, lib, config, types |

### Import Rules

```typescript
// CORRECT: Higher layer imports from lower layer
import { ChatRoom } from '@/widgets/chat-room';
import { useLizard } from '@/entities/lizard';
import { Button } from '@/shared/ui';

// WRONG: Same layer or upward imports
import { ChatBubble } from '@/entities/message';  // Same layer - forbidden
import { ChatRoom } from '@/widgets/chat-room';   // Upper layer - forbidden
```

### Slice Structure

Each slice can have these segments:
- `api/` - API calls, Query factories
- `model/` - Types, stores, hooks
- `ui/` - React components
- `lib/` - Utility functions
- `index.ts` - Public API exports

## Folder Structure

```
lizzie-app/
├── app/                          # Expo Router (Pages)
│   ├── (auth)/                   # Auth group
│   │   ├── login.tsx
│   │   └── onboarding.tsx
│   └── (main)/                   # Main group (auth required)
│       ├── index.tsx             # Home (chat list)
│       ├── chat/[chatId].tsx
│       └── settings/
│
├── src/
│   ├── app/                      # App layer
│   │   └── providers/
│   │
│   ├── widgets/                  # Widgets layer
│   │   ├── chat-room/
│   │   └── lizard-profile-card/
│   │
│   ├── features/                 # Features layer
│   │   ├── auth/
│   │   ├── send-message/
│   │   ├── create-chat/
│   │   ├── register-lizard/
│   │   └── upload-image/
│   │
│   ├── entities/                 # Entities layer
│   │   ├── lizard/
│   │   ├── chat/
│   │   ├── message/
│   │   └── user/
│   │
│   └── shared/                   # Shared layer
│       ├── api/
│       ├── config/
│       ├── lib/
│       ├── ui/
│       ├── constants/
│       └── types/
│
├── global.css
├── app.json
├── metro.config.js
├── babel.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Coding Patterns

### TanStack Query - Use queryOptions Factory

```typescript
// entities/lizard/api/lizardQueries.ts
export const lizardKeys = {
  all: ['lizard'] as const,
  me: () => [...lizardKeys.all, 'me'] as const,
};

export const lizardQueries = {
  me: () =>
    queryOptions({
      queryKey: lizardKeys.me(),
      queryFn: lizardApi.getMyLizard,
      staleTime: 1000 * 60 * 5,
    }),
};

// Usage
const query = useQuery(lizardQueries.me());
```

### Zustand - Use Middleware

```typescript
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        // state and actions
      })),
      { name: 'auth-storage', storage: createJSONStorage(() => AsyncStorage) }
    ),
    { name: 'AuthStore' }
  )
);

// Optimized selectors
export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.session);
```

### Error Handling - Use ErrorBoundary + Suspense

```typescript
<QueryProvider>
  <SuspenseView>
    <Stack />
  </SuspenseView>
</QueryProvider>
```

### TypeScript - Use Strict Patterns

```typescript
// Branded types for IDs
export type LizardId = Branded<string, 'LizardId'>;

// Discriminated unions
export type Message = UserMessage | AssistantMessage | SystemMessage;

// Type guards
export function isStreamingMessage(msg: DisplayMessage): msg is StreamingMessage {
  return 'isStreaming' in msg && msg.isStreaming === true;
}

// const assertions + satisfies
export const SPECIES_OPTIONS = [...] as const satisfies readonly { label: string; value: string }[];
```

## Key Business Rules

| Rule | Detail |
|------|--------|
| Users | 1 lizard per user (MVP) |
| Chat Rooms | Max 5 per lizard |
| Message History | Last 30 messages in context |
| Image Size | Max 5MB (JPEG, PNG, HEIC) |
| Auth | Google OAuth only |

## Important Files

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout with providers |
| `src/app/providers/` | QueryProvider, AuthProvider |
| `src/shared/api/client.ts` | ky instance with hooks |
| `src/shared/lib/supabase.ts` | Supabase client |
| `src/features/auth/model/authStore.ts` | Auth state management |
| `src/entities/*/api/*Queries.ts` | Query factories |

## SSE Streaming

Messages are streamed via SSE. The `useSSE` hook handles:
- Exponential backoff retry (max 3 retries)
- Cleanup on unmount
- Error state management

```typescript
const { sendMessage, isStreaming, streamingText, error } = useSSE(chatId, {
  onComplete: () => refetch(),
  onError: (error) => Alert.alert('Error', error.message),
});
```

## Styling with NativeWind

Use Tailwind CSS classes via NativeWind:

```typescript
<View className="flex-1 bg-white px-4 py-6">
  <Text className="text-xl font-bold text-gray-900">Title</Text>
</View>
```

Custom colors are defined in `tailwind.config.js` under `primary`.

## Testing Considerations

- Run `bunx expo-doctor@latest` to check library compatibility
- Test on both iOS and Android
- Verify SSE streaming works correctly
- Test offline behavior with NetInfo

## Common Commands

```bash
# Install dependencies
bun install

# Start development
bun start
# or
bunx expo start

# Build for development
bunx eas build --profile development --platform ios

# Build for production
bunx eas build --profile production --platform all

# Submit to stores
bunx eas submit --platform ios
bunx eas submit --platform android

# Check library compatibility
bunx expo-doctor@latest
```

## Reference Documents

- [Frontend Tech Spec](./spec/lizzie-frontend-tech-spec.md)
- [Product Spec](./spec/lizzie-product-spec.md)

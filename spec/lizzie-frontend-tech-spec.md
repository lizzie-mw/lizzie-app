# 🦎 Lizzie - Frontend Tech Spec

> **문서 버전**: v2.0
> **최종 수정일**: 2025-01-10
> **작성자**: 명근

---

## 1. 개요

### 1.1 목적
이 문서는 Lizzie 서비스의 프론트엔드(모바일 앱) 구현에 필요한 기술 명세를 정의한다.

### 1.2 기술 스택

| 영역 | 기술 | 버전 | 비고 |
|------|------|------|------|
| **Framework** | React Native | 0.76+ | Expo 기반, New Architecture |
| **Development** | Expo | SDK 52+ | Managed workflow |
| **Language** | TypeScript | 5.3+ | 필수, strict mode |
| **State Management** | Zustand | 5.0+ | 경량 상태 관리 + middleware |
| **Server State** | TanStack Query | 5.60+ | queryOptions/mutationOptions |
| **Navigation** | Expo Router | 4.0+ | 파일 기반 라우팅 |
| **Styling** | NativeWind | 4.1+ | Tailwind CSS |
| **Auth** | Supabase Auth | - | Google OAuth |
| **HTTP Client** | Axios | 1.7+ | |
| **Form** | React Hook Form | 7.54+ | + Zod 검증 |
| **Image** | Expo Image | - | + ImageManipulator |
| **Error Handling** | react-error-boundary | 4.1+ | ErrorBoundary + Suspense |
| **Offline** | @react-native-community/netinfo | 11.4+ | 네트워크 상태 감지 |
| **Haptics** | expo-haptics | - | 햅틱 피드백 |

### 1.3 지원 플랫폼

| 플랫폼 | 최소 버전 | 비고 |
|--------|----------|------|
| iOS | 15.1+ | React Native 0.76+ 요구사항 |
| Android | API 24+ (Android 7.0) | compileSdk 35 |

### 1.4 아키텍처

#### 1.4.1 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    Expo App (New Architecture)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Error Boundary + Suspense               │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   FSD Layers                         │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐ │   │
│  │  │ Widgets │→ │Features │→ │Entities │→ │ Shared │ │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    State Layer                        │  │
│  │  ┌─────────────┐          ┌─────────────────────┐    │  │
│  │  │   Zustand   │          │   TanStack Query    │    │  │
│  │  │  + immer    │          │  + queryOptions     │    │  │
│  │  │  + persist  │          │  + Suspense         │    │  │
│  │  └─────────────┘          └─────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   API Layer                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │    Axios    │  │   SSE       │  │  Supabase    │  │  │
│  │  │  (REST)     │  │  (Stream)   │  │  (Auth)      │  │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │         Backend API           │
              │    (FastAPI + Gemini)         │
              └───────────────────────────────┘
```

#### 1.4.2 FSD (Feature-Sliced Design) 개요

레이어 흐름은 **단방향(하향)**으로만 허용됩니다:

```
app → widgets → features → entities → shared
```

| 레이어 | 역할 | 예시 |
|--------|------|------|
| **app** | 전역 프로바이더, 설정 | QueryProvider, AuthProvider |
| **widgets** | 조합된 독립 기능 블록 | ChatRoom, LizardProfileCard |
| **features** | 사용자 액션/시나리오 | send-message, create-chat, auth |
| **entities** | 비즈니스 도메인 객체 | lizard, chat, message, user |
| **shared** | 재사용 유틸리티 | ui, lib, config, types |

### 1.5 참조 문서
- [Lizzie 기획/정책 문서](./lizzie-product-spec.md)
- [Lizzie 백엔드 테크스펙](./lizzie-backend-tech-spec-v2.md)

---

## 2. 프로젝트 구조 (FSD)

Feature-Sliced Design을 적용한 폴더 구조입니다.

```
lizzie-app/
├── app/                              # Expo Router (Pages 레이어)
│   ├── _layout.tsx                   # Root 레이아웃
│   ├── index.tsx                     # 진입점 (리다이렉트)
│   │
│   ├── (auth)/                       # 인증 그룹
│   │   ├── _layout.tsx
│   │   ├── login.tsx                 # 로그인 화면
│   │   └── onboarding.tsx            # 도마뱀 등록 화면
│   │
│   └── (main)/                       # 메인 그룹 (인증 필요)
│       ├── _layout.tsx
│       ├── index.tsx                 # 홈 (채팅 목록)
│       ├── chat/
│       │   └── [chatId].tsx          # 채팅 화면
│       └── settings/
│           ├── index.tsx             # 설정 메인
│           ├── lizard.tsx            # 도마뱀 프로필 수정
│           └── account.tsx           # 계정 설정
│
├── src/
│   ├── app/                          # App 레이어: 전역 설정
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx     # TanStack Query 설정
│   │   │   ├── AuthProvider.tsx      # 인증 상태 관리
│   │   │   └── index.tsx             # 프로바이더 조합
│   │   └── styles/
│   │       └── global.css            # Tailwind 글로벌 스타일
│   │
│   ├── widgets/                      # Widgets 레이어: 조합된 기능 블록
│   │   ├── chat-room/
│   │   │   ├── ui/
│   │   │   │   └── ChatRoom.tsx      # 채팅방 전체 위젯
│   │   │   └── index.ts
│   │   │
│   │   └── lizard-profile-card/
│   │       ├── ui/
│   │       │   └── LizardProfileCard.tsx
│   │       └── index.ts
│   │
│   ├── features/                     # Features 레이어: 사용자 액션
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   ├── model/
│   │   │   │   ├── authStore.ts      # Zustand + middleware
│   │   │   │   └── useAuth.ts
│   │   │   ├── ui/
│   │   │   │   └── GoogleLoginButton.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── send-message/
│   │   │   ├── api/
│   │   │   │   └── useSSE.ts         # SSE 스트리밍 훅
│   │   │   ├── ui/
│   │   │   │   └── ChatInput.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── create-chat/
│   │   │   ├── model/
│   │   │   │   └── useCreateChat.ts
│   │   │   ├── ui/
│   │   │   │   └── NewChatButton.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── register-lizard/
│   │   │   ├── model/
│   │   │   │   ├── lizardSchema.ts   # Zod 스키마
│   │   │   │   └── useRegisterLizard.ts
│   │   │   ├── ui/
│   │   │   │   └── LizardForm.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── upload-image/
│   │       ├── model/
│   │       │   └── useImageUpload.ts
│   │       ├── ui/
│   │       │   └── ImagePicker.tsx
│   │       └── index.ts
│   │
│   ├── entities/                     # Entities 레이어: 비즈니스 객체
│   │   ├── lizard/
│   │   │   ├── api/
│   │   │   │   ├── lizardApi.ts
│   │   │   │   └── lizardQueries.ts  # queryOptions 팩토리
│   │   │   ├── model/
│   │   │   │   └── types.ts
│   │   │   ├── ui/
│   │   │   │   ├── LizardAvatar.tsx
│   │   │   │   └── LizardInfo.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── chat/
│   │   │   ├── api/
│   │   │   │   ├── chatApi.ts
│   │   │   │   └── chatQueries.ts
│   │   │   ├── model/
│   │   │   │   └── types.ts
│   │   │   ├── ui/
│   │   │   │   └── ChatListItem.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── message/
│   │   │   ├── api/
│   │   │   │   ├── messageApi.ts
│   │   │   │   └── messageQueries.ts
│   │   │   ├── model/
│   │   │   │   └── types.ts
│   │   │   ├── ui/
│   │   │   │   ├── ChatBubble.tsx
│   │   │   │   └── TypingIndicator.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── user/
│   │       ├── model/
│   │       │   └── types.ts
│   │       └── index.ts
│   │
│   └── shared/                       # Shared 레이어: 재사용 유틸리티
│       ├── api/
│       │   ├── client.ts             # Axios 인스턴스
│       │   └── queryClient.ts        # TanStack Query 클라이언트
│       │
│       ├── config/
│       │   └── env.ts                # 환경 변수
│       │
│       ├── lib/
│       │   ├── supabase.ts           # Supabase 클라이언트
│       │   ├── storage.ts            # SecureStore 래퍼
│       │   ├── image.ts              # 이미지 처리 (HEIC 변환)
│       │   ├── date.ts               # 날짜 유틸
│       │   ├── haptics.ts            # 햅틱 피드백
│       │   └── offline.ts            # 오프라인 지원
│       │
│       ├── ui/
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Select.tsx
│       │   ├── Avatar.tsx
│       │   ├── Loading.tsx
│       │   ├── ErrorBoundary.tsx     # 에러 바운더리
│       │   ├── SuspenseView.tsx      # Suspense 래퍼
│       │   └── index.ts
│       │
│       ├── constants/
│       │   ├── species.ts
│       │   └── personality.ts
│       │
│       └── types/
│           ├── api.ts                # API 응답 타입
│           ├── branded.ts            # Branded 타입 (ID)
│           └── common.ts
│
├── assets/                           # 정적 리소스
│   ├── images/
│   └── fonts/
│
├── global.css                        # NativeWind 엔트리
├── app.json                          # Expo 설정
├── metro.config.js                   # Metro + NativeWind
├── babel.config.js                   # Babel 설정
├── tailwind.config.js                # NativeWind 설정
├── tsconfig.json
├── nativewind-env.d.ts               # NativeWind 타입
└── package.json
```

### 2.1 FSD Import 규칙

```typescript
// ✅ 올바른 import (상위 → 하위)
// app/(main)/index.tsx
import { ChatRoom } from '@/widgets/chat-room';
import { useLizard } from '@/entities/lizard';
import { Button } from '@/shared/ui';

// ❌ 금지된 import (같은 레이어 또는 하위 → 상위)
// entities/lizard/model/useLizard.ts
import { ChatBubble } from '@/entities/message';  // 같은 레이어 ❌
import { ChatRoom } from '@/widgets/chat-room';   // 상위 레이어 ❌
```

### 2.2 슬라이스 구조 규칙

각 슬라이스는 다음 세그먼트를 가질 수 있습니다:

| 세그먼트 | 역할 |
|----------|------|
| **api/** | API 호출, Query 팩토리 |
| **model/** | 타입, 스토어, 훅 |
| **ui/** | React 컴포넌트 |
| **lib/** | 유틸리티 함수 |
| **index.ts** | Public API (외부 노출 인터페이스) |

---

## 3. 환경 설정

### 3.1 app.json

```json
{
  "expo": {
    "name": "Lizzie",
    "slug": "lizzie",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "lizzie",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "app.lizzie",
      "deploymentTarget": "15.1",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "도마뱀 프로필 사진을 설정하기 위해 사진 접근이 필요해요.",
        "NSCameraUsageDescription": "도마뱀 사진을 찍기 위해 카메라 접근이 필요해요."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "app.lizzie",
      "compileSdkVersion": 35,
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE"
      ]
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      [
        "expo-image-picker",
        {
          "photosPermission": "도마뱀 프로필 사진을 설정하기 위해 사진 접근이 필요해요.",
          "cameraPermission": "도마뱀 사진을 찍기 위해 카메라 접근이 필요해요."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 3.2 환경 변수

```typescript
// src/shared/config/env.ts
export const CONFIG = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.lizzie.app',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
} as const;

// 타입 안전한 환경 변수 검증
if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
  throw new Error('Missing required environment variables');
}
```

**.env**
```env
EXPO_PUBLIC_API_URL=https://api.lizzie.app
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.3 package.json (주요 의존성)

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-image": "~2.0.0",
    "expo-image-picker": "~16.0.0",
    "expo-image-manipulator": "~13.0.0",
    "expo-haptics": "~14.0.0",

    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-reanimated": "~3.17.4",
    "react-native-safe-area-context": "5.4.0",

    "@supabase/supabase-js": "^2.47.0",
    "@tanstack/react-query": "^5.60.0",
    "zustand": "^5.0.0",
    "immer": "^10.1.0",
    "axios": "^1.7.0",
    "react-native-sse": "^1.2.1",

    "nativewind": "^4.1.0",
    "tailwindcss": "^3.4.17",

    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.24.0",

    "date-fns": "^4.1.0",
    "react-error-boundary": "^4.1.0",
    "@react-native-community/netinfo": "^11.4.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "^5.6.0",
    "prettier-plugin-tailwindcss": "^0.5.11"
  }
}
```

### 3.4 tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "nativewind-env.d.ts"
  ]
}
```

### 3.5 metro.config.js

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### 3.6 babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // Note: react-native-reanimated/plugin is NOT needed with New Architecture
  };
};
```

### 3.7 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
};
```

### 3.8 global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .safe-area-top {
    padding-top: env(safe-area-inset-top);
  }
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

### 3.9 nativewind-env.d.ts

```typescript
/// <reference types="nativewind/types" />
```

---

## 4. 인증 (Supabase Auth)

### 4.1 Supabase 클라이언트

```typescript
// src/shared/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '@/shared/config/env';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

### 4.2 Auth Store (Zustand + Middleware)

```typescript
// src/features/auth/model/authStore.ts
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

interface AuthActions {
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        initialize: async () => {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            set((state) => {
              state.session = session;
              state.user = session?.user ?? null;
              state.isLoading = false;
            });

            // 세션 변경 리스너
            supabase.auth.onAuthStateChange((_event, session) => {
              set((state) => {
                state.session = session;
                state.user = session?.user ?? null;
              });
            });
          } catch (error) {
            set((state) => {
              state.error = error as Error;
              state.isLoading = false;
            });
          }
        },

        signInWithGoogle: async () => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: 'lizzie://auth/callback',
                queryParams: {
                  access_type: 'offline',
                  prompt: 'consent',
                },
              },
            });

            if (error) throw error;
          } catch (error) {
            set((state) => {
              state.error = error as Error;
            });
            throw error;
          } finally {
            set((state) => {
              state.isLoading = false;
            });
          }
        },

        signOut: async () => {
          await supabase.auth.signOut();
          set((state) => {
            state.session = null;
            state.user = null;
          });
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },
      })),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          session: state.session,
          user: state.user,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// 최적화된 셀렉터
export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.session);

export const useUser = () =>
  useAuthStore((state) => state.user);

export const useAuthLoading = () =>
  useAuthStore((state) => state.isLoading);
```

### 4.3 useAuth Hook

```typescript
// src/features/auth/model/useAuth.ts
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore, useIsAuthenticated, useAuthLoading } from './authStore';
import { useLizard } from '@/entities/lizard';

export function useAuth() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const user = useAuthStore((state) => state.user);
  const { lizard, isLoading: isLizardLoading } = useLizard();

  useEffect(() => {
    if (isLoading || isLizardLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // 미인증 → 로그인으로
      router.replace('/login');
    } else if (isAuthenticated && !lizard && !inAuthGroup) {
      // 인증됐지만 도마뱀 없음 → 온보딩으로
      router.replace('/onboarding');
    } else if (isAuthenticated && lizard && inAuthGroup) {
      // 인증 + 도마뱀 있음 → 메인으로
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, lizard, isLizardLoading, segments]);

  return { isAuthenticated, isLoading, user };
}
```

### 4.4 로그인 화면

```typescript
// app/(auth)/login.tsx
import { useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/ui';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('로그인 실패', '다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      {/* 로고 */}
      <Image
        source={require('@/assets/images/logo.png')}
        className="w-32 h-32 mb-8"
      />
      
      {/* 타이틀 */}
      <Text className="text-2xl font-bold text-gray-900 mb-2">
        Lizzie
      </Text>
      <Text className="text-base text-gray-500 mb-12 text-center">
        내 도마뱀과 대화하며{'\n'}케어 정보를 배워보세요
      </Text>
      
      {/* Google 로그인 버튼 */}
      <Button
        onPress={handleGoogleLogin}
        loading={isLoading}
        variant="outline"
        className="w-full"
      >
        <Image
          source={require('@/assets/images/google-logo.png')}
          className="w-5 h-5 mr-3"
        />
        <Text>Google로 계속하기</Text>
      </Button>
      
      {/* 이용약관 */}
      <Text className="text-xs text-gray-400 mt-6 text-center">
        계속하면 이용약관 및 개인정보처리방침에{'\n'}동의하는 것으로 간주합니다.
      </Text>
    </View>
  );
}
```

---

## 5. API 클라이언트

### 5.1 Axios 인스턴스

```typescript
// src/shared/api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { CONFIG } from '@/shared/config/env';
import { supabase } from '@/shared/lib/supabase';

export const apiClient = axios.create({
  baseURL: `${CONFIG.API_URL}/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: 토큰 추가
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // 토큰 만료 → 리프레시 시도
      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        // 리프레시 실패 → 로그아웃
        await supabase.auth.signOut();
      } else if (error.config) {
        // 리프레시 성공 → 재요청
        return apiClient.request(error.config);
      }
    }

    return Promise.reject(error);
  }
);

// 에러 타입
interface ApiError {
  detail: {
    code: string;
    message: string;
  };
}

// 에러 메시지 추출 헬퍼
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail?.message || '오류가 발생했어요.';
  }
  return '오류가 발생했어요.';
}
```

### 5.2 Lizard API + Query Factory

```typescript
// src/entities/lizard/api/lizardApi.ts
import { apiClient } from '@/shared/api/client';
import type { Lizard, LizardCreate, LizardUpdate } from '../model/types';

export const lizardApi = {
  getMyLizard: async (): Promise<Lizard | null> => {
    try {
      const { data } = await apiClient.get<Lizard>('/lizards/me');
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createLizard: async (payload: LizardCreate): Promise<Lizard> => {
    const { data } = await apiClient.post<Lizard>('/lizards', payload);
    return data;
  },

  updateLizard: async (id: string, payload: LizardUpdate): Promise<Lizard> => {
    const { data } = await apiClient.patch<Lizard>(`/lizards/${id}`, payload);
    return data;
  },

  deleteLizard: async (id: string): Promise<void> => {
    await apiClient.delete(`/lizards/${id}`);
  },

  getImageUploadUrl: async (
    id: string,
    contentType: string
  ): Promise<{ upload_url: string; image_url: string }> => {
    const { data } = await apiClient.post(`/lizards/${id}/image/presigned-url`, {
      content_type: contentType,
    });
    return data;
  },

  updateImageUrl: async (id: string, imageUrl: string): Promise<void> => {
    await apiClient.patch(`/lizards/${id}/image`, { image_url: imageUrl });
  },
};
```

```typescript
// src/entities/lizard/api/lizardQueries.ts
import { queryOptions, mutationOptions } from '@tanstack/react-query';
import { lizardApi } from './lizardApi';
import type { LizardCreate, LizardUpdate } from '../model/types';

// Query Key Factory
export const lizardKeys = {
  all: ['lizard'] as const,
  me: () => [...lizardKeys.all, 'me'] as const,
  detail: (id: string) => [...lizardKeys.all, 'detail', id] as const,
};

// Query Options Factory
export const lizardQueries = {
  me: () =>
    queryOptions({
      queryKey: lizardKeys.me(),
      queryFn: lizardApi.getMyLizard,
      staleTime: 1000 * 60 * 5, // 5분
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: lizardKeys.detail(id),
      queryFn: () => lizardApi.getMyLizard(), // API가 단일 도마뱀만 지원
      enabled: !!id,
    }),
};

// Mutation Options Factory
export const lizardMutations = {
  create: () =>
    mutationOptions({
      mutationFn: (data: LizardCreate) => lizardApi.createLizard(data),
    }),

  update: () =>
    mutationOptions({
      mutationFn: ({ id, data }: { id: string; data: LizardUpdate }) =>
        lizardApi.updateLizard(id, data),
    }),

  delete: () =>
    mutationOptions({
      mutationFn: (id: string) => lizardApi.deleteLizard(id),
    }),
};
```

### 5.3 Chat API + Query Factory

```typescript
// src/entities/chat/api/chatApi.ts
import { apiClient } from '@/shared/api/client';
import type { Chat, ChatCreate } from '../model/types';

export const chatApi = {
  getChats: async (lizardId: string): Promise<Chat[]> => {
    const { data } = await apiClient.get<{ data: Chat[] }>(
      `/lizards/${lizardId}/chats`
    );
    return data.data;
  },

  createChat: async (lizardId: string, payload: ChatCreate): Promise<Chat> => {
    const { data } = await apiClient.post<Chat>(
      `/lizards/${lizardId}/chats`,
      payload
    );
    return data;
  },

  deleteChat: async (chatId: string): Promise<void> => {
    await apiClient.delete(`/chats/${chatId}`);
  },
};
```

```typescript
// src/entities/chat/api/chatQueries.ts
import { queryOptions, mutationOptions } from '@tanstack/react-query';
import { chatApi } from './chatApi';
import type { ChatCreate } from '../model/types';

export const chatKeys = {
  all: ['chats'] as const,
  list: (lizardId: string) => [...chatKeys.all, 'list', lizardId] as const,
  detail: (chatId: string) => [...chatKeys.all, 'detail', chatId] as const,
};

export const chatQueries = {
  list: (lizardId: string) =>
    queryOptions({
      queryKey: chatKeys.list(lizardId),
      queryFn: () => chatApi.getChats(lizardId),
      enabled: !!lizardId,
      staleTime: 1000 * 60 * 2, // 2분
    }),
};

export const chatMutations = {
  create: (lizardId: string) =>
    mutationOptions({
      mutationFn: (payload: ChatCreate) => chatApi.createChat(lizardId, payload),
    }),

  delete: () =>
    mutationOptions({
      mutationFn: (chatId: string) => chatApi.deleteChat(chatId),
    }),
};
```

### 5.4 Message API + Query Factory

```typescript
// src/entities/message/api/messageApi.ts
import { apiClient } from '@/shared/api/client';
import type { Message } from '../model/types';

interface MessageListResponse {
  data: Message[];
  meta: {
    has_more: boolean;
    next_cursor: string | null;
  };
}

export const messageApi = {
  getMessages: async (
    chatId: string,
    params?: { limit?: number; before?: string }
  ): Promise<MessageListResponse> => {
    const { data } = await apiClient.get<MessageListResponse>(
      `/chats/${chatId}/messages`,
      { params }
    );
    return data;
  },
};
```

```typescript
// src/entities/message/api/messageQueries.ts
import { infiniteQueryOptions } from '@tanstack/react-query';
import { messageApi } from './messageApi';

export const messageKeys = {
  all: ['messages'] as const,
  list: (chatId: string) => [...messageKeys.all, 'list', chatId] as const,
};

export const messageQueries = {
  list: (chatId: string) =>
    infiniteQueryOptions({
      queryKey: messageKeys.list(chatId),
      queryFn: ({ pageParam }) =>
        messageApi.getMessages(chatId, {
          before: pageParam,
          limit: 30,
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.meta.has_more ? lastPage.meta.next_cursor : undefined,
      enabled: !!chatId,
    }),
};
```

---

## 6. SSE 스트리밍

### 6.1 useSSE Hook (개선된 버전)

재시도 로직, 마운트 해제 안전 처리, 에러 상태를 포함한 개선된 SSE 훅입니다.

```typescript
// src/features/send-message/api/useSSE.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import EventSource from 'react-native-sse';
import { CONFIG } from '@/shared/config/env';
import { supabase } from '@/shared/lib/supabase';

interface SSEMessage {
  text: string;
  done: boolean;
  message_id?: string;
}

interface UseSSEOptions {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string, messageId: string) => void;
  onError?: (error: Error) => void;
  maxRetries?: number;
  retryDelay?: number;
}

interface UseSSEReturn {
  sendMessage: (content: string) => Promise<void>;
  cancelStream: () => void;
  isStreaming: boolean;
  streamingText: string;
  error: Error | null;
}

export function useSSE(chatId: string, options: UseSSEOptions = {}): UseSSEReturn {
  const {
    onChunk,
    onComplete,
    onError,
    maxRetries = 3,
    retryDelay = 1000,
  } = options;

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const fullTextRef = useRef('');
  const retryCountRef = useRef(0);
  const isMountedRef = useRef(true);

  // 마운트 해제 시 cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      eventSourceRef.current?.close();
    };
  }, []);

  const cleanup = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    if (isMountedRef.current) {
      setIsStreaming(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      const err = new Error('인증이 필요해요.');
      setError(err);
      onError?.(err);
      return;
    }

    // 상태 초기화
    setIsStreaming(true);
    setStreamingText('');
    setError(null);
    fullTextRef.current = '';
    retryCountRef.current = 0;

    const connect = () => {
      const es = new EventSource(
        `${CONFIG.API_URL}/v1/chats/${chatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ content }),
          pollingInterval: 0, // 자동 재연결 비활성화
        }
      );

      eventSourceRef.current = es;

      es.addEventListener('message', (event: any) => {
        if (!isMountedRef.current) return;

        try {
          const data: SSEMessage = JSON.parse(event.data);

          if (data.done) {
            cleanup();
            onComplete?.(fullTextRef.current, data.message_id || '');
            return;
          }

          fullTextRef.current += data.text;
          setStreamingText(fullTextRef.current);
          onChunk?.(data.text);
        } catch (parseError) {
          console.error('SSE parse error:', parseError);
        }
      });

      es.addEventListener('error', () => {
        if (!isMountedRef.current) return;

        // Exponential backoff 재시도
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          const delay = retryDelay * Math.pow(2, retryCountRef.current - 1);

          setTimeout(() => {
            if (isMountedRef.current) {
              connect();
            }
          }, delay);
          return;
        }

        const err = new Error('연결이 끊어졌어요. 다시 시도해주세요.');
        setError(err);
        cleanup();
        onError?.(err);
      });
    };

    connect();
  }, [chatId, onChunk, onComplete, onError, maxRetries, retryDelay, cleanup]);

  const cancelStream = useCallback(() => {
    cleanup();
    fullTextRef.current = '';
    setStreamingText('');
  }, [cleanup]);

  return {
    sendMessage,
    cancelStream,
    isStreaming,
    streamingText,
    error,
  };
}
```

### 6.2 채팅 화면에서 사용

```typescript
// app/(main)/chat/[chatId].tsx
import { useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useSSE } from '@/features/send-message';
import { useMessages } from '@/entities/message';
import { ChatInput } from '@/features/send-message';
import { MessageList } from '@/entities/message';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { messages, addOptimisticMessage, refetch } = useMessages(chatId);

  const { sendMessage, isStreaming, streamingText } = useSSE(chatId, {
    onComplete: () => {
      refetch();
    },
    onError: (error) => {
      Alert.alert('오류', error.message);
    },
  });

  const handleSend = async (content: string) => {
    addOptimisticMessage({
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      role: 'user',
      content,
      is_deleted: false,
      created_at: new Date().toISOString(),
    });

    await sendMessage(content);
  };

  return (
    <View className="flex-1">
      <MessageList
        messages={messages}
        streamingText={isStreaming ? streamingText : undefined}
      />
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </View>
  );
}
```

---

## 7. TanStack Query 설정

### 7.1 Query Client 설정

```typescript
// src/shared/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30,   // 30분
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 7.2 Query Provider (with ErrorBoundary)

```typescript
// src/app/providers/QueryProvider.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import { QueryErrorBoundary } from '@/shared/ui';

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorBoundary>
        {children}
      </QueryErrorBoundary>
    </QueryClientProvider>
  );
}
```

### 7.3 useLizard Hook (queryOptions 사용)

```typescript
// src/entities/lizard/model/useLizard.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lizardQueries, lizardMutations, lizardKeys } from '../api/lizardQueries';
import type { LizardUpdate } from './types';

export function useLizard() {
  const queryClient = useQueryClient();

  const query = useQuery(lizardQueries.me());

  const createMutation = useMutation({
    ...lizardMutations.create(),
    onSuccess: (data) => {
      queryClient.setQueryData(lizardKeys.me(), data);
    },
  });

  const updateMutation = useMutation({
    ...lizardMutations.update(),
    onSuccess: (data) => {
      queryClient.setQueryData(lizardKeys.me(), data);
    },
  });

  const deleteMutation = useMutation({
    ...lizardMutations.delete(),
    onSuccess: () => {
      queryClient.setQueryData(lizardKeys.me(), null);
    },
  });

  return {
    lizard: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createLizard: createMutation.mutateAsync,
    updateLizard: (id: string, data: LizardUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    deleteLizard: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
```

### 7.4 useChats Hook (queryOptions 사용)

```typescript
// src/entities/chat/model/useChats.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatQueries, chatMutations, chatKeys } from '../api/chatQueries';
import { useLizard } from '@/entities/lizard';

export function useChats() {
  const queryClient = useQueryClient();
  const { lizard } = useLizard();

  const query = useQuery({
    ...chatQueries.list(lizard?.id ?? ''),
    enabled: !!lizard?.id,
  });

  const createMutation = useMutation({
    ...(lizard?.id ? chatMutations.create(lizard.id) : { mutationFn: async () => { throw new Error('No lizard'); } }),
    onSuccess: () => {
      if (lizard?.id) {
        queryClient.invalidateQueries({ queryKey: chatKeys.list(lizard.id) });
      }
    },
  });

  const deleteMutation = useMutation({
    ...chatMutations.delete(),
    onSuccess: () => {
      if (lizard?.id) {
        queryClient.invalidateQueries({ queryKey: chatKeys.list(lizard.id) });
      }
    },
  });

  return {
    chats: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createChat: createMutation.mutateAsync,
    deleteChat: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    canCreateChat: (query.data?.length ?? 0) < 5,
  };
}
```

### 7.5 useMessages Hook (infiniteQuery 사용)

```typescript
// src/entities/message/model/useMessages.ts
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { messageQueries, messageKeys } from '../api/messageQueries';
import type { Message } from './types';

export function useMessages(chatId: string) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery(messageQueries.list(chatId));

  // 페이지네이션된 데이터를 flat하게 변환
  const messages = query.data?.pages.flatMap((page) => page.data) ?? [];

  // 낙관적 업데이트용 메시지 추가
  const addOptimisticMessage = (message: Message) => {
    queryClient.setQueryData(
      messageKeys.list(chatId),
      (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, index: number) =>
            index === old.pages.length - 1
              ? { ...page, data: [...page.data, message] }
              : page
          ),
        };
      }
    );
  };

  return {
    messages,
    isLoading: query.isLoading,
    error: query.error,
    hasMore: query.hasNextPage,
    fetchMore: query.fetchNextPage,
    isFetchingMore: query.isFetchingNextPage,
    refetch: query.refetch,
    addOptimisticMessage,
  };
}
```

---

## 8. 이미지 처리

### 8.1 이미지 유틸리티

```typescript
// src/shared/lib/image.ts
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 800;

interface ProcessedImage {
  uri: string;
  type: string;
  size: number;
}

// 이미지 선택
export async function pickImage(): Promise<ProcessedImage | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return processImage(result.assets[0].uri);
}

// 카메라 촬영
export async function takePhoto(): Promise<ProcessedImage | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('카메라 권한이 필요해요.');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return processImage(result.assets[0].uri);
}

// 이미지 처리 (리사이징, HEIC→JPEG 변환)
async function processImage(uri: string): Promise<ProcessedImage> {
  // HEIC → JPEG 변환 및 리사이징
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_WIDTH } }],
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  // 파일 크기 확인
  const fileInfo = await FileSystem.getInfoAsync(manipulated.uri);
  
  if (fileInfo.exists && fileInfo.size > MAX_SIZE) {
    throw new Error('이미지 크기가 너무 커요. 5MB 이하로 줄여주세요.');
  }

  return {
    uri: manipulated.uri,
    type: 'image/jpeg',
    size: fileInfo.exists ? fileInfo.size : 0,
  };
}
```

### 8.2 이미지 업로드 Hook

```typescript
// src/features/upload-image/model/useImageUpload.ts
import { useState } from 'react';
import { lizardApi } from '@/entities/lizard';
import { pickImage, takePhoto } from '@/shared/lib/image';

export function useImageUpload(lizardId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (source: 'library' | 'camera') => {
    try {
      setIsUploading(true);
      setProgress(0);

      // 1. 이미지 선택/촬영 및 처리
      const image = source === 'library' ? await pickImage() : await takePhoto();
      
      if (!image) {
        return null;
      }

      setProgress(0.3);

      // 2. Presigned URL 발급
      const { upload_url, image_url } = await lizardApi.getImageUploadUrl(
        lizardId,
        image.type
      );

      setProgress(0.5);

      // 3. S3에 업로드
      const response = await fetch(image.uri);
      const blob = await response.blob();

      await fetch(upload_url, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': image.type,
        },
      });

      setProgress(0.8);

      // 4. DB 업데이트
      await lizardApi.updateImageUrl(lizardId, image_url);

      setProgress(1);

      return image_url;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadImage,
    isUploading,
    progress,
  };
}
```

---

## 9. 화면 구현

### 9.1 Root Layout (ErrorBoundary + Suspense)

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '@/features/auth';
import { QueryProvider } from '@/app/providers';
import { Loading, SuspenseView } from '@/shared/ui';

import '../global.css'; // NativeWind

export default function RootLayout() {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <QueryProvider>
      <SuspenseView>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
      </SuspenseView>
    </QueryProvider>
  );
}
```

### 9.2 온보딩 (도마뱀 등록)

```typescript
// app/(auth)/onboarding.tsx
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LizardForm, lizardFormSchema, type LizardFormData } from '@/features/register-lizard';
import { useLizard } from '@/entities/lizard';
import { Button, Input, Select } from '@/shared/ui';
import { SPECIES_OPTIONS, PERSONALITY_OPTIONS } from '@/shared/constants';

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(20, '20자 이내로 입력해주세요'),
  species: z.string().min(1, '종류를 선택해주세요'),
  birth_date: z.string().regex(/^\d{4}-\d{2}$/, 'YYYY-MM 형식으로 입력해주세요'),
  gender: z.string().optional(),
  personality: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingScreen() {
  const router = useRouter();
  const { createLizard, isCreating } = useLizard();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      species: '',
      birth_date: '',
      gender: undefined,
      personality: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createLizard(data);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('오류', error.message || '도마뱀 등록에 실패했어요.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-12">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          도마뱀을 소개해주세요 🦎
        </Text>
        <Text className="text-base text-gray-500 mb-8">
          등록한 정보로 도마뱀이 말을 걸어요
        </Text>

        {/* 이름 */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="이름"
              placeholder="망고"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              required
            />
          )}
        />

        {/* 종류 */}
        <Controller
          control={control}
          name="species"
          render={({ field: { onChange, value } }) => (
            <Select
              label="종류"
              placeholder="종류를 선택해주세요"
              options={SPECIES_OPTIONS}
              value={value}
              onChange={onChange}
              error={errors.species?.message}
              required
            />
          )}
        />

        {/* 출생년월 */}
        <Controller
          control={control}
          name="birth_date"
          render={({ field: { onChange, value } }) => (
            <Input
              label="출생년월"
              placeholder="2024-06"
              value={value}
              onChangeText={onChange}
              error={errors.birth_date?.message}
              required
            />
          )}
        />

        {/* 성별 (선택) */}
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <Select
              label="성별"
              placeholder="선택 안 함"
              options={[
                { label: '수컷', value: 'male' },
                { label: '암컷', value: 'female' },
                { label: '모름', value: 'unknown' },
              ]}
              value={value}
              onChange={onChange}
            />
          )}
        />

        {/* 성격 (선택) */}
        <Controller
          control={control}
          name="personality"
          render={({ field: { onChange, value } }) => (
            <Select
              label="성격"
              placeholder="선택 안 함"
              options={PERSONALITY_OPTIONS}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isCreating}
          className="mt-8"
        >
          시작하기
        </Button>
      </View>
    </ScrollView>
  );
}
```

### 9.3 홈 (채팅 목록)

```typescript
// app/(main)/index.tsx
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useChats } from '@/hooks/useChats';
import { useLizard } from '@/hooks/useLizard';
import { ChatListItem } from '@/components/chat/ChatListItem';
import { LizardProfile } from '@/components/lizard/LizardProfile';
import { Button } from '@/components/ui';
import { formatRelativeTime } from '@/lib/date';

export default function HomeScreen() {
  const router = useRouter();
  const { lizard } = useLizard();
  const { chats, createChat, deleteChat, isCreating, canCreateChat } = useChats();

  const handleCreateChat = async () => {
    if (!canCreateChat) {
      Alert.alert(
        '채팅방 제한',
        '채팅방은 최대 5개까지 만들 수 있어요. 기존 채팅방을 삭제해주세요.'
      );
      return;
    }

    try {
      const chat = await createChat();
      router.push(`/chat/${chat.id}`);
    } catch (error: any) {
      Alert.alert('오류', error.message);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      '채팅방 삭제',
      '이 채팅방을 삭제할까요? 대화 내용은 복구할 수 없어요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteChat(chatId),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* 도마뱀 프로필 헤더 */}
      <LizardProfile lizard={lizard!} />

      {/* 채팅 목록 */}
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            대화 목록
          </Text>
          <Text className="text-sm text-gray-500">
            {chats.length}/5
          </Text>
        </View>

        {chats.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400 mb-4">
              아직 대화가 없어요
            </Text>
            <Button onPress={handleCreateChat} loading={isCreating}>
              첫 대화 시작하기
            </Button>
          </View>
        ) : (
          <>
            <FlatList
              data={chats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChatListItem
                  chat={item}
                  onPress={() => router.push(`/chat/${item.id}`)}
                  onDelete={() => handleDeleteChat(item.id)}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-2" />}
            />

            {/* 새 대화 버튼 */}
            <Button
              onPress={handleCreateChat}
              loading={isCreating}
              disabled={!canCreateChat}
              className="mt-4 mb-6"
            >
              새 대화 시작
            </Button>
          </>
        )}
      </View>
    </View>
  );
}
```

### 9.4 채팅 화면

```typescript
// app/(main)/chat/[chatId].tsx
import { useState, useRef, useEffect } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMessages } from '@/hooks/useMessages';
import { useLizard } from '@/hooks/useLizard';
import { useSSE } from '@/hooks/useSSE';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { Message } from '@/types/models';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { lizard } = useLizard();
  const { messages, addMessage, refetch } = useMessages(chatId);
  const flatListRef = useRef<FlatList>(null);

  const { sendMessage, isStreaming, streamingText } = useSSE(chatId, {
    onComplete: () => {
      refetch();
    },
    onError: (error) => {
      Alert.alert('오류', error.message);
    },
  });

  // 스트리밍 중인 메시지 포함한 전체 메시지 목록
  const allMessages: (Message | { isStreaming: true; content: string })[] = [
    ...messages,
    ...(isStreaming ? [{ isStreaming: true as const, content: streamingText }] : []),
  ];

  const handleSend = async (content: string) => {
    // 낙관적 업데이트
    addMessage({
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      role: 'user',
      content,
      is_deleted: false,
      created_at: new Date().toISOString(),
    });

    // 스크롤 to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    await sendMessage(content);
  };

  // 새 메시지 올 때 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length, streamingText]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* 메시지 목록 */}
      <FlatList
        ref={flatListRef}
        data={allMessages}
        keyExtractor={(item, index) =>
          'isStreaming' in item ? 'streaming' : item.id
        }
        renderItem={({ item }) => {
          if ('isStreaming' in item) {
            return (
              <ChatBubble
                role="assistant"
                content={item.content}
                lizardName={lizard?.name}
                isStreaming
              />
            );
          }
          return (
            <ChatBubble
              role={item.role}
              content={item.content}
              lizardName={lizard?.name}
              timestamp={item.created_at}
            />
          );
        }}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-400 text-center">
              {lizard?.name}와의 첫 대화에요.{'\n'}
              인사 먼저 시작해볼까요?
            </Text>
          </View>
        }
        ListFooterComponent={
          isStreaming && !streamingText ? <TypingIndicator /> : null
        }
      />

      {/* 입력창 */}
      <ChatInput
        onSend={handleSend}
        disabled={isStreaming}
        placeholder={`오늘 기분은 어때? 배고프진 않아?`}
      />
    </KeyboardAvoidingView>
  );
}
```

---

## 10. 컴포넌트 구현

### 10.1 ChatBubble

```typescript
// src/components/chat/ChatBubble.tsx
import { View, Text } from 'react-native';
import { formatTime } from '@/lib/date';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  lizardName?: string;
  timestamp?: string;
  isStreaming?: boolean;
}

export function ChatBubble({
  role,
  content,
  lizardName,
  timestamp,
  isStreaming,
}: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <View
      className={cn(
        'mb-3 max-w-[80%]',
        isUser ? 'self-end' : 'self-start'
      )}
    >
      {/* 도마뱀 이름 */}
      {!isUser && lizardName && (
        <Text className="text-xs text-gray-500 mb-1 ml-1">
          {lizardName}
        </Text>
      )}

      {/* 버블 */}
      <View
        className={cn(
          'px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-green-500 rounded-br-sm'
            : 'bg-gray-100 rounded-bl-sm'
        )}
      >
        <Text
          className={cn(
            'text-base leading-6',
            isUser ? 'text-white' : 'text-gray-900'
          )}
        >
          {content}
          {isStreaming && (
            <Text className="text-gray-400">▌</Text>
          )}
        </Text>
      </View>

      {/* 시간 */}
      {timestamp && (
        <Text
          className={cn(
            'text-xs text-gray-400 mt-1',
            isUser ? 'text-right mr-1' : 'ml-1'
          )}
        >
          {formatTime(timestamp)}
        </Text>
      )}
    </View>
  );
}
```

### 10.2 ChatInput

```typescript
// src/components/chat/ChatInput.tsx
import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText('');
  };

  return (
    <View className="flex-row items-end px-4 py-3 border-t border-gray-100 bg-white">
      <TextInput
        className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-base max-h-24"
        placeholder={placeholder || '메시지를 입력하세요'}
        placeholderTextColor="#9CA3AF"
        value={text}
        onChangeText={setText}
        multiline
        editable={!disabled}
      />
      
      <Pressable
        onPress={handleSend}
        disabled={disabled || !text.trim()}
        className={cn(
          'ml-2 w-10 h-10 rounded-full justify-center items-center',
          text.trim() && !disabled ? 'bg-green-500' : 'bg-gray-200'
        )}
      >
        <Ionicons
          name="send"
          size={20}
          color={text.trim() && !disabled ? '#fff' : '#9CA3AF'}
        />
      </Pressable>
    </View>
  );
}
```

### 10.3 TypingIndicator

```typescript
// src/components/chat/TypingIndicator.tsx
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function TypingIndicator() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ),
      -1
    );
    setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1
      );
    }, 150);
    setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1
      );
    }, 300);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2.value }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3.value }],
  }));

  return (
    <View className="flex-row items-center self-start bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm mb-3">
      <Animated.View
        style={animatedStyle1}
        className="w-2 h-2 bg-gray-400 rounded-full mr-1"
      />
      <Animated.View
        style={animatedStyle2}
        className="w-2 h-2 bg-gray-400 rounded-full mr-1"
      />
      <Animated.View
        style={animatedStyle3}
        className="w-2 h-2 bg-gray-400 rounded-full"
      />
    </View>
  );
}
```

---

## 11. 상수 정의

### 11.1 종류 옵션

```typescript
// src/constants/species.ts
export const SPECIES_OPTIONS = [
  { label: '크레스티드 게코', value: 'crested_gecko' },
  { label: '레오파드 게코', value: 'leopard_gecko' },
  { label: '비어디 드래곤', value: 'bearded_dragon' },
  { label: '블루텅 스킨크', value: 'blue_tongue_skink' },
  { label: '콘스네이크', value: 'corn_snake' },
  { label: '볼파이썬', value: 'ball_python' },
  { label: '종류를 모르겠어요', value: 'unknown' },
] as const;

export const SPECIES_MAP = Object.fromEntries(
  SPECIES_OPTIONS.map(({ value, label }) => [value, label])
);
```

### 11.2 성격 옵션

```typescript
// src/constants/personality.ts
export const PERSONALITY_OPTIONS = [
  { label: '소심함 😳', value: 'shy', description: '조심스럽고 겁이 많아요' },
  { label: '활발함 🎉', value: 'active', description: '에너지가 넘치고 호기심이 많아요' },
  { label: '도도함 😎', value: 'sassy', description: '쿨한 척 하지만 속은 따뜻해요' },
  { label: '느긋함 😴', value: 'chill', description: '여유롭고 평화로워요' },
] as const;

export const PERSONALITY_MAP = Object.fromEntries(
  PERSONALITY_OPTIONS.map(({ value, label }) => [value, label])
);
```

---

## 12. 타입 정의

```typescript
// src/types/models.ts
export interface User {
  id: string;
  email: string;
  name: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lizard {
  id: string;
  user_id: string;
  name: string;
  species: string;
  birth_date: string | null;
  gender: 'male' | 'female' | 'unknown' | null;
  personality: 'shy' | 'active' | 'sassy' | 'chill' | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LizardCreate {
  name: string;
  species: string;
  birth_date: string;
  gender?: string;
  personality?: string;
}

export interface LizardUpdate {
  name?: string;
  species?: string;
  birth_date?: string;
  gender?: string;
  personality?: string;
}

export interface Chat {
  id: string;
  lizard_id: string;
  title: string | null;
  message_count: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatCreate {
  title?: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  is_deleted: boolean;
  created_at: string;
}
```

---

## 13. 빌드 및 배포

### 13.1 EAS Build 설정

```json
// eas.json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "your-app-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      }
    }
  }
}
```

### 13.2 빌드 명령어

```bash
# 개발 빌드 (시뮬레이터)
eas build --profile development --platform ios

# 프리뷰 빌드 (테스트용)
eas build --profile preview --platform all

# 프로덕션 빌드
eas build --profile production --platform all

# 스토어 제출
eas submit --platform ios
eas submit --platform android
```

---

## 14. Error Handling

### 14.1 ErrorBoundary 컴포넌트

```typescript
// src/shared/ui/ErrorBoundary.tsx
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { View, Text, Pressable } from 'react-native';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <Text className="text-xl font-bold text-gray-900 mb-2">
        문제가 발생했어요
      </Text>
      <Text className="text-gray-500 text-center mb-6">
        {error.message || '일시적인 오류가 발생했어요. 다시 시도해주세요.'}
      </Text>
      <Pressable
        onPress={resetErrorBoundary}
        className="bg-primary-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold">다시 시도</Text>
      </Pressable>
    </View>
  );
}

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function QueryErrorBoundary({ children, fallback }: Props) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ReactErrorBoundary
      onReset={reset}
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

### 14.2 SuspenseView 컴포넌트

```typescript
// src/shared/ui/SuspenseView.tsx
import { Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { QueryErrorBoundary } from './ErrorBoundary';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export function SuspenseView({
  children,
  fallback,
  errorFallback,
}: Props) {
  const defaultFallback = (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#22c55e" />
    </View>
  );

  return (
    <QueryErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback ?? defaultFallback}>
        {children}
      </Suspense>
    </QueryErrorBoundary>
  );
}
```

---

## 15. TypeScript Best Practices

### 15.1 Branded Types (ID 타입 안전성)

```typescript
// src/shared/types/branded.ts
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

export type Branded<T, B> = T & Brand<B>;

export type UserId = Branded<string, 'UserId'>;
export type LizardId = Branded<string, 'LizardId'>;
export type ChatId = Branded<string, 'ChatId'>;
export type MessageId = Branded<string, 'MessageId'>;

// Helper functions
export const toUserId = (id: string): UserId => id as UserId;
export const toLizardId = (id: string): LizardId => id as LizardId;
export const toChatId = (id: string): ChatId => id as ChatId;
export const toMessageId = (id: string): MessageId => id as MessageId;
```

### 15.2 Discriminated Unions (Message 타입)

```typescript
// src/entities/message/model/types.ts
type MessageBase = {
  chat_id: string;
  content: string;
  created_at: string;
};

export type UserMessage = MessageBase & {
  role: 'user';
  id: string;
  is_deleted: boolean;
};

export type AssistantMessage = MessageBase & {
  role: 'assistant';
  id: string;
  is_deleted: boolean;
};

export type SystemMessage = MessageBase & {
  role: 'system';
  id: string;
};

export type StreamingMessage = {
  role: 'assistant';
  content: string;
  isStreaming: true;
};

export type Message = UserMessage | AssistantMessage | SystemMessage;
export type DisplayMessage = Message | StreamingMessage;

// Type guard
export function isStreamingMessage(msg: DisplayMessage): msg is StreamingMessage {
  return 'isStreaming' in msg && msg.isStreaming === true;
}
```

### 15.3 const assertions + satisfies

```typescript
// src/shared/constants/species.ts
export const SPECIES_OPTIONS = [
  { label: '크레스티드 게코', value: 'crested_gecko' },
  { label: '레오파드 게코', value: 'leopard_gecko' },
  { label: '비어디 드래곤', value: 'bearded_dragon' },
  { label: '블루텅 스킨크', value: 'blue_tongue_skink' },
  { label: '콘스네이크', value: 'corn_snake' },
  { label: '볼파이썬', value: 'ball_python' },
  { label: '종류를 모르겠어요', value: 'unknown' },
] as const satisfies readonly { label: string; value: string }[];

export type Species = typeof SPECIES_OPTIONS[number]['value'];

export const SPECIES_MAP = Object.fromEntries(
  SPECIES_OPTIONS.map(({ value, label }) => [value, label])
) as Record<Species, string>;
```

---

## 16. Offline Support

### 16.1 네트워크 상태 관리

```typescript
// src/shared/lib/offline.ts
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

export function setupOfflineSupport() {
  // TanStack Query에 네트워크 상태 연동
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });
}
```

### 16.2 네트워크 상태 훅

```typescript
// src/shared/lib/useNetworkStatus.ts
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
  }, []);

  return { isConnected };
}
```

### 16.3 오프라인 배너 컴포넌트

```typescript
// src/shared/ui/OfflineBanner.tsx
import { View, Text } from 'react-native';
import { useNetworkStatus } from '@/shared/lib/useNetworkStatus';

export function OfflineBanner() {
  const { isConnected } = useNetworkStatus();

  if (isConnected !== false) return null;

  return (
    <View className="bg-yellow-500 px-4 py-2">
      <Text className="text-center text-white text-sm font-medium">
        인터넷 연결이 끊어졌어요
      </Text>
    </View>
  );
}
```

---

## 17. 햅틱 피드백

```typescript
// src/shared/lib/haptics.ts
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const haptics = {
  light: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  medium: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  success: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
  error: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },
  selection: () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  },
};
```

---

## 부록 A: 화면 목록

| 경로 | 화면 | 설명 |
|------|------|------|
| `/(auth)/login` | 로그인 | Google OAuth |
| `/(auth)/onboarding` | 온보딩 | 도마뱀 등록 |
| `/(main)/` | 홈 | 채팅 목록 |
| `/(main)/chat/[chatId]` | 채팅 | 대화 화면 |
| `/(main)/settings/` | 설정 | 설정 메인 |
| `/(main)/settings/lizard` | 도마뱀 설정 | 프로필 수정 |
| `/(main)/settings/account` | 계정 설정 | 로그아웃, 탈퇴 |

---

## 부록 B: 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| v1.0 | 2025-01-09 | 최초 작성 | 명근 |
| v2.0 | 2025-01-10 | FSD 아키텍처 적용, Expo SDK 52+/RN 0.76+ 업데이트, queryOptions 패턴 적용, ErrorBoundary/Suspense 추가, 오프라인 지원 추가 | Claude |

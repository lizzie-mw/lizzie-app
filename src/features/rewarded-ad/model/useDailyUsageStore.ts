import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DAILY_FREE_MESSAGE_LIMIT,
  REWARD_AD_BONUS_MESSAGES,
  MAX_DAILY_AD_VIEWS,
} from '@/shared/constants';

interface DailyUsageState {
  /** 오늘 보낸 메시지 수 */
  messageCount: number;
  /** 광고 시청으로 획득한 보너스 메시지 수 */
  bonusMessages: number;
  /** 오늘 시청한 광고 횟수 */
  adViewCount: number;
  /** 마지막 사용 날짜 (YYYY-MM-DD) */
  lastDate: string;
}

interface DailyUsageActions {
  /** 메시지 전송 시 카운트 증가 */
  incrementMessageCount: () => void;
  /** 광고 시청 보상 적용 */
  addAdReward: () => void;
  /** 날짜 변경 시 리셋 (내부 호출) */
  _resetIfNewDay: () => void;
}

type DailyUsageStore = DailyUsageState & DailyUsageActions;

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

const initialState: DailyUsageState = {
  messageCount: 0,
  bonusMessages: 0,
  adViewCount: 0,
  lastDate: getTodayString(),
};

export const useDailyUsageStore = create<DailyUsageStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        _resetIfNewDay: () => {
          const today = getTodayString();
          if (get().lastDate !== today) {
            set((state) => {
              state.messageCount = 0;
              state.bonusMessages = 0;
              state.adViewCount = 0;
              state.lastDate = today;
            });
          }
        },

        incrementMessageCount: () => {
          get()._resetIfNewDay();
          set((state) => {
            state.messageCount += 1;
          });
        },

        addAdReward: () => {
          get()._resetIfNewDay();
          set((state) => {
            state.adViewCount += 1;
            state.bonusMessages += REWARD_AD_BONUS_MESSAGES;
          });
        },
      })),
      {
        name: 'daily-usage-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    ),
    { name: 'DailyUsageStore' }
  )
);

// 셀렉터
export const useRemainingMessages = () =>
  useDailyUsageStore((state) => {
    const today = getTodayString();
    if (state.lastDate !== today) {
      return DAILY_FREE_MESSAGE_LIMIT;
    }
    const limit = DAILY_FREE_MESSAGE_LIMIT + state.bonusMessages;
    return Math.max(0, limit - state.messageCount);
  });

export const useIsLimitReached = () =>
  useDailyUsageStore((state) => {
    const today = getTodayString();
    if (state.lastDate !== today) return false;
    const limit = DAILY_FREE_MESSAGE_LIMIT + state.bonusMessages;
    return state.messageCount >= limit;
  });

export const useCanWatchAd = () =>
  useDailyUsageStore((state) => {
    const today = getTodayString();
    if (state.lastDate !== today) return true;
    return state.adViewCount < MAX_DAILY_AD_VIEWS;
  });

export const useDailyAdViewCount = () =>
  useDailyUsageStore((state) => {
    const today = getTodayString();
    if (state.lastDate !== today) return 0;
    return state.adViewCount;
  });

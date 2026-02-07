import { useState, useCallback, useEffect, useRef } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { REWARDED_AD_UNIT_ID } from '../lib/adUnitIds';
import { useDailyUsageStore } from './useDailyUsageStore';

interface UseRewardedAdOptions {
  onRewardEarned?: () => void;
  onError?: (error: Error) => void;
}

export function useRewardedAd(options: UseRewardedAdOptions = {}) {
  const { onRewardEarned, onError } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const adRef = useRef<RewardedAd | null>(null);
  const addAdReward = useDailyUsageStore((state) => state.addAdReward);

  const loadAd = useCallback(() => {
    if (isLoading || isLoaded) return;

    setIsLoading(true);
    const ad = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID);
    adRef.current = ad;

    const unsubscribeLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setIsLoaded(true);
        setIsLoading(false);
      }
    );

    const unsubscribeEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        addAdReward();
        onRewardEarned?.();
      }
    );

    const unsubscribeClosed = ad.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsLoaded(false);
        // 다음 광고 미리 로드
        loadAd();
      }
    );

    const unsubscribeError = ad.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        setIsLoading(false);
        setIsLoaded(false);
        onError?.(new Error(error.message));
      }
    );

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [isLoading, isLoaded, addAdReward, onRewardEarned, onError]);

  useEffect(() => {
    const cleanup = loadAd();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAd = useCallback(async () => {
    if (!isLoaded || !adRef.current) return;
    await adRef.current.show();
  }, [isLoaded]);

  return {
    isLoaded,
    isLoading,
    showAd,
    loadAd,
  };
}

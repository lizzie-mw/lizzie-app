import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Icon } from '@/shared/ui';
import { REWARD_AD_BONUS_MESSAGES, MAX_DAILY_AD_VIEWS } from '@/shared/constants';
import { useCanWatchAd, useDailyAdViewCount } from '../model/useDailyUsageStore';
import { useRewardedAd } from '../model/useRewardedAd';

interface ChatLimitBannerProps {
  onRewardEarned?: () => void;
}

export function ChatLimitBanner({ onRewardEarned }: ChatLimitBannerProps) {
  const canWatchAd = useCanWatchAd();
  const adViewCount = useDailyAdViewCount();

  const { isLoaded, isLoading, showAd, loadAd } = useRewardedAd({
    onRewardEarned,
    onError: () => {
      // 광고 로드 실패 시 재시도
      setTimeout(loadAd, 3000);
    },
  });

  if (!canWatchAd) {
    return (
      <View className="mx-4 my-2 p-4 bg-earth-100 rounded-2xl items-center">
        <Icon name="time-outline" size="lg" color="#8b7355" />
        <Text className="text-base font-semibold text-earth-700 mt-2">
          오늘의 대화를 모두 사용했어요
        </Text>
        <Text className="text-sm text-earth-500 mt-1 text-center">
          내일 다시 대화할 수 있어요!
        </Text>
      </View>
    );
  }

  return (
    <View className="mx-4 my-2 p-4 bg-primary-50 rounded-2xl items-center">
      <Icon name="chatbubbles-outline" size="lg" color="#5cb82f" />
      <Text className="text-base font-semibold text-gray-900 mt-2">
        오늘의 무료 대화를 모두 사용했어요
      </Text>
      <Text className="text-sm text-gray-500 mt-1 text-center">
        광고를 시청하면 {REWARD_AD_BONUS_MESSAGES}개의 추가 대화를 할 수 있어요
      </Text>

      <Pressable
        className={`
          mt-3 px-6 py-3 rounded-xl flex-row items-center
          ${isLoaded ? 'bg-primary-500' : 'bg-gray-300'}
        `}
        onPress={showAd}
        disabled={!isLoaded}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <>
            <Icon name="play-circle-outline" size="sm" color="#ffffff" />
            <Text className="text-white font-semibold text-base ml-2">
              광고 보고 대화하기
            </Text>
          </>
        )}
      </Pressable>

      <Text className="text-xs text-gray-400 mt-2">
        오늘 {adViewCount}/{MAX_DAILY_AD_VIEWS}회 시청
      </Text>
    </View>
  );
}

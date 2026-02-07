import { View, Text } from 'react-native';
import { DAILY_FREE_MESSAGE_LIMIT } from '@/shared/constants';
import {
  useRemainingMessages,
  useDailyUsageStore,
} from '../model/useDailyUsageStore';

export function UsageCounter() {
  const remaining = useRemainingMessages();
  const bonusMessages = useDailyUsageStore((state) => state.bonusMessages);
  const total = DAILY_FREE_MESSAGE_LIMIT + bonusMessages;

  const isLow = remaining <= 5;
  const isEmpty = remaining === 0;

  return (
    <View
      className={`
        px-2.5 py-1 rounded-full
        ${isEmpty ? 'bg-red-100' : isLow ? 'bg-amber-100' : 'bg-primary-100'}
      `}
    >
      <Text
        className={`
          text-xs font-semibold
          ${isEmpty ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-primary-600'}
        `}
      >
        {remaining} / {total}
      </Text>
    </View>
  );
}

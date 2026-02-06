import { View, Text } from 'react-native';
import { formatDateSeparator } from '@/shared/lib';

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <View className="items-center my-4">
      <View className="bg-cream-200 px-3 py-1 rounded-full">
        <Text className="text-xs text-earth-500">{formatDateSeparator(date)}</Text>
      </View>
    </View>
  );
}

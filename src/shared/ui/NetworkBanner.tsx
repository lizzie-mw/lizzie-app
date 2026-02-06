import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { subscribeToNetworkState } from '@/shared/lib';
import { Icon } from './Icon';

export function NetworkBanner() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToNetworkState(setIsConnected);
    return unsubscribe;
  }, []);

  if (isConnected) return null;

  return (
    <View className="bg-red-500 flex-row items-center justify-center py-2 px-4">
      <Icon name="cloud-offline-outline" size="sm" color="#ffffff" />
      <Text className="text-white text-sm font-medium ml-2">
        인터넷 연결이 끊어졌어요
      </Text>
    </View>
  );
}

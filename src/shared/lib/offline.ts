import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

// TanStack Query와 연동
export function setupOnlineManager() {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });
}

// 네트워크 상태 구독
export function subscribeToNetworkState(
  callback: (isConnected: boolean) => void
) {
  return NetInfo.addEventListener((state: NetInfoState) => {
    callback(!!state.isConnected);
  });
}

// 현재 네트워크 상태 확인
export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return !!state.isConnected;
}

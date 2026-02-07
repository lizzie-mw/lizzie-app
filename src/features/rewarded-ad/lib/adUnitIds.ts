import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * 보상형 광고 Unit ID
 * 프로덕션 배포 시 실제 Ad Unit ID로 교체 필요
 */
export const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxxxxx/aaaaaaaaaa',
      android: 'ca-app-pub-xxxxxxxxxxxxxxxx/bbbbbbbbbb',
      default: TestIds.REWARDED,
    })!;

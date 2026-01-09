import { View, Text } from 'react-native';
import { SPECIES_OPTIONS, PERSONALITY_OPTIONS } from '@/shared/constants';
import type { Lizard } from '../model/types';

interface LizardInfoProps {
  lizard: Lizard;
}

export function LizardInfo({ lizard }: LizardInfoProps) {
  const speciesLabel = SPECIES_OPTIONS.find(
    (opt) => opt.value === lizard.species
  )?.label;

  const personalityLabel = lizard.personality
    ? PERSONALITY_OPTIONS.find((opt) => opt.value === lizard.personality)?.label
    : null;

  const ageText = lizard.age_months
    ? lizard.age_months >= 12
      ? `${Math.floor(lizard.age_months / 12)}살`
      : `${lizard.age_months}개월`
    : null;

  return (
    <View>
      <Text className="text-lg font-bold text-gray-900">{lizard.name}</Text>
      <View className="flex-row flex-wrap gap-1 mt-1">
        {speciesLabel && (
          <Text className="text-sm text-gray-500">{speciesLabel}</Text>
        )}
        {lizard.morph && (
          <Text className="text-sm text-gray-500">· {lizard.morph}</Text>
        )}
        {ageText && (
          <Text className="text-sm text-gray-500">· {ageText}</Text>
        )}
        {personalityLabel && (
          <Text className="text-sm text-gray-500">· {personalityLabel}</Text>
        )}
      </View>
    </View>
  );
}

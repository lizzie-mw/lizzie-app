import { View, Text } from 'react-native';
import { SPECIES_OPTIONS, PERSONALITY_OPTIONS } from '@/shared/constants';
import type { Lizard } from '../model/types';

interface LizardInfoProps {
  lizard: Lizard;
}

function getAgeText(birthDate: string | null | undefined): string | null {
  if (!birthDate) return null;
  
  const parts = birthDate.split('-');
  if (parts.length < 2) return null;
  
  const yearStr = parts[0];
  const monthStr = parts[1];
  
  if (!yearStr || !monthStr) return null;
  
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  
  if (isNaN(year) || isNaN(month)) return null;
  
  const now = new Date();
  const birth = new Date(year, month - 1);
  
  const diffMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  
  if (diffMonths < 0) return null;
  if (diffMonths >= 12) {
    const years = Math.floor(diffMonths / 12);
    return years + '살';
  }
  return diffMonths + '개월';
}

export function LizardInfo({ lizard }: LizardInfoProps) {
  const speciesLabel = SPECIES_OPTIONS.find(
    (opt) => opt.value === lizard.species
  )?.label;

  const personalityLabel = lizard.personality
    ? PERSONALITY_OPTIONS.find((opt) => opt.value === lizard.personality)?.label
    : null;

  const ageText = getAgeText(lizard.birth_date);

  return (
    <View>
      <Text className="text-lg font-bold text-gray-900">{lizard.name}</Text>
      <View className="flex-row flex-wrap gap-1 mt-1">
        {speciesLabel && (
          <Text className="text-sm text-gray-500">{speciesLabel}</Text>
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

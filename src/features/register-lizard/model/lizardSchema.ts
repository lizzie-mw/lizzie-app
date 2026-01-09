import { z } from 'zod';
import { SPECIES_OPTIONS, PERSONALITY_OPTIONS } from '@/shared/constants';

const speciesValues = SPECIES_OPTIONS.map((opt) => opt.value) as [string, ...string[]];
const personalityValues = PERSONALITY_OPTIONS.map((opt) => opt.value) as [string, ...string[]];

export const lizardSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(20, '이름은 20자 이하로 입력해주세요'),
  species: z.enum(speciesValues, {
    errorMap: () => ({ message: '종류를 선택해주세요' }),
  }),
  morph: z.string().max(50, '모프는 50자 이하로 입력해주세요').optional(),
  age_months: z
    .number()
    .int()
    .min(0, '올바른 나이를 입력해주세요')
    .max(600, '올바른 나이를 입력해주세요')
    .optional(),
  personality: z.enum(personalityValues).optional(),
});

export type LizardFormData = z.infer<typeof lizardSchema>;

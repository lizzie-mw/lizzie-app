import { z } from 'zod';
import { SPECIES_OPTIONS, PERSONALITY_OPTIONS } from '@/shared/constants';

const speciesValues = SPECIES_OPTIONS.map((opt) => opt.value) as [string, ...string[]];
const personalityValues = PERSONALITY_OPTIONS.map((opt) => opt.value) as [string, ...string[]];
const genderValues = ['male', 'female', 'unknown'] as const;

export const lizardSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(20, '이름은 20자 이하로 입력해주세요'),
  species: z.enum(speciesValues, {
    errorMap: () => ({ message: '종류를 선택해주세요' }),
  }),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}$/, '생년월을 YYYY-MM 형식으로 입력해주세요'),
  gender: z.enum(genderValues).optional().nullable(),
  personality: z.enum(personalityValues).optional().nullable(),
});

export type LizardFormData = z.infer<typeof lizardSchema>;

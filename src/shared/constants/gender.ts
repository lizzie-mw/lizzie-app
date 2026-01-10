export const GENDER_OPTIONS = [
  { label: '수컷', value: 'male' },
  { label: '암컷', value: 'female' },
  { label: '모름', value: 'unknown' },
] as const satisfies readonly { label: string; value: string }[];

export type Gender = (typeof GENDER_OPTIONS)[number]['value'];

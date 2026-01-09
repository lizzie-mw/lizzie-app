export const SPECIES_OPTIONS = [
  { label: '레오파드 게코', value: 'leopard_gecko' },
  { label: '크레스티드 게코', value: 'crested_gecko' },
  { label: '비어디드 드래곤', value: 'bearded_dragon' },
  { label: '블루텅 스킨크', value: 'blue_tongue_skink' },
  { label: '볼 파이톤', value: 'ball_python' },
  { label: '콘 스네이크', value: 'corn_snake' },
  { label: '그린 이구아나', value: 'green_iguana' },
  { label: '아홀로틀', value: 'axolotl' },
  { label: '기타', value: 'other' },
] as const satisfies readonly { label: string; value: string }[];

export type Species = (typeof SPECIES_OPTIONS)[number]['value'];

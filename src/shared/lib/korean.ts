/**
 * 한국어 조사 처리 유틸리티
 * 받침 유무에 따라 올바른 조사를 선택합니다.
 */
export function withParticle(
  name: string,
  vowelParticle: string,
  consonantParticle: string,
): string {
  if (!name) return vowelParticle;

  const lastChar = name.charCodeAt(name.length - 1);

  // 한글 음절 범위: 0xAC00 - 0xD7A3
  // 받침이 있으면 (charCode - 0xAC00) % 28 !== 0
  if (lastChar >= 0xac00 && lastChar <= 0xd7a3) {
    return (lastChar - 0xac00) % 28 !== 0
      ? consonantParticle
      : vowelParticle;
  }

  // 한글이 아닌 경우 기본값
  return vowelParticle;
}

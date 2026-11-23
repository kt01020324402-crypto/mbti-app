import type { MbtiTrait } from "@/data/questions";

// 사용자가 고른 성향 글자 목록을 받아 4글자 MBTI 유형 코드를 계산합니다.
export function calculateMbtiType(selectedTraits: MbtiTrait[]): string {
  // 각 성향 글자가 몇 번 선택되었는지 세어 둘 객체입니다.
  const counts: Record<MbtiTrait, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // 고른 답안들을 하나씩 돌며 해당 성향의 점수를 1씩 올립니다.
  for (const trait of selectedTraits) {
    counts[trait] += 1;
  }

  // 4가지 지표마다 더 많이 고른 쪽 글자를 선택해 이어 붙입니다.
  const ei = counts.E >= counts.I ? "E" : "I";
  const sn = counts.S >= counts.N ? "S" : "N";
  const tf = counts.T >= counts.F ? "T" : "F";
  const jp = counts.J >= counts.P ? "J" : "P";

  return `${ei}${sn}${tf}${jp}`;
}

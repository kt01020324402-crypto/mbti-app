import type { Metadata } from "next";
import type { ReactNode } from "react";

// 참여 통계 페이지(/stats)의 제목, 설명, Open Graph 미리보기를 설정합니다.
export const metadata: Metadata = {
  title: "참여 통계 | 몽글 MBTI",
  description: "지금까지 모인 몽글 MBTI 검사 결과와 가장 많은 성격 유형을 확인해 보세요.",
  openGraph: {
    title: "참여 통계 | 몽글 MBTI",
    description: "지금까지 모인 몽글 MBTI 검사 결과와 가장 많은 성격 유형을 확인해 보세요.",
  },
};

export default function StatsLayout({ children }: { children: ReactNode }) {
  return children;
}

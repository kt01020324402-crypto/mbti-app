import type { Metadata } from "next";
import type { ReactNode } from "react";

// 유형 도감 페이지(/types)의 제목, 설명, Open Graph 미리보기를 설정합니다.
export const metadata: Metadata = {
  title: "유형 도감 | 몽글 MBTI",
  description: "16가지 MBTI 성격 유형과 귀여운 3D 동물 캐릭터를 모두 구경해 보세요.",
  openGraph: {
    title: "유형 도감 | 몽글 MBTI",
    description: "16가지 MBTI 성격 유형과 귀여운 3D 동물 캐릭터를 모두 구경해 보세요.",
  },
};

export default function TypesLayout({ children }: { children: ReactNode }) {
  return children;
}

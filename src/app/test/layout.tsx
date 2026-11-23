import type { Metadata } from "next";
import type { ReactNode } from "react";

// 검사 페이지(/test)의 제목, 설명, Open Graph 미리보기를 설정합니다.
export const metadata: Metadata = {
  title: "성격 유형 검사 | 몽글 MBTI",
  description: "12개의 일상 질문에 답하고 나의 3D 동물 성격 유형을 알아보세요.",
  openGraph: {
    title: "성격 유형 검사 | 몽글 MBTI",
    description: "12개의 일상 질문에 답하고 나의 3D 동물 성격 유형을 알아보세요.",
  },
};

export default function TestLayout({ children }: { children: ReactNode }) {
  return children;
}

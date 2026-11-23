import type { Metadata } from "next";
import type { ReactNode } from "react";

// 마이페이지(/mypage)의 제목, 설명, Open Graph 미리보기를 설정합니다.
export const metadata: Metadata = {
  title: "마이페이지 | 몽글 MBTI",
  description: "내가 저장한 몽글 MBTI 검사 기록과 최근 3D 동물 캐릭터를 다시 확인해 보세요.",
  openGraph: {
    title: "마이페이지 | 몽글 MBTI",
    description: "내가 저장한 몽글 MBTI 검사 기록과 최근 3D 동물 캐릭터를 다시 확인해 보세요.",
  },
};

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

// 로그인 페이지(/login)의 제목, 설명, Open Graph 미리보기를 설정합니다.
export const metadata: Metadata = {
  title: "로그인 | 몽글 MBTI",
  description: "몽글 MBTI에 로그인하고 나의 성격 유형 검사 기록을 확인해 보세요.",
  openGraph: {
    title: "로그인 | 몽글 MBTI",
    description: "몽글 MBTI에 로그인하고 나의 성격 유형 검사 기록을 확인해 보세요.",
  },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}

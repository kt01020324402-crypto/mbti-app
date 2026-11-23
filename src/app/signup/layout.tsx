import type { Metadata } from "next";
import type { ReactNode } from "react";

// 회원가입 페이지(/signup)의 제목, 설명, Open Graph 미리보기를 설정합니다.
export const metadata: Metadata = {
  title: "회원가입 | 몽글 MBTI",
  description: "몽글 MBTI 회원이 되어 검사 결과를 저장하고 언제든 다시 확인해 보세요.",
  openGraph: {
    title: "회원가입 | 몽글 MBTI",
    description: "몽글 MBTI 회원이 되어 검사 결과를 저장하고 언제든 다시 확인해 보세요.",
  },
};

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children;
}

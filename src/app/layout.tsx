import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-kr";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import "./globals.css";

// 브라우저 탭 제목, 검색 엔진 설명, 링크 공유 미리보기(Open Graph)를 설정합니다.
export const metadata: Metadata = {
  title: "몽글 MBTI | 나의 3D 동물 성격 유형 찾기",
  description:
    "12개 질문에 답하고 16가지 성격 유형과 귀여운 3D 동물 캐릭터를 만나보세요.",
  openGraph: {
    title: "몽글 MBTI | 나의 3D 동물 성격 유형 찾기",
    description:
      "12개 질문에 답하고 16가지 성격 유형과 귀여운 3D 동물 캐릭터를 만나보세요.",
    siteName: "몽글 MBTI",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full font-sans">
        {/* 앱 전체에서 로그인 상태를 공유할 수 있도록 AuthProvider로 감쌉니다. */}
        <AuthProvider>
          {/* PC에서 열어도 휴대폰 화면(최대 너비 480px)처럼 보이도록 가운데 정렬합니다. */}
          <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-[#f3fcf8]/90 shadow-[0_12px_40px_rgba(45,155,120,0.12)] backdrop-blur-sm">
            {/* 모든 페이지 상단에 고정되는 공통 헤더 */}
            <Header />

            {/* 각 페이지의 실제 내용이 들어가는 본문 영역 */}
            <main className="flex flex-1 flex-col px-5 py-7">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

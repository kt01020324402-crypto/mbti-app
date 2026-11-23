"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

// 모든 페이지 상단에 공통으로 표시되는 헤더 컴포넌트입니다.
export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-emerald-100/80 bg-white/80 px-4 py-3.5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        {/* 왼쪽: 서비스 이름 (누르면 첫 화면으로 이동합니다) */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-base font-bold tracking-tight text-emerald-950 transition-opacity hover:opacity-80 sm:text-lg"
        >
          <span aria-hidden="true" className="text-lg sm:text-xl">
            ☁️
          </span>
          <span>몽글 MBTI</span>
        </Link>

        {/* 오른쪽: 메뉴 영역 (375px 휴대폰 화면에서도 넘치지 않게 배치합니다) */}
        <nav aria-label="주 메뉴" className="flex shrink-0 items-center gap-1.5">
          <Link
            href="/types"
            className="whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100 sm:text-sm"
          >
            유형 도감
          </Link>

          {/* 로그인 상태를 확인하는 짧은 순간에는 자리를 비워 두어 깜빡임을 막습니다 */}
          <div className="min-w-[60px] text-right">
            {!loading &&
              (user ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="whitespace-nowrap rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-emerald-50 sm:text-sm"
                >
                  로그아웃
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-block whitespace-nowrap rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-emerald-600 sm:text-sm"
                >
                  로그인
                </Link>
              ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

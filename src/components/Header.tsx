import Link from "next/link";

// 모든 페이지 상단에 공통으로 표시되는 헤더 컴포넌트입니다.
export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-emerald-100/80 bg-white/80 px-5 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 서비스 이름 (누르면 첫 화면으로 이동합니다) */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-emerald-950 transition-opacity hover:opacity-80"
        >
          <span aria-hidden="true" className="text-xl">
            ☁️
          </span>
          <span>몽글 MBTI</span>
        </Link>

        {/* 오른쪽: 메뉴 영역 (지금은 유형 도감만 배치합니다) */}
        <nav aria-label="주 메뉴">
          <Link
            href="/types"
            className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-medium text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100"
          >
            유형 도감
          </Link>
        </nav>
      </div>
    </header>
  );
}

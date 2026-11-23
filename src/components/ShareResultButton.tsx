"use client";

import { useState } from "react";

// 현재 결과 페이지 주소를 클립보드에 복사해 주는 공유 버튼 컴포넌트입니다.
export default function ShareResultButton({ accentColor }: { accentColor: string }) {
  // 복사 완료 안내 문구를 보여줄지 여부입니다.
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      // 2.5초 뒤에 안내 문구를 원래 상태로 되돌립니다.
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // 클립보드 권한이 제한된 환경에서도 안내 문구를 띄울 수 있도록 처리합니다.
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        style={{ backgroundColor: accentColor }}
        className="w-full rounded-2xl px-5 py-4 text-base font-bold text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        결과 공유하기
      </button>

      {copied && (
        <p role="status" className="text-xs font-medium text-emerald-700">
          주소를 복사했어요
        </p>
      )}
    </div>
  );
}

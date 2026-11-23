"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { MbtiTypeCode } from "@/data/types";
import { supabase } from "@/lib/supabase";

// 검사 결과를 Supabase의 test_results 테이블에 저장하는 버튼 컴포넌트입니다.
export default function SaveResultButton({
  mbtiType,
}: {
  mbtiType: MbtiTypeCode;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async () => {
    setErrorMsg("");

    // 로그인하지 않은 상태면 로그인 후 다시 이 결과 페이지로 돌아오도록 보냅니다.
    if (!user) {
      router.push(`/login?next=/result/${mbtiType}`);
      return;
    }

    if (isSaved || isSaving) return;

    setIsSaving(true);
    try {
      // user_id와 created_at은 DB 기본값(auth.uid(), now())으로 자동 저장되므로 mbti_type만 보냅니다.
      const { error } = await supabase
        .from("test_results")
        .insert({ mbti_type: mbtiType });

      if (error) {
        setErrorMsg("결과를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }

      setIsSaved(true);
    } catch {
      setErrorMsg("네트워크 문제로 저장에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving || isSaved}
        className={`w-full rounded-2xl px-5 py-4 text-base font-bold shadow-[0_10px_24px_rgba(16,185,129,0.25)] transition-all ${
          isSaved
            ? "cursor-default bg-emerald-100 text-emerald-800 shadow-none"
            : "bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        }`}
      >
        {isSaving ? "저장 중..." : isSaved ? "저장했어요" : "내 기록에 저장"}
      </button>

      {errorMsg && (
        <p role="alert" className="text-xs font-medium text-rose-600">
          {errorMsg}
        </p>
      )}
    </div>
  );
}

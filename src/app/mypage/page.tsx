"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import CharacterViewer from "@/components/three/CharacterViewer";
import { MBTI_TYPES, type MbtiTypeCode } from "@/data/types";
import { supabase } from "@/lib/supabase";

// test_results 테이블에서 읽어 올 검사 기록 한 건의 타입입니다.
interface TestResultRow {
  id: number;
  mbti_type: MbtiTypeCode;
  created_at: string;
}

// 날짜 문자열을 "2026.11.17" 형식으로 바꿔 주는 함수입니다.
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

// 로그인한 회원의 검사 기록을 보여 주는 마이페이지(/mypage)입니다.
export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [results, setResults] = useState<TestResultRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    // 로그인 상태 확인이 끝났는데 회원이 아니면 로그인 페이지로 보냅니다.
    if (!authLoading && !user) {
      router.replace("/login?next=/mypage");
      return;
    }

    if (!authLoading && user) {
      // 내 검사 기록을 최신순(created_at 내림차순)으로 불러옵니다.
      const fetchResults = async () => {
        setIsLoadingData(true);
        setErrorMsg("");

        const { data, error } = await supabase
          .from("test_results")
          .select("id, mbti_type, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          setErrorMsg("기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        } else {
          setResults((data as TestResultRow[]) ?? []);
        }
        setIsLoadingData(false);
      };

      fetchResults();
    }
  }, [authLoading, user, router]);

  // 기록 한 건을 삭제하는 함수입니다.
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("이 검사 기록을 정말 삭제할까요?");
    if (!confirmed) return;

    setDeletingId(id);
    setErrorMsg("");

    const { error } = await supabase
      .from("test_results")
      .delete()
      .eq("id", id);

    if (error) {
      setErrorMsg("삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setDeletingId(null);
      return;
    }

    // 삭제에 성공하면 화면 목록에서도 바로 지웁니다.
    setResults((prev) => prev.filter((item) => item.id !== id));
    setDeletingId(null);
  };

  // 로그인 여부 확인 중이거나 비로그인 이동 중 또는 데이터 불러오는 중일 때 표시합니다.
  if (authLoading || !user || isLoadingData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full rounded-3xl border border-emerald-100 bg-white/95 px-6 py-12 text-center shadow-[0_10px_30px_rgba(45,175,130,0.1)]">
          <p className="text-sm font-medium text-emerald-700">불러오는 중...</p>
        </div>
      </div>
    );
  }

  const nickname =
    (user.user_metadata?.nickname as string | undefined)?.trim() || "회원";
  const latestResult = results[0];
  const latestInfo = latestResult ? MBTI_TYPES[latestResult.mbti_type] : null;

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* 맨 위: "닉네임 님의 기록" 과 가입 이메일 */}
      <section className="rounded-3xl border border-emerald-100 bg-white/95 px-6 py-6 shadow-[0_10px_30px_rgba(45,175,130,0.08)]">
        <h1 className="text-2xl font-bold text-emerald-950">
          {nickname} 님의 기록
        </h1>
        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
      </section>

      {errorMsg && (
        <p
          role="alert"
          className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
        >
          {errorMsg}
        </p>
      )}

      {results.length === 0 ? (
        /* 저장한 기록이 없을 때 보여줄 안내와 검사하러 가기 버튼 */
        <section className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white/95 px-6 py-12 text-center shadow-[0_10px_30px_rgba(45,175,130,0.08)]">
          <p className="text-lg font-bold text-slate-800">
            아직 저장한 결과가 없어요
          </p>
          <p className="mt-2 text-sm text-slate-500">
            검사를 마친 뒤 내 기록에 저장하면 이곳에서 다시 볼 수 있어요.
          </p>
          <Link
            href="/test"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-7 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)] transition-transform hover:-translate-y-0.5"
          >
            검사하러 가기
          </Link>
        </section>
      ) : (
        <>
          {/* 가장 최근에 저장한 유형의 3D 캐릭터 */}
          {latestInfo && (
            <section
              aria-label="최근 저장한 캐릭터"
              style={{
                background: `linear-gradient(180deg, ${latestInfo.color}66 0%, #ffffff 100%)`,
              }}
              className="flex flex-col items-center rounded-3xl border border-white/80 px-4 pb-5 pt-2 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            >
              <span className="mt-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm">
                가장 최근 결과 · {latestInfo.code}
              </span>
              <CharacterViewer
                typeCode={latestInfo.code}
                heightClass="h-[240px]"
              />
              <p className="text-base font-bold text-slate-900">
                {latestInfo.character.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                {latestInfo.nickname}
              </p>
            </section>
          )}

          {/* 내 검사 기록 목록 (최신순) */}
          <section aria-label="검사 기록 목록" className="flex flex-col gap-3">
            <h2 className="px-1 text-sm font-bold text-emerald-900">
              저장한 기록 ({results.length})
            </h2>

            <ul className="flex flex-col gap-2.5">
              {results.map((item) => {
                const info = MBTI_TYPES[item.mbti_type];
                const isDeleting = deletingId === item.id;

                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.04)]"
                  >
                    {/* 날짜, 유형 코드, 별명 (누르면 결과 페이지로 이동) */}
                    <Link
                      href={`/result/${item.mbti_type}`}
                      className="flex min-w-0 flex-1 items-center gap-2.5"
                    >
                      <span className="shrink-0 text-xs text-slate-400">
                        {formatDate(item.created_at)}
                      </span>
                      <span
                        style={{ backgroundColor: info?.color ?? "#E2F7EE" }}
                        className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider text-slate-900"
                      >
                        {item.mbti_type}
                      </span>
                      <span className="truncate text-sm font-medium text-slate-700">
                        {info?.nickname ?? item.mbti_type}
                      </span>
                    </Link>

                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      className="shrink-0 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                    >
                      {isDeleting ? "삭제 중" : "삭제"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

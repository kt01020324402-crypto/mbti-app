"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CharacterViewer from "@/components/three/CharacterViewer";
import { MBTI_TYPES, type MbtiTypeCode } from "@/data/types";
import { supabase } from "@/lib/supabase";

// DB 함수 get_type_stats()가 돌려주는 한 줄의 형태입니다.
interface TypeStatRow {
  mbti_type: string;
  count: number;
}

// 16가지 유형 전체 목록입니다.
const ALL_TYPE_CODES = Object.keys(MBTI_TYPES) as MbtiTypeCode[];

// 모든 회원의 검사 결과를 모아 유형별 통계를 보여 주는 페이지(/stats)입니다.
export default function StatsPage() {
  const [countsMap, setCountsMap] = useState<Record<MbtiTypeCode, number> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setErrorMsg("");

      // 보안 함수 get_type_stats()를 호출해 유형별 개수만 받아옵니다.
      const { data, error } = await supabase.rpc("get_type_stats");

      if (error) {
        setErrorMsg("통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        setIsLoading(false);
        return;
      }

      // 16개 유형을 모두 0으로 초기화한 뒤, DB에서 받은 개수를 채워 넣습니다.
      const initialMap = ALL_TYPE_CODES.reduce(
        (acc, code) => {
          acc[code] = 0;
          return acc;
        },
        {} as Record<MbtiTypeCode, number>
      );

      for (const row of (data as TypeStatRow[]) ?? []) {
        const code = row.mbti_type.toUpperCase() as MbtiTypeCode;
        if (code in initialMap) {
          initialMap[code] = Number(row.count) || 0;
        }
      }

      setCountsMap(initialMap);
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full rounded-3xl border border-emerald-100 bg-white/95 px-6 py-12 text-center shadow-[0_10px_30px_rgba(45,175,130,0.1)]">
          <p className="text-sm font-medium text-emerald-700">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !countsMap) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="w-full rounded-3xl border border-rose-100 bg-white/95 px-6 py-10 shadow-sm">
          <p className="text-sm font-medium text-rose-600">
            {errorMsg || "통계를 불러오지 못했어요."}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-medium text-emerald-800 shadow-sm hover:bg-emerald-50"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // 전체 저장된 결과 수 계산
  const totalCount = ALL_TYPE_CODES.reduce(
    (sum, code) => sum + countsMap[code],
    0
  );

  // 저장된 결과가 하나도 없을 때의 안내 화면
  if (totalCount === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <section className="w-full rounded-3xl border border-emerald-100 bg-white/95 px-6 py-12 text-center shadow-[0_10px_30px_rgba(45,175,130,0.1)]">
          <h1 className="text-xl font-bold text-emerald-950">
            아직 모인 결과가 없어요
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            첫 번째로 검사를 완료하고 결과를 저장해 보세요!
          </p>
          <Link
            href="/test"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-7 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)] transition-transform hover:-translate-y-0.5"
          >
            검사하러 가기
          </Link>
        </section>
      </div>
    );
  }

  // 16개 유형을 개수가 많은 순서로 정렬합니다.
  const sortedStats = [...ALL_TYPE_CODES]
    .map((code) => ({
      code,
      count: countsMap[code],
      percent: Math.round((countsMap[code] / totalCount) * 1000) / 10,
      info: MBTI_TYPES[code],
    }))
    .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));

  const topType = sortedStats[0];
  const maxCount = Math.max(topType.count, 1);

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* 맨 위: 지금까지 저장된 전체 결과 수 */}
      <section className="rounded-3xl border border-emerald-100 bg-white/95 px-6 py-5 text-center shadow-[0_10px_30px_rgba(45,175,130,0.08)]">
        <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          몽글 MBTI 통계
        </span>
        <h1 className="mt-2.5 text-xl font-bold text-emerald-950">
          지금까지 {totalCount.toLocaleString()}개의 결과가 모였어요
        </h1>
      </section>

      {/* 가장 많은 유형의 3D 캐릭터와 별명 */}
      <section
        aria-label="가장 많은 유형"
        style={{
          background: `linear-gradient(180deg, ${topType.info.color}66 0%, #ffffff 100%)`,
        }}
        className="flex flex-col items-center rounded-3xl border border-white/80 px-4 pb-6 pt-3 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
      >
        <span className="rounded-full bg-white/90 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-sm">
          👑 가장 많은 유형 · {topType.code} ({topType.percent}%)
        </span>
        <CharacterViewer typeCode={topType.code} heightClass="h-[240px]" />
        <p className="text-lg font-bold text-slate-900">
          {topType.info.nickname}
        </p>
        <p className="mt-0.5 text-xs text-slate-600">
          {topType.info.character.name}
        </p>
      </section>

      {/* 16개 유형 전체 가로 막대 그래프 (그래프 라이브러리 없이 구현) */}
      <section
        aria-label="16가지 유형별 분포"
        className="rounded-3xl border border-emerald-100 bg-white/95 p-5 shadow-[0_10px_30px_rgba(45,175,130,0.08)]"
      >
        <h2 className="text-base font-bold text-emerald-950">
          전체 유형 순위 (16가지)
        </h2>

        <ul className="mt-4 flex flex-col gap-3">
          {sortedStats.map((item) => {
            // 가장 많은 유형 대비 막대 너비 비율
            const barWidthPercent =
              item.count === 0 ? 0 : Math.max((item.count / maxCount) * 100, 4);

            return (
              <li key={item.code}>
                <Link
                  href={`/result/${item.code}`}
                  className="flex flex-col gap-1.5 rounded-xl p-1.5 transition-colors hover:bg-emerald-50/50"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold tracking-wider text-slate-900">
                        {item.code}
                      </span>
                      <span className="text-slate-500">
                        {item.info.character.animal}
                      </span>
                    </div>
                    <span className="font-medium text-slate-700">
                      {item.count}명 ({item.percent}%)
                    </span>
                  </div>

                  <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barWidthPercent}%`,
                        backgroundColor: item.info.color,
                      }}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

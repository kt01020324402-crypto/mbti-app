import { Suspense } from "react";
import Link from "next/link";

// URL 경로의 [type] 값을 읽어 화면에 보여주는 내부 컴포넌트입니다.
async function ResultContent({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const mbtiType = type.toUpperCase();

  return (
    <div className="w-full rounded-3xl border border-emerald-100 bg-white/95 px-6 py-12 shadow-[0_10px_30px_rgba(45,175,130,0.12)]">
      <p className="text-sm font-medium text-emerald-700">
        나의 몽글 MBTI 결과 (임시 화면)
      </p>
      <h1 className="mt-4 text-5xl font-bold tracking-widest text-emerald-950">
        {mbtiType}
      </h1>
    </div>
  );
}

// 결과 페이지(/result/[type])는 다음 단계에서 완성할 예정이므로,
// 지금은 계산된 유형 코드만 크게 보여주는 임시 화면으로 둡니다.
export default function ResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <Suspense
        fallback={
          <div className="w-full rounded-3xl border border-emerald-100 bg-white/95 px-6 py-12 shadow-[0_10px_30px_rgba(45,175,130,0.12)]">
            <p className="text-sm font-medium text-emerald-700">
              결과를 불러오는 중입니다...
            </p>
          </div>
        }
      >
        <ResultContent params={params} />
      </Suspense>

      <Link
        href="/"
        className="rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-medium text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50"
      >
        첫 화면으로 돌아가기
      </Link>
    </div>
  );
}

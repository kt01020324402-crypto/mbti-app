import { Suspense } from "react";
import Link from "next/link";
import { MBTI_TYPES, type MbtiTypeCode } from "@/data/types";
import ShareResultButton from "@/components/ShareResultButton";
import CharacterViewer from "@/components/three/CharacterViewer";

// 들어온 문자열이 16가지 MBTI 유형 코드 중 하나인지 확인하는 도우미 함수입니다.
function isValidMbtiType(value: string): value is MbtiTypeCode {
  return value in MBTI_TYPES;
}

// URL의 [type] 값을 읽어 결과 화면을 그려 주는 내부 컴포넌트입니다.
async function ResultContent({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  // 소문자로 들어와도 대문자로 통일해 16가지 데이터에서 찾습니다.
  const normalizedCode = type.toUpperCase();

  // 16가지에 없는 코드면 안내 문구와 홈 버튼을 보여줍니다.
  if (!isValidMbtiType(normalizedCode)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="w-full rounded-3xl border border-emerald-100 bg-white/95 px-6 py-12 shadow-[0_10px_30px_rgba(45,175,130,0.12)]">
          <p className="text-2xl font-bold text-slate-800">없는 유형이에요</p>
          <p className="mt-2 text-sm text-slate-500">
            주소를 다시 확인하거나 첫 화면에서 검사를 시작해 보세요.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-7 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)] transition-transform hover:-translate-y-0.5"
        >
          홈으로 가기
        </Link>
      </div>
    );
  }

  const info = MBTI_TYPES[normalizedCode];

  return (
    <div
      // 페이지 전체에 해당 유형의 대표 색상이 은은하게 감돌도록 배경 그라데이션을 줍니다.
      style={{
        background: `linear-gradient(180deg, ${info.color}55 0%, ${info.color}22 45%, #ffffff 100%)`,
      }}
      className="flex flex-1 flex-col gap-5 rounded-3xl p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
    >
      {/* 1) "당신의 유형은" 문구, 유형 코드(크게), 별명 */}
      <section className="pt-3 text-center">
        <p className="text-sm font-medium text-slate-600">당신의 유형은</p>
        <h1 className="mt-1 text-5xl font-bold tracking-widest text-slate-900">
          {info.code}
        </h1>
        <p className="mt-2 text-lg font-bold text-slate-800">{info.nickname}</p>
      </section>

      {/* 2) 캐릭터 자리: 해당 유형의 3D 동물 캐릭터와 캐릭터 이름 */}
      <section
        aria-label="캐릭터 영역"
        style={{ backgroundColor: `${info.color}88` }}
        className="flex flex-col items-center justify-center rounded-3xl px-4 pb-5 pt-2 text-center shadow-[0_10px_26px_rgba(15,23,42,0.08)]"
      >
        <CharacterViewer typeCode={info.code} heightClass="h-[300px]" />
        <p className="mt-1 text-lg font-bold text-slate-900">
          {info.character.name}
        </p>
      </section>

      {/* 3) 한 줄 소개와 성격 설명 */}
      <section className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
        <p className="text-base font-bold leading-snug text-slate-900">
          {info.summary}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {info.description}
        </p>
      </section>

      {/* 4) 강점 목록, 조심할 점 목록 */}
      <section className="flex flex-col gap-3">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <h2 className="text-base font-bold text-slate-900">✨ 나의 강점</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-slate-700">
            {info.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-0.5 text-emerald-500">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
          <h2 className="text-base font-bold text-slate-900">
            🌱 조심할 점
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-slate-700">
            {info.cautions.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-0.5 text-amber-500">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5) 잘 맞는 유형 2개: 누르면 해당 유형 결과 페이지로 이동 */}
      <section className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
        <h2 className="text-base font-bold text-slate-900">
          💞 잘 맞는 유형
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {info.compatibleTypes.map((compatCode) => {
            const compatInfo = MBTI_TYPES[compatCode];
            return (
              <Link
                key={compatCode}
                href={`/result/${compatCode}`}
                style={{ backgroundColor: `${compatInfo.color}66` }}
                className="flex flex-col items-center rounded-2xl border border-white/80 px-3 py-4 text-center shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <span className="text-lg font-bold tracking-wider text-slate-900">
                  {compatInfo.code}
                </span>
                <span className="mt-1 text-xs font-medium text-slate-600">
                  {compatInfo.character.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6) 버튼 2개: 다시 검사하기, 결과 공유하기 */}
      <section className="flex items-start gap-3 pt-1">
        <Link
          href="/test"
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-base font-bold text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:bg-slate-50"
        >
          다시 검사하기
        </Link>

        <ShareResultButton accentColor={info.color} />
      </section>
    </div>
  );
}

// MBTI 검사 결과를 보여 주는 페이지(/result/[type])입니다.
export default function ResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full rounded-3xl border border-emerald-100 bg-white/95 px-6 py-12 text-center shadow-[0_10px_30px_rgba(45,175,130,0.12)]">
            <p className="text-sm font-medium text-emerald-700">
              결과를 불러오는 중입니다...
            </p>
          </div>
        </div>
      }
    >
      <ResultContent params={params} />
    </Suspense>
  );
}

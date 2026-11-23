"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type MbtiTrait } from "@/data/questions";
import { calculateMbtiType } from "@/lib/mbti";

// 12개의 질문을 한 번에 하나씩 보여주는 검사 화면(/test)입니다.
export default function TestPage() {
  const router = useRouter();

  // 현재 몇 번째 질문을 보고 있는지 저장합니다. (0부터 시작)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 각 문항에서 사용자가 고른 성향 글자를 순서대로 저장합니다.
  const [answers, setAnswers] = useState<(MbtiTrait | null)[]>(() =>
    Array(QUESTIONS.length).fill(null)
  );

  const totalCount = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex + 1) / totalCount) * 100;

  // 선택지 버튼을 눌렀을 때 실행되는 함수입니다.
  const handleSelectOption = (trait: MbtiTrait) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = trait;
    setAnswers(nextAnswers);

    // 마지막(12번째) 질문이면 유형을 계산해 결과 페이지로 이동합니다.
    if (currentIndex === totalCount - 1) {
      const completedTraits = nextAnswers.filter(
        (item): item is MbtiTrait => item !== null
      );
      const mbtiType = calculateMbtiType(completedTraits);
      router.push(`/result/${mbtiType}`);
      return;
    }

    // 다음 질문으로 넘어갑니다.
    setCurrentIndex((prev) => prev + 1);
  };

  // 이전 버튼을 눌렀을 때 앞 질문으로 돌아가는 함수입니다.
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between gap-6">
      {/* 위쪽: 진행 숫자("3 / 12")와 진행 막대 */}
      <section aria-label="검사 진행 상황" className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-sm font-bold text-emerald-800">
          <span>질문 진행 중</span>
          <span>
            {currentIndex + 1} / {totalCount}
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-emerald-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* 가운데: 현재 질문 카드와 큼직한 선택지 2개 */}
      <section className="flex flex-1 flex-col justify-center gap-6">
        <div className="rounded-3xl border border-emerald-100 bg-white/95 px-6 py-8 shadow-[0_10px_30px_rgba(45,175,130,0.1)]">
          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Q{currentIndex + 1}
          </span>
          <h1 className="mt-4 text-xl font-bold leading-relaxed text-emerald-950">
            {currentQuestion.question}
          </h1>
        </div>

        {/* 선택지 2개 버튼 */}
        <div className="flex flex-col gap-3.5">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentIndex] === option.trait;

            return (
              <button
                key={option.trait}
                type="button"
                onClick={() => handleSelectOption(option.trait)}
                className={`w-full rounded-2xl border px-5 py-5 text-left text-base font-medium leading-relaxed shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/70 active:translate-y-0 ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200"
                    : "border-emerald-100 bg-white text-slate-700"
                }`}
              >
                {option.text}
              </button>
            );
          })}
        </div>
      </section>

      {/* 아래쪽: 이전 버튼 (첫 번째 질문에서는 숨깁니다) */}
      <div className="min-h-[48px] pb-2">
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50"
          >
            <span aria-hidden="true">←</span>
            <span>이전</span>
          </button>
        )}
      </div>
    </div>
  );
}

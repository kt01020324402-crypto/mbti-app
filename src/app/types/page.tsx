"use client";

import { useState } from "react";
import Link from "next/link";
import CharacterViewer from "@/components/three/CharacterViewer";
import { MBTI_TYPES, type MbtiTypeCode } from "@/data/types";

// 4줄 4칸(4×4)으로 보여줄 16가지 유형 코드 순서입니다.
const TYPE_CODES: MbtiTypeCode[] = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

// 헤더의 "유형 도감" 메뉴와 연결되는 페이지(/types)입니다.
// 위에는 선택한 유형의 3D 캐릭터 1개를 보여주고, 아래 4×4 버튼으로 캐릭터를 바꿀 수 있습니다.
export default function TypesPage() {
  const [selectedType, setSelectedType] = useState<MbtiTypeCode>("ISFJ");
  const info = MBTI_TYPES[selectedType];

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* 위쪽: 선택한 유형의 3D 캐릭터 (한 화면에 3D 캔버스 1개만 사용) */}
      <section
        aria-label="선택한 유형의 3D 캐릭터"
        style={{
          background: `linear-gradient(180deg, ${info.color}66 0%, #ffffff 100%)`,
        }}
        className="flex flex-col items-center rounded-3xl border border-white/80 px-4 pb-6 pt-3 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
      >
        <CharacterViewer typeCode={selectedType} heightClass="h-[340px]" />

        {/* 캐릭터 이름, 유형 코드, 별명, 한 줄 소개 */}
        <div className="mt-1 flex flex-col items-center gap-1.5 px-2">
          <span
            style={{ backgroundColor: info.color }}
            className="rounded-full px-3 py-0.5 text-xs font-bold tracking-wider text-slate-800"
          >
            {info.code}
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            {info.character.name}
          </h1>
          <p className="text-sm font-bold text-slate-700">{info.nickname}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {info.summary}
          </p>
        </div>

        {/* 자세히 보기 버튼: 선택한 유형의 결과 페이지로 이동합니다 */}
        <Link
          href={`/result/${info.code}`}
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,185,129,0.28)] transition-transform hover:-translate-y-0.5"
        >
          자세히 보기
        </Link>
      </section>

      {/* 맨 아래: 16개 유형 버튼 4줄 4칸(4×4) */}
      <section aria-label="16가지 유형 선택">
        <p className="mb-2.5 text-center text-xs font-medium text-slate-500">
          유형을 누르면 위의 3D 캐릭터가 바뀌어요 (캐릭터를 누르면 폴짝 뛰어요!)
        </p>
        <div className="grid grid-cols-4 gap-2">
          {TYPE_CODES.map((code) => {
            const isSelected = code === selectedType;
            const item = MBTI_TYPES[code];

            return (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedType(code)}
                style={
                  isSelected
                    ? { backgroundColor: item.color }
                    : undefined
                }
                className={`flex flex-col items-center rounded-2xl border py-2.5 text-center transition-all ${
                  isSelected
                    ? "border-slate-400 font-bold text-slate-900 shadow-sm ring-2 ring-emerald-200"
                    : "border-emerald-100 bg-white/90 font-medium text-slate-700 hover:bg-emerald-50/70"
                }`}
              >
                <span className="text-xs font-bold tracking-wide">{code}</span>
                <span className="mt-0.5 text-[11px] text-slate-500">
                  {item.character.animal}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

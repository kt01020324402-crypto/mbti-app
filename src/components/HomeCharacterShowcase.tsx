"use client";

import { useEffect, useState } from "react";
import CharacterViewer from "@/components/three/CharacterViewer";
import { MBTI_TYPES, type MbtiTypeCode } from "@/data/types";

// 첫 화면에서 3초마다 번갈아 보여줄 16가지 유형 순서입니다.
const SHOWCASE_TYPES: MbtiTypeCode[] = [
  "ENFP",
  "ISFJ",
  "INTJ",
  "ESFP",
  "INFP",
  "ESTJ",
  "ENTP",
  "ISTJ",
  "ENFJ",
  "ISFP",
  "INTP",
  "ESTP",
  "INFJ",
  "ESFJ",
  "ENTJ",
  "ISTP",
];

// 첫 화면 제목 아래에서 3초마다 다른 유형의 3D 캐릭터를 보여 주는 컴포넌트입니다.
export default function HomeCharacterShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 3초(3000ms)마다 다음 유형으로 순서를 넘깁니다.
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SHOWCASE_TYPES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const currentCode = SHOWCASE_TYPES[index];
  const currentInfo = MBTI_TYPES[currentCode];

  return (
    <div className="mt-4 flex w-full flex-col items-center">
      {/* 한 화면에 3D 캔버스 1개만 사용하며, 유형 코드만 바꿔 가며 그립니다 */}
      <CharacterViewer typeCode={currentCode} heightClass="h-[230px]" />

      <span
        style={{ backgroundColor: `${currentInfo.color}99` }}
        className="mt-1 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-slate-800 shadow-sm"
      >
        <span>{currentInfo.code}</span>
        <span aria-hidden="true">·</span>
        <span>{currentInfo.character.name}</span>
      </span>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import type { MbtiTypeCode } from "@/data/types";

// 3D 화면은 브라우저에서만 그려지도록 서버 렌더링(SSR)에서 제외합니다.
// 불러오는 동안에는 안내 문구를 보여줍니다.
const CharacterCanvas = dynamic(() => import("./CharacterCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-emerald-700">
      캐릭터 불러오는 중...
    </div>
  ),
});

// 선택한 유형의 3D 캐릭터를 보여 주는 뷰어 컴포넌트입니다.
export default function CharacterViewer({
  typeCode = "ISFJ",
  heightClass = "h-[300px]",
}: {
  typeCode?: MbtiTypeCode;
  heightClass?: string;
}) {
  return (
    <div
      className={`${heightClass} w-full cursor-grab touch-none active:cursor-grabbing`}
    >
      <CharacterCanvas typeCode={typeCode} />
    </div>
  );
}

import Link from "next/link";
import HomeCharacterShowcase from "@/components/HomeCharacterShowcase";

// 첫 화면에 보여줄 3가지 서비스 특징 카드 데이터입니다.
const FEATURE_CARDS = [
  {
    emoji: "⏱️",
    title: "12문항 · 2분",
    description: "부담 없이 빠르게 답해요",
    bgClass: "bg-white/90 border-emerald-100",
  },
  {
    emoji: "✨",
    title: "16가지 유형",
    description: "나의 성향을 꼼꼼히 분석해요",
    bgClass: "bg-white/90 border-teal-100",
  },
  {
    emoji: "🧸",
    title: "유형별 3D 캐릭터",
    description: "나를 닮은 몽글 친구를 만나요",
    bgClass: "bg-white/90 border-cyan-100",
  },
];

// 루트 경로(/)에서 보여줄 몽글 MBTI 첫 화면입니다.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-between gap-7">
      {/* 상단 인사말, 3D 캐릭터 쇼케이스, 검사 시작 버튼 영역 */}
      <section className="flex flex-col items-center rounded-3xl border border-emerald-100 bg-gradient-to-b from-[#dcf8ec] via-[#ecfcf5] to-white px-6 py-8 text-center shadow-[0_10px_30px_rgba(45,175,130,0.12)]">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-medium text-emerald-700 shadow-sm">
          <span aria-hidden="true">🐾</span>
          몽글몽글 성격 유형 테스트
        </span>

        <h1 className="text-3xl font-bold leading-snug tracking-tight text-emerald-950">
          나는 어떤 유형일까?
        </h1>

        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
          12개의 가벼운 질문에 답하고, 나와 꼭 닮은 3D 동물 캐릭터를 만나보세요.
        </p>

        {/* 제목 아래에서 3초마다 바뀌는 3D 동물 캐릭터 */}
        <HomeCharacterShowcase />

        {/* 검사 시작 버튼: 누르면 /test 페이지로 이동합니다 */}
        <Link
          href="/test"
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-8 py-5 text-lg font-bold text-white shadow-[0_12px_28px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(16,185,129,0.36)] active:translate-y-0"
        >
          <span>검사 시작하기</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* 특징 카드 3개 영역 */}
      <section aria-label="서비스 특징" className="flex flex-col gap-3">
        {FEATURE_CARDS.map((card) => (
          <div
            key={card.title}
            className={`flex items-center gap-4 rounded-2xl border p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)] ${card.bgClass}`}
          >
            <div
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl shadow-sm"
            >
              {card.emoji}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {card.title}
              </h2>
              <p className="mt-0.5 text-xs text-slate-600">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 맨 아래 작은 안내 문구 */}
      <footer className="pb-2 pt-2 text-center">
        <p className="text-xs leading-relaxed text-slate-400">
          이 검사는 재미로 보는 간이 검사이며, 공식 MBTI® 검사가 아닙니다.
        </p>
      </footer>
    </div>
  );
}

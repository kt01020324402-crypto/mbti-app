import Link from "next/link";

// 없는 주소로 접속했을 때 보여 주는 404 안내 페이지입니다.
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <section className="w-full rounded-3xl border border-emerald-100 bg-white/95 px-6 py-12 shadow-[0_10px_30px_rgba(45,175,130,0.1)]">
        <p aria-hidden="true" className="text-4xl">
          ☁️
        </p>
        <p className="mt-3 text-xs font-bold tracking-widest text-emerald-600">
          404
        </p>
        <h1 className="mt-1 text-2xl font-bold text-emerald-950">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
          주소가 잘못되었거나 사라진 페이지예요.
          <br />
          첫 화면으로 돌아가 다시 시작해 보세요.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-7 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)] transition-transform hover:-translate-y-0.5"
        >
          홈으로 가기
        </Link>
      </section>
    </div>
  );
}

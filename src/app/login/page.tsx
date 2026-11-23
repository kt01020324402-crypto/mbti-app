"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

// 주소의 next 값이 우리 사이트 안의 경로(/로 시작하고 //로 시작하지 않음)인지 확인합니다.
function getSafeNextPath(nextParam: string | null): string {
  if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
    return nextParam;
  }
  return "/";
}

// Supabase 로그인 오류 메시지를 쉬운 한국어로 바꿔 주는 함수입니다.
function getLoginErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 틀렸어요.";
  }
  if (lower.includes("email not confirmed")) {
    return "아직 이메일 인증이 끝나지 않았어요. 메일함을 확인해 주세요.";
  }
  return "로그인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
}

// useSearchParams()를 사용하는 실제 로그인 폼 컴포넌트입니다.
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(getLoginErrorMessage(error.message));
        return;
      }

      // 로그인에 성공하면 안전한 next 경로(없으면 홈)로 이동합니다.
      router.push(nextPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-[0_10px_30px_rgba(45,175,130,0.1)]">
      <h1 className="text-2xl font-bold text-emerald-950">로그인</h1>
      <p className="mt-1.5 text-sm text-slate-600">
        이메일과 비밀번호로 로그인해 주세요.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          <span>이메일</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="rounded-2xl border border-emerald-100 bg-emerald-50/30 px-4 py-3 text-base text-slate-900 outline-none focus:border-emerald-400 focus:bg-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          <span>비밀번호</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요"
            className="rounded-2xl border border-emerald-100 bg-emerald-50/30 px-4 py-3 text-base text-slate-900 outline-none focus:border-emerald-400 focus:bg-white"
          />
        </label>

        {errorMsg && (
          <p
            role="alert"
            className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
          >
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "처리 중..." : "로그인"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        아직 회원이 아니신가요?{" "}
        <Link
          href="/signup"
          className="font-bold text-emerald-700 underline-offset-4 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
}

// 이메일 + 비밀번호 로그인 페이지(/login)입니다.
export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <Suspense
        fallback={
          <div className="rounded-3xl border border-emerald-100 bg-white/95 p-6 text-center text-sm text-emerald-700">
            불러오는 중...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

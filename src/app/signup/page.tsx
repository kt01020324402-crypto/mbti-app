"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Supabase 회원가입 오류 메시지를 쉬운 한국어로 바꿔 주는 함수입니다.
function getSignupErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "이미 가입된 이메일이에요.";
  }
  if (lower.includes("password") && (lower.includes("6") || lower.includes("short") || lower.includes("weak"))) {
    return "비밀번호가 너무 짧아요. 6자 이상 입력해 주세요.";
  }
  if (lower.includes("invalid") && lower.includes("email")) {
    return "이메일 형식이 올바르지 않아요.";
  }
  return "회원가입 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
}

// 이메일 + 비밀번호 회원가입 페이지(/signup)입니다.
export default function SignupPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setNoticeMsg("");

    // 입력값 기본 검사
    if (!nickname.trim()) {
      setErrorMsg("닉네임을 입력해 주세요.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("비밀번호가 너무 짧아요. 6자 이상 입력해 주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg("비밀번호 확인이 서로 달라요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 닉네임은 별도 테이블을 만들지 않고 user_metadata.nickname에 함께 저장합니다.
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nickname: nickname.trim(),
          },
        },
      });

      if (error) {
        setErrorMsg(getSignupErrorMessage(error.message));
        return;
      }

      // 이메일 인증이 꺼져 있어 바로 로그인 세션이 생기면 홈으로 이동합니다.
      if (data.session) {
        router.push("/");
        return;
      }

      // 이메일 인증이 켜져 있어 바로 로그인되지 않으면 확인 메일 안내를 보여줍니다.
      setNoticeMsg(
        "가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center">
      <div className="rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-[0_10px_30px_rgba(45,175,130,0.1)]">
        <h1 className="text-2xl font-bold text-emerald-950">회원가입</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          가입하면 나의 검사 결과를 저장하고 다시 볼 수 있어요.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            <span>닉네임</span>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 몽글다람쥐"
              className="rounded-2xl border border-emerald-100 bg-emerald-50/30 px-4 py-3 text-base text-slate-900 outline-none focus:border-emerald-400 focus:bg-white"
            />
          </label>

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
            <span>비밀번호 (6자 이상)</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상 입력해 주세요"
              className="rounded-2xl border border-emerald-100 bg-emerald-50/30 px-4 py-3 text-base text-slate-900 outline-none focus:border-emerald-400 focus:bg-white"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            <span>비밀번호 확인</span>
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호를 한 번 더 입력해 주세요"
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

          {noticeMsg && (
            <p
              role="status"
              className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            >
              {noticeMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "처리 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          이미 회원이신가요?{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-700 underline-offset-4 hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

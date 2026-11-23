"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// AuthContext가 앱 전체에 공유할 값의 타입입니다.
interface AuthContextValue {
  // 현재 로그인한 회원 정보 (로그인하지 않았으면 null)
  user: User | null;
  // 로그인 상태를 확인하는 중인지 여부 (처음 잠깐 동안 true)
  loading: boolean;
  // 로그아웃 함수
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
});

// 앱 전체에서 로그인 상태를 함께 쓸 수 있게 감싸 주는 공급자(Provider)입니다.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 처음 화면이 열릴 때 현재 로그인 세션을 확인합니다.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. 로그인, 회원가입, 로그아웃이 일어날 때마다 상태를 바로 바꿉니다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 컴포넌트가 사라질 때 구독을 정리합니다.
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 로그아웃 처리 함수입니다.
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// 다른 컴포넌트에서 로그인 상태와 signOut 함수를 쉽게 꺼내 쓰는 훅입니다.
export function useAuth() {
  return useContext(AuthContext);
}

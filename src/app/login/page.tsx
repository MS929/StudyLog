"use client";
import { signInWithGoogle, useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">로딩 중...</p>;
  if (user)
    return (
      <p className="text-center mt-20">
        ✅ 로그인됨! 상단에서 홈으로 이동하세요.
      </p>
    );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-8 rounded-2xl border text-center">
        <h1 className="text-2xl font-semibold mb-6">로그인</h1>
        <button
          onClick={signInWithGoogle}
          className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          Google 계정으로 로그인
        </button>
      </div>
    </div>
  );
}

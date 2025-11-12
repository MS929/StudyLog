"use client";
import { useEffect, useState } from "react";
import { LogItem } from "@/components/LogItem";
import { LogForm } from "@/components/LogForm";
import { useAuth } from "@/lib/auth";
import { getMyLogs } from "@/lib/db";
import type { StudyLog } from "@/lib/types";

export default function HomePage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<StudyLog[]>([]);

  useEffect(() => {
    if (!user) {
      setLogs([]);
      return;
    }
    const unsub = getMyLogs(user.uid, setLogs);
    return () => unsub && unsub();
  }, [user]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border p-4">
        <h1 className="text-2xl font-semibold">공부 로그</h1>
        <p className="text-sm text-gray-500">
          로그인 후 기록을 추가하고, 최근 순으로 확인하세요.
        </p>
      </section>

      <LogForm />

      <div className="space-y-3">
        {logs.length === 0 ? (
          <p className="text-gray-500">기록이 없습니다.</p>
        ) : (
          logs.map((l) => <LogItem key={l.id} log={l} />)
        )}
      </div>
    </div>
  );
}

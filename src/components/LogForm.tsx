"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { addLog } from "@/lib/db";

export function LogForm() {
  const { user } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [minutes, setMinutes] = useState(60);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user)
    return (
      <p className="text-gray-500">로그인해야 기록을 추가할 수 있습니다.</p>
    );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await addLog({ date, minutes: Number(minutes), note });
      setNote("");
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border p-4 grid gap-3 sm:grid-cols-4"
    >
      <div>
        <label className="block text-sm mb-1">날짜</label>
        <input
          type="date"
          className="w-full rounded-md border px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">분</label>
        <input
          type="number"
          min={1}
          className="w-full rounded-md border px-3 py-2"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm mb-1">노트</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="무엇을 공부했나요?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="sm:col-span-4">
        <button
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-black text-white"
        >
          {loading ? "저장중…" : "기록 추가"}
        </button>
      </div>
    </form>
  );
}

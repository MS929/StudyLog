"use client";
import { deleteLog } from "@/lib/db";
import type { StudyLog } from "@/lib/types";

export function LogItem({ log }: { log: StudyLog }) {
  return (
    <div className="rounded-2xl border p-4 flex items-center justify-between">
      <div>
        <p className="font-medium">
          {log.date} · {log.minutes}분
        </p>
        {log.note && <p className="text-sm text-gray-500">{log.note}</p>}
      </div>
      <button
        className="px-3 py-2 rounded-lg bg-black text-white"
        onClick={() => deleteLog(log.id!)}
      >
        삭제
      </button>
    </div>
  );
}

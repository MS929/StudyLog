"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getMyLogsOnce } from "@/lib/db";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { StudyLog } from "@/lib/types";

export default function StatsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<StudyLog[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) {
        setLogs([]);
        return;
      }
      const data = await getMyLogsOnce(user.uid);
      setLogs(data);
    })();
  }, [user]);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of logs) map.set(l.date, (map.get(l.date) || 0) + l.minutes);
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, minutes]) => ({ date, minutes }));
  }, [logs]);

  if (!user) return <p className="mt-10 text-center">로그인 후 이용하세요.</p>;

  return (
    <div className="rounded-2xl border p-4">
      <h1 className="text-2xl font-semibold mb-4">공부 시간 통계</h1>
      {chartData.length === 0 ? (
        <p className="text-gray-500">표시할 데이터가 없습니다.</p>
      ) : (
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="minutes"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

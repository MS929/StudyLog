"use client";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import type { StudyLog } from "./types";
import { auth } from "@/lib/firebase";

const COL = "logs";

export async function addLog(input: {
  date: string;
  minutes: number;
  note?: string;
}) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");
  const data: StudyLog = { uid, ...input, createdAt: serverTimestamp() };
  await addDoc(collection(db, COL), data);
}

export function getMyLogs(uid: string, set: (logs: StudyLog[]) => void) {
  const q = query(
    collection(db, COL),
    where("uid", "==", uid)
  );
  return onSnapshot(q, (snap) => {
    const arr: StudyLog[] = [];
    snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
    // Sort client-side to avoid needing a composite index (uid asc + date desc)
    arr.sort((a, b) => b.date.localeCompare(a.date));
    set(arr);
  });
}

export async function getMyLogsOnce(uid: string) {
  const q = query(
    collection(db, COL),
    where("uid", "==", uid)
  );
  const snap = await getDocs(q);
  const arr = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  })) as StudyLog[];
  // Sort client-side to avoid needing a composite index (uid asc + date asc)
  arr.sort((a, b) => a.date.localeCompare(b.date));
  return arr;
}

export async function deleteLog(id: string) {
  await deleteDoc(doc(db, COL, id));
}

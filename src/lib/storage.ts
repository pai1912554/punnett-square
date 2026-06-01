// บันทึกความก้าวหน้าใน localStorage

import type { Difficulty } from "./genetics";

const KEY = "punnett-progress-v1";

export interface Stats {
  attempts: number;
  correct: number;
}

// หมวดจุดผิด — สอดคล้องกับชนิดคำถามใน quiz.ts
export type MistakeCategory = "recessive" | "dominant" | "ratio";

export const MISTAKE_LABEL: Record<MistakeCategory, string> = {
  recessive: "ลักษณะด้อย / นับช่อง aa",
  dominant: "ลักษณะเด่น / สัดส่วนเด่น",
  ratio: "อัตราส่วนฟีโนไทป์",
};

export interface Progress {
  practice: Record<Difficulty, Stats>;
  mental: {
    attempts: number;
    correct: number;
    bestStreak: number;
    totalTimeMs: number; // เวลารวมของข้อที่ตอบ (ใช้หาค่าเฉลี่ย)
    answered: number; // จำนวนข้อที่จับเวลา
  };
  // นับจำนวนครั้งที่ตอบผิดในแต่ละหมวด เพื่อวิเคราะห์จุดอ่อน
  mistakes: Record<MistakeCategory, number>;
  recent: { text: string; correct: boolean; at: number }[];
  updatedAt: number;
}

const empty: Progress = {
  practice: {
    easy: { attempts: 0, correct: 0 },
    medium: { attempts: 0, correct: 0 },
    hard: { attempts: 0, correct: 0 },
  },
  mental: {
    attempts: 0,
    correct: 0,
    bestStreak: 0,
    totalTimeMs: 0,
    answered: 0,
  },
  mistakes: { recessive: 0, dominant: 0, ratio: 0 },
  recent: [],
  updatedAt: 0,
};

export function loadProgress(): Progress {
  if (typeof window === "undefined") return structuredClone(empty);
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return structuredClone(empty);
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      ...structuredClone(empty),
      ...parsed,
      practice: { ...empty.practice, ...(parsed.practice ?? {}) },
      mental: { ...empty.mental, ...(parsed.mental ?? {}) },
      mistakes: { ...empty.mistakes, ...(parsed.mistakes ?? {}) },
      recent: parsed.recent ?? [],
    };
  } catch {
    return structuredClone(empty);
  }
}

function save(p: Progress) {
  if (typeof window === "undefined") return;
  p.updatedAt = Date.now();
  window.localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("punnett-progress"));
}

export function recordPractice(
  difficulty: Difficulty,
  correct: boolean,
  text: string,
  category?: MistakeCategory
) {
  const p = loadProgress();
  p.practice[difficulty].attempts += 1;
  if (correct) p.practice[difficulty].correct += 1;
  else if (category) p.mistakes[category] += 1;
  p.recent.unshift({ text, correct, at: Date.now() });
  p.recent = p.recent.slice(0, 12);
  save(p);
}

export function recordMental(
  correct: boolean,
  timeMs: number,
  streak: number
) {
  const p = loadProgress();
  p.mental.attempts += 1;
  if (correct) p.mental.correct += 1;
  p.mental.answered += 1;
  p.mental.totalTimeMs += timeMs;
  p.mental.bestStreak = Math.max(p.mental.bestStreak, streak);
  save(p);
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("punnett-progress"));
}

export function accuracy(s: { attempts: number; correct: number }): number {
  return s.attempts === 0 ? 0 : Math.round((s.correct / s.attempts) * 100);
}

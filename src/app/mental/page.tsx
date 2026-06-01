"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { makeQuestion, type Question } from "@/lib/quiz";
import { recordMental } from "@/lib/storage";
import { Card, Button, LinkButton } from "@/components/ui";

const TIME_LIMIT = 12000; // มิลลิวินาทีต่อข้อ
const ROUND = 10;

type Phase = "intro" | "play" | "done";

interface Answer {
  correct: boolean;
  timeMs: number;
}

export default function MentalPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [q, setQ] = useState<Question | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(TIME_LIMIT);
  const [streak, setStreak] = useState(0);

  const startedAt = useRef(0);
  const lockRef = useRef(false);

  const commit = useCallback(
    (chosen: string | null) => {
      if (lockRef.current || !q) return;
      lockRef.current = true;
      const timeMs = Math.min(Date.now() - startedAt.current, TIME_LIMIT);
      const correct = chosen === q.correct;
      recordMental(correct, timeMs, correct ? streak + 1 : 0);
      setStreak((s) => (correct ? s + 1 : 0));
      setPicked(chosen ?? "__timeout__");
      setAnswers((a) => [...a, { correct, timeMs }]);

      window.setTimeout(() => {
        if (index + 1 >= ROUND) {
          setPhase("done");
        } else {
          setIndex((i) => i + 1);
        }
      }, 650);
    },
    [q, index, streak]
  );

  // เริ่มข้อใหม่
  useEffect(() => {
    if (phase !== "play") return;
    setQ(makeQuestion("easy"));
    setPicked(null);
    setRemaining(TIME_LIMIT);
    startedAt.current = Date.now();
    lockRef.current = false;
  }, [phase, index]);

  // นับถอยหลัง
  useEffect(() => {
    if (phase !== "play" || !q) return;
    const id = window.setInterval(() => {
      const left = TIME_LIMIT - (Date.now() - startedAt.current);
      setRemaining(Math.max(0, left));
      if (left <= 0 && !lockRef.current) {
        commit(null);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, q, commit]);

  function start() {
    setIndex(0);
    setAnswers([]);
    setStreak(0);
    setPhase("play");
  }

  // ---- หน้าเริ่ม ----
  if (phase === "intro") {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-xl font-extrabold text-ink">โหมดฝึกคิดเร็ว</h1>
          <p className="text-sm text-muted">คิดในหัว ห้ามวาดตาราง</p>
        </header>
        <Card>
          <ul className="space-y-2 text-sm text-muted">
            <li>⏱️ มีเวลา {TIME_LIMIT / 1000} วินาทีต่อข้อ</li>
            <li>🧠 ใช้สูตรลัด เช่น 3/4, 1/4 คิดเปอร์เซ็นต์ในหัว</li>
            <li>🎯 {ROUND} ข้อต่อรอบ ระบบบันทึกความแม่นยำและเวลาเฉลี่ย</li>
          </ul>
          <div className="mt-4">
            <Button onClick={start}>เริ่มฝึกคิดเร็ว →</Button>
          </div>
        </Card>
      </div>
    );
  }

  // ---- หน้าสรุป ----
  if (phase === "done") {
    const correct = answers.filter((a) => a.correct).length;
    const acc = answers.length ? Math.round((correct / answers.length) * 100) : 0;
    const avg = answers.length
      ? Math.round(
          answers.reduce((s, a) => s + a.timeMs, 0) / answers.length / 100
        ) / 10
      : 0;
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-xl font-extrabold text-ink">สรุปผลรอบนี้</h1>
        </header>
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="ถูก" value={`${correct}/${ROUND}`} />
          <StatBox label="ความแม่นยำ" value={`${acc}%`} />
          <StatBox label="เวลาเฉลี่ย" value={`${avg}s`} />
        </div>
        <div className="flex gap-2">
          <Button onClick={start}>เล่นอีกรอบ</Button>
          <LinkButton href="/progress" variant="outline">
            ดูความก้าวหน้า
          </LinkButton>
        </div>
      </div>
    );
  }

  // ---- หน้าเล่น ----
  if (!q) return null;
  const answered = picked !== null;
  const isCorrect = picked === q.correct;
  const pct = (remaining / TIME_LIMIT) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-muted">
          ข้อ {index + 1}/{ROUND}
        </span>
        <span className="font-semibold text-brand-700">🔥 {streak}</span>
      </div>

      {/* แถบเวลา */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
        <div
          className={`h-full rounded-full transition-[width] duration-100 ease-linear ${
            pct < 30 ? "bg-rec" : "bg-brand-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <Card className="animate-pop">
        <div className="text-center">
          <div className="font-mono text-2xl font-extrabold tracking-wide text-ink">
            {q.problem.parent1} <span className="text-muted">×</span>{" "}
            {q.problem.parent2}
          </div>
          <p className="mt-2 text-sm font-semibold text-ink">{q.prompt}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {q.options.map((opt) => {
            let style =
              "border-line bg-surface text-ink active:bg-brand-50";
            if (answered) {
              if (opt === q.correct)
                style = "border-dom bg-dom-bg text-dom font-bold";
              else if (opt === picked)
                style = "border-rec bg-rec-bg text-rec";
              else style = "border-line bg-surface text-muted opacity-60";
            }
            return (
              <button
                key={opt}
                onClick={() => commit(opt)}
                disabled={answered}
                className={`rounded-xl border px-3 py-3 text-center font-mono text-base font-semibold transition-colors disabled:cursor-default ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <p
            className={`mt-3 text-center text-sm font-bold ${
              isCorrect ? "text-dom" : "text-rec"
            }`}
          >
            {picked === "__timeout__"
              ? `⏱️ หมดเวลา! คำตอบคือ ${q.correct}`
              : isCorrect
                ? "✅ ถูกต้อง"
                : `❌ คำตอบคือ ${q.correct}`}
          </p>
        )}
      </Card>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <Card className="text-center">
      <div className="text-2xl font-extrabold text-brand-700">{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </Card>
  );
}

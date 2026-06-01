"use client";

import { useCallback, useEffect, useState } from "react";
import { DIFFICULTY_LABEL, type Difficulty } from "@/lib/genetics";
import { makeQuestion, smartHint, type Question } from "@/lib/quiz";
import { recordPractice } from "@/lib/storage";
import StepExplanation from "@/components/StepExplanation";
import { Card, Button, Pill, LinkButton } from "@/components/ui";

const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [q, setQ] = useState<Question | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrongSet, setWrongSet] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [streak, setStreak] = useState(0);

  const next = useCallback((d: Difficulty) => {
    setQ(makeQuestion(d));
    setPicked(null);
    setWrongSet([]);
    setSolved(false);
    setRecorded(false);
    setShowExplain(false);
  }, []);

  useEffect(() => {
    next(difficulty);
  }, [difficulty, next]);

  if (!q) return null;

  function choose(opt: string) {
    if (!q || solved || wrongSet.includes(opt)) return;
    const correct = opt === q.correct;

    // บันทึกสถิติเฉพาะครั้งแรกที่ตอบ (ความแม่นยำ = ตอบถูกตั้งแต่ครั้งแรก)
    if (!recorded) {
      recordPractice(
        difficulty,
        correct,
        `${q.problem.parent1} × ${q.problem.parent2}`,
        q.type
      );
      setRecorded(true);
      setStreak((s) => (correct ? s + 1 : 0));
    }

    setPicked(opt);
    if (correct) setSolved(true);
    else setWrongSet((w) => [...w, opt]);
  }

  const attempted = solved || wrongSet.length > 0;
  const hint = !solved && wrongSet.length > 0 ? smartHint(q) : null;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-ink">ฝึกทำโจทย์</h1>
          <p className="text-sm text-muted">สุ่มโจทย์ ตรวจทันที</p>
        </div>
        <Pill tone="brand">🔥 ต่อเนื่อง {streak}</Pill>
      </header>

      <LinkButton href="/mental" variant="soft" className="w-full">
        ⏱️ ลองโหมดฝึกคิดเร็ว (จับเวลา)
      </LinkButton>

      {/* เลือกระดับ */}
      <div className="flex gap-2">
        {DIFFS.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors ${
              difficulty === d
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-line bg-surface text-muted"
            }`}
          >
            {DIFFICULTY_LABEL[d]}
          </button>
        ))}
      </div>

      {/* การ์ดโจทย์ */}
      <Card className="animate-pop">
        <div className="text-center">
          <p className="text-xs font-medium text-muted">โจทย์</p>
          <div className="mt-1 font-mono text-2xl font-extrabold tracking-wide text-ink">
            {q.problem.parent1} <span className="text-muted">×</span>{" "}
            {q.problem.parent2}
          </div>
          <p className="mt-2 text-sm font-semibold text-ink">{q.prompt}</p>
        </div>

        {/* ตัวเลือก */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {q.options.map((opt) => {
            const isWrong = wrongSet.includes(opt);
            const isCorrectReveal = solved && opt === q.correct;
            let style =
              "border-line bg-surface text-ink hover:border-brand-500 hover:bg-brand-50";
            if (isCorrectReveal)
              style = "border-dom bg-dom-bg text-dom font-bold";
            else if (isWrong)
              style = "border-rec bg-rec-bg text-rec line-through opacity-80";
            else if (solved)
              style = "border-line bg-surface text-muted opacity-60";
            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                disabled={solved || isWrong}
                className={`rounded-xl border px-3 py-3 text-center font-mono text-base font-semibold transition-colors disabled:cursor-default ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {!solved && wrongSet.length > 0 && (
          <p className="mt-3 text-center text-xs font-medium text-muted">
            ลองเลือกใหม่อีกครั้ง 👆
          </p>
        )}
      </Card>

      {/* ผลตรวจ */}
      {attempted && (
        <Card
          className={`animate-fade ${
            solved ? "border-dom/30" : "border-rec/30"
          }`}
        >
          {solved ? (
            <div className="flex items-center gap-2 text-dom">
              <span className="text-xl">✅</span>
              <p className="text-sm font-bold">
                {wrongSet.length === 0 ? "ถูกต้อง! เก่งมาก" : "ถูกแล้ว! เยี่ยม"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rec">
                <span className="text-xl">❌</span>
                <p className="text-sm font-bold">ยังไม่ถูก ลองคิดใหม่</p>
              </div>
              {hint && (
                <div className="rounded-xl bg-rec-bg/60 p-3 text-sm">
                  <p className="font-semibold text-rec">💡 คำใบ้</p>
                  <p className="mt-1 text-muted">{hint.mistake}</p>
                  <p className="mt-2 font-mono text-xs font-semibold text-ink">
                    สูตร: {hint.formula}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => next(difficulty)}>ข้อต่อไป →</Button>
            <Button variant="outline" onClick={() => setShowExplain((s) => !s)}>
              {showExplain ? "ซ่อนวิธีคิด" : "เฉลยทีละขั้น"}
            </Button>
          </div>

          {showExplain && (
            <div className="mt-3 animate-fade border-t border-line pt-3">
              <StepExplanation result={q.result} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

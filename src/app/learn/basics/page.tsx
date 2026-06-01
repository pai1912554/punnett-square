"use client";

import { useState } from "react";
import { CONCEPTS, type Concept } from "@/lib/concepts";
import { Card } from "@/components/ui";
import Link from "next/link";

function ConceptCard({ c }: { c: Concept }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === c.quiz.correctIndex;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{c.emoji}</span>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-ink">{c.term}</h2>
          <p className="mt-0.5 text-xs font-semibold text-brand-700">
            {c.short}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">{c.detail}</p>

      <div className="mt-3 rounded-xl bg-canvas p-3 text-sm">
        <span className="text-xs font-semibold text-muted">ตัวอย่าง</span>
        <p className="mt-0.5 font-mono text-ink">{c.example}</p>
      </div>

      {/* แบบทดสอบย่อ */}
      <div className="mt-4 border-t border-line pt-3">
        <p className="text-sm font-semibold text-ink">{c.quiz.question}</p>
        <div className="mt-2 grid gap-2">
          {c.quiz.options.map((opt, i) => {
            const isCorrect = i === c.quiz.correctIndex;
            let style =
              "border-line bg-surface text-ink hover:border-brand-500 hover:bg-brand-50";
            if (answered && isCorrect)
              style = "border-dom bg-dom-bg text-dom font-bold";
            else if (answered && i === picked)
              style = "border-rec bg-rec-bg text-rec line-through opacity-80";
            else if (answered)
              style = "border-line bg-surface text-muted opacity-60";
            return (
              <button
                key={i}
                onClick={() => !answered && setPicked(i)}
                disabled={answered}
                className={`rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors disabled:cursor-default ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <div
            className={`mt-2 animate-fade rounded-lg p-2 text-xs ${
              correct ? "bg-dom-bg text-dom" : "bg-rec-bg text-rec"
            }`}
          >
            {correct ? "✅ ถูกต้อง! " : "❌ ยังไม่ถูก — "}
            {c.quiz.explain}
            {!correct && (
              <button
                onClick={() => setPicked(null)}
                className="ml-2 font-semibold underline"
              >
                ลองใหม่
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function BasicsPage() {
  return (
    <div className="space-y-4">
      <header>
        <Link href="/learn" className="text-xs font-semibold text-brand-700">
          ← เรียนรู้
        </Link>
        <h1 className="mt-1 text-xl font-extrabold text-ink">
          พื้นฐานพันธุศาสตร์
        </h1>
        <p className="text-sm text-muted">
          อ่านสั้น ๆ แล้วลองตอบคำถามท้ายแต่ละหัวข้อ
        </p>
      </header>

      <div className="space-y-3">
        {CONCEPTS.map((c) => (
          <ConceptCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}

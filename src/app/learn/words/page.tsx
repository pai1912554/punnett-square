"use client";

import { useMemo, useState } from "react";
import {
  WORD_PROBLEMS,
  solveProblem,
  highlightKeywords,
  type WordProblem,
} from "@/lib/wordproblems";
import { type Translation } from "@/lib/traits";
import StepExplanation from "@/components/StepExplanation";
import { Card, Button, Pill, Mono } from "@/components/ui";
import Link from "next/link";

function Highlighted({ text }: { text: string }) {
  const parts = useMemo(() => highlightKeywords(text), [text]);
  return (
    <span>
      {parts.map((p, i) => {
        if (p.type === "trait")
          return (
            <mark
              key={i}
              className="rounded bg-dom-bg px-1 font-semibold text-dom"
            >
              {p.text}
            </mark>
          );
        if (p.type === "zygosity")
          return (
            <mark
              key={i}
              className="rounded bg-rec-bg px-1 font-semibold text-rec"
            >
              {p.text}
            </mark>
          );
        return <span key={i}>{p.text}</span>;
      })}
    </span>
  );
}

function TranslateRow({ phrase, t }: { phrase: string; t: Translation }) {
  return (
    <div className="rounded-xl border border-line bg-canvas p-3">
      <p className="text-sm">
        <Highlighted text={phrase} />
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-muted">→</span>
        <Pill tone="brand">
          <Mono>{t.genotype}</Mono>
        </Pill>
        <span className="text-xs text-muted">{t.explanation}</span>
      </div>
    </div>
  );
}

function ProblemView({ problem }: { problem: WordProblem }) {
  const [step, setStep] = useState(0); // 0=โจทย์, 1=แปล, 2=สมการ, 3=เฉลย
  const solved = useMemo(() => solveProblem(problem), [problem]);

  return (
    <div className="space-y-3">
      {/* โจทย์ + ไฮไลต์คำสำคัญ */}
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted">โจทย์</p>
          <div className="flex gap-1.5 text-[10px]">
            <span className="rounded bg-dom-bg px-1.5 py-0.5 font-semibold text-dom">
              คำลักษณะ
            </span>
            <span className="rounded bg-rec-bg px-1.5 py-0.5 font-semibold text-rec">
              คำบอกพันธุ์
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          <Highlighted text={solved.problem.story} />
        </p>
        <p className="mt-2 text-sm font-semibold text-ink">
          ❓ <Highlighted text={solved.problem.question} />
        </p>
      </Card>

      {/* ขั้นที่ 1: แปลโจทย์ */}
      {step >= 1 && (
        <Card className="animate-fade">
          <p className="text-sm font-bold text-ink">1) แปลโจทย์เป็นจีโนไทป์</p>
          <p className="mt-1 text-xs text-muted">
            ลักษณะ: {solved.trait.emoji} {solved.trait.name} — เด่น “
            {solved.trait.dominant}” = {solved.trait.letter.toUpperCase()}, ด้อย “
            {solved.trait.recessive}” = {solved.trait.letter.toLowerCase()}
          </p>
          <div className="mt-2 space-y-2">
            <TranslateRow phrase={solved.problem.parent1Phrase} t={solved.t1} />
            <TranslateRow phrase={solved.problem.parent2Phrase} t={solved.t2} />
          </div>
        </Card>
      )}

      {/* ขั้นที่ 2: สร้างสมการ */}
      {step >= 2 && (
        <Card className="animate-fade">
          <p className="text-sm font-bold text-ink">2) สร้างสมการผสมพันธุ์</p>
          <div className="mt-2 grid place-items-center rounded-xl bg-brand-50 py-4">
            <span className="font-mono text-2xl font-extrabold text-brand-700">
              {solved.equation}
            </span>
          </div>
        </Card>
      )}

      {/* ขั้นที่ 3: เฉลยทีละขั้น */}
      {step >= 3 && (
        <Card className="animate-fade">
          <p className="mb-2 text-sm font-bold text-ink">3) เฉลยทีละขั้น</p>
          <StepExplanation result={solved.result} />
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            {step === 0
              ? "แปลโจทย์ →"
              : step === 1
              ? "สร้างสมการ →"
              : "เฉลยทีละขั้น →"}
          </Button>
        ) : null}
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(0)}>
            เริ่มใหม่
          </Button>
        )}
      </div>
    </div>
  );
}

export default function WordsPage() {
  const [idx, setIdx] = useState(0);
  const problem = WORD_PROBLEMS[idx];

  return (
    <div className="space-y-4">
      <header>
        <Link href="/learn" className="text-xs font-semibold text-brand-700">
          ← เรียนรู้
        </Link>
        <h1 className="mt-1 text-xl font-extrabold text-ink">
          แปลโจทย์เป็นจีโนไทป์
        </h1>
        <p className="text-sm text-muted">
          ฝึกเปลี่ยนคำพูดในโจทย์ให้เป็นยีน แล้วค่อยคำนวณ
        </p>
      </header>

      {/* เลือกโจทย์ */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {WORD_PROBLEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-sm font-bold transition-colors ${
              idx === i
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-line bg-surface text-muted"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <ProblemView key={problem.id} problem={problem} />
    </div>
  );
}

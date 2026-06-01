"use client";

import { useMemo, useState } from "react";
import { analyzeCross, type CrossResult } from "@/lib/genetics";
import CrossInput from "@/components/CrossInput";
import PunnettSquare from "@/components/PunnettSquare";
import ResultPanel from "@/components/ResultPanel";
import StepExplanation from "@/components/StepExplanation";
import { Card, SectionTitle } from "@/components/ui";

export default function GeneratorPage() {
  const [p1, setP1] = useState("Aa");
  const [p2, setP2] = useState("Aa");
  const [showSteps, setShowSteps] = useState(false);

  const { result, error } = useMemo<{
    result: CrossResult | null;
    error: string | null;
  }>(() => {
    try {
      return { result: analyzeCross(p1, p2), error: null };
    } catch (e) {
      return { result: null, error: (e as Error).message };
    }
  }, [p1, p2]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-extrabold text-ink">สร้างตารางพันเน็ต</h1>
        <p className="text-sm text-muted">
          กรอกจีโนไทป์พ่อแม่ ระบบคำนวณให้อัตโนมัติ
        </p>
      </header>

      <Card>
        <CrossInput
          p1={p1}
          p2={p2}
          setP1={setP1}
          setP2={setP2}
          error={error}
        />
      </Card>

      {result && (
        <>
          <Card className="animate-fade">
            <SectionTitle title="ตาราง Punnett" hint={`${result.total} ช่อง`} />
            <PunnettSquare result={result} />
          </Card>

          <ResultPanel result={result} />

          <Card className="animate-fade">
            <button
              type="button"
              onClick={() => setShowSteps((s) => !s)}
              className="flex w-full items-center justify-between"
            >
              <SectionTitle title="วิธีคิดทีละขั้น" />
              <span className="text-sm font-semibold text-brand-700">
                {showSteps ? "ซ่อน" : "ดู 6 ขั้นตอน"}
              </span>
            </button>
            {showSteps && (
              <div className="mt-2 animate-fade">
                <StepExplanation result={result} embedSquare={false} />
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

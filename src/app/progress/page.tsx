"use client";

import { useEffect, useState } from "react";
import {
  accuracy,
  loadProgress,
  resetProgress,
  MISTAKE_LABEL,
  type MistakeCategory,
  type Progress,
} from "@/lib/storage";
import { DIFFICULTY_LABEL, type Difficulty } from "@/lib/genetics";
import { Card, Button, LinkButton, Pill } from "@/components/ui";

const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

export default function ProgressPage() {
  const [p, setP] = useState<Progress | null>(null);

  useEffect(() => {
    const sync = () => setP(loadProgress());
    sync();
    window.addEventListener("punnett-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("punnett-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!p) return null;

  const totalAttempts =
    DIFFS.reduce((s, d) => s + p.practice[d].attempts, 0) + p.mental.attempts;
  const totalCorrect =
    DIFFS.reduce((s, d) => s + p.practice[d].correct, 0) + p.mental.correct;
  const overallAcc =
    totalAttempts === 0
      ? 0
      : Math.round((totalCorrect / totalAttempts) * 100);
  const mentalAvg =
    p.mental.answered === 0
      ? 0
      : Math.round((p.mental.totalTimeMs / p.mental.answered) / 100) / 10;

  const empty = totalAttempts === 0;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-extrabold text-ink">ความก้าวหน้า</h1>
        <p className="text-sm text-muted">สถิติการฝึกของคุณ</p>
      </header>

      {empty ? (
        <Card className="text-center">
          <p className="text-sm text-muted">ยังไม่มีข้อมูล เริ่มฝึกกันเลย!</p>
          <div className="mt-3 flex justify-center gap-2">
            <LinkButton href="/practice">ฝึกทำโจทย์</LinkButton>
            <LinkButton href="/mental" variant="outline">
              ฝึกคิดเร็ว
            </LinkButton>
          </div>
        </Card>
      ) : (
        <>
          {/* ภาพรวม */}
          <div className="grid grid-cols-3 gap-3">
            <Stat label="ทำทั้งหมด" value={`${totalAttempts}`} />
            <Stat label="ความแม่นยำ" value={`${overallAcc}%`} />
            <Stat label="ทำถูก" value={`${totalCorrect}`} />
          </div>

          {/* ฝึกทำโจทย์ตามระดับ */}
          <Card>
            <h2 className="mb-3 text-sm font-bold text-ink">ฝึกทำโจทย์</h2>
            <div className="space-y-3">
              {DIFFS.map((d) => {
                const s = p.practice[d];
                const acc = accuracy(s);
                return (
                  <div key={d}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-ink">
                        {DIFFICULTY_LABEL[d]}
                      </span>
                      <span className="text-muted">
                        {s.correct}/{s.attempts} ·{" "}
                        <span className="font-semibold text-ink">{acc}%</span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${acc}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ฝึกคิดเร็ว */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink">ฝึกคิดเร็ว</h2>
              <Pill tone="brand">สถิติดีสุด 🔥 {p.mental.bestStreak}</Pill>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat
                label="ความแม่นยำ"
                value={`${accuracy(p.mental)}%`}
                small
              />
              <Stat label="เวลาเฉลี่ย" value={`${mentalAvg}s`} small />
              <Stat label="ทำถูก" value={`${p.mental.correct}`} small />
            </div>
          </Card>

          {/* วิเคราะห์จุดผิด */}
          <MistakeAnalytics mistakes={p.mistakes} />

          {/* ล่าสุด */}
          {p.recent.length > 0 && (
            <Card>
              <h2 className="mb-3 text-sm font-bold text-ink">โจทย์ล่าสุด</h2>
              <ul className="space-y-1.5">
                {p.recent.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-canvas px-3 py-1.5 text-sm"
                  >
                    <span className="font-mono font-semibold">{r.text}</span>
                    <span>{r.correct ? "✅" : "❌"}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm("ล้างข้อมูลความก้าวหน้าทั้งหมด?")) resetProgress();
              }}
            >
              ล้างข้อมูลทั้งหมด
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

const MISTAKE_CATS: MistakeCategory[] = ["recessive", "dominant", "ratio"];

const MISTAKE_TIP: Record<MistakeCategory, string> = {
  recessive: "ทบทวน: ลักษณะด้อยแสดงเมื่อเป็น aa เท่านั้น นับเฉพาะช่อง aa",
  dominant: "ทบทวน: ลักษณะเด่น = 100% − ด้อย หรือ (3/4)^จำนวนยีน",
  ratio: "ทบทวน: นับช่องแต่ละฟีโนไทป์แล้วหารด้วย ห.ร.ม. เช่น 9:3:3:1",
};

function MistakeAnalytics({
  mistakes,
}: {
  mistakes: Record<MistakeCategory, number>;
}) {
  const total = MISTAKE_CATS.reduce((s, c) => s + mistakes[c], 0);
  if (total === 0) return null;

  // หมวดที่ผิดมากที่สุด = จุดอ่อน
  const weakest = MISTAKE_CATS.reduce((a, b) =>
    mistakes[b] > mistakes[a] ? b : a
  );

  return (
    <Card>
      <h2 className="mb-1 text-sm font-bold text-ink">วิเคราะห์จุดผิด</h2>
      <p className="mb-3 text-xs text-muted">
        ผิดบ่อยที่สุดในหมวด:{" "}
        <span className="font-semibold text-rec">{MISTAKE_LABEL[weakest]}</span>
      </p>
      <div className="space-y-3">
        {MISTAKE_CATS.map((c) => {
          const n = mistakes[c];
          const pct = total === 0 ? 0 : Math.round((n / total) * 100);
          return (
            <div key={c}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{MISTAKE_LABEL[c]}</span>
                <span className="text-muted">
                  {n} ครั้ง · <span className="font-semibold">{pct}%</span>
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
                <div
                  className="h-full rounded-full bg-rec"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 rounded-xl bg-rec-bg/60 p-3 text-xs text-muted">
        💡 {MISTAKE_TIP[weakest]}
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <Card className="text-center">
      <div
        className={`font-extrabold text-brand-700 ${
          small ? "text-xl" : "text-2xl"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </Card>
  );
}

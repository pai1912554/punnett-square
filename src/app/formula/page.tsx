"use client";

import { useState } from "react";
import { analyzeCross } from "@/lib/genetics";
import PunnettSquare from "@/components/PunnettSquare";
import { Card, Button, Pill, Mono } from "@/components/ui";

interface Formula {
  id: string;
  title: string;
  formula: string;
  desc: string;
  example: string;
  cross?: [string, string];
  visual: "dom" | "rec" | "gametes" | "cells" | "dihybrid";
}

const FORMULAS: Formula[] = [
  {
    id: "dom",
    title: "สัดส่วนลักษณะเด่น",
    formula: "3/4 = 75%",
    desc: "ผสมเฮเทอโรไซกัส (Aa × Aa) ลูกที่แสดงลักษณะเด่นมี 3 ใน 4 ส่วน",
    example: "Aa × Aa → เด่น 3 : ด้อย 1",
    cross: ["Aa", "Aa"],
    visual: "dom",
  },
  {
    id: "rec",
    title: "สัดส่วนลักษณะด้อย",
    formula: "1/4 = 25%",
    desc: "ลักษณะด้อยแสดงออกเมื่อเป็นพันธุ์แท้ด้อย (aa) เท่านั้น = 1 ใน 4",
    example: "Aa × Aa → aa = 25%",
    cross: ["Aa", "Aa"],
    visual: "rec",
  },
  {
    id: "gametes",
    title: "จำนวนเซลล์สืบพันธุ์",
    formula: "2ⁿ",
    desc: "n = จำนวนยีนเฮเทอโรไซกัส เช่น AaBb มี n = 2 → 2² = 4 เซลล์สืบพันธุ์",
    example: "AaBb → 4 ชนิด (AB, Ab, aB, ab)",
    cross: ["AaBb", "AaBb"],
    visual: "gametes",
  },
  {
    id: "cells",
    title: "จำนวนช่องในตาราง",
    formula: "(2ⁿ)²",
    desc: "นำเซลล์สืบพันธุ์ของพ่อ × แม่ เช่น dihybrid = (2²)² = 16 ช่อง",
    example: "AaBb × AaBb → 16 ช่อง",
    cross: ["AaBb", "AaBb"],
    visual: "cells",
  },
  {
    id: "dihybrid",
    title: "อัตราส่วน 2 ยีน",
    formula: "9 : 3 : 3 : 1",
    desc: "ผสม dihybrid เฮเทอโรไซกัส ได้ฟีโนไทป์ 4 แบบ ตามอัตราส่วนคลาสสิก",
    example: "AaBb × AaBb → 9:3:3:1",
    cross: ["AaBb", "AaBb"],
    visual: "dihybrid",
  },
];

function Visual({ kind }: { kind: Formula["visual"] }) {
  if (kind === "dom" || kind === "rec") {
    const highlightRec = kind === "rec";
    return (
      <div className="flex h-6 overflow-hidden rounded-lg">
        <div
          className={`grid place-items-center text-[11px] font-bold text-white ${
            highlightRec ? "bg-dom/40" : "bg-dom"
          }`}
          style={{ width: "75%" }}
        >
          เด่น 3/4
        </div>
        <div
          className={`grid place-items-center text-[11px] font-bold text-white ${
            highlightRec ? "bg-rec" : "bg-rec/50"
          }`}
          style={{ width: "25%" }}
        >
          ด้อย 1/4
        </div>
      </div>
    );
  }
  if (kind === "gametes") {
    return (
      <div className="flex flex-wrap gap-1">
        {["AB", "Ab", "aB", "ab"].map((g) => (
          <span
            key={g}
            className="rounded bg-brand-50 px-2 py-0.5 font-mono text-xs font-bold text-brand-700"
          >
            {g}
          </span>
        ))}
      </div>
    );
  }
  if (kind === "cells") {
    return (
      <div className="grid w-fit grid-cols-4 gap-0.5">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="h-3 w-3 rounded-sm bg-brand-100" />
        ))}
      </div>
    );
  }
  // dihybrid 9:3:3:1
  const parts = [
    { n: 9, c: "bg-dom" },
    { n: 3, c: "bg-brand-500" },
    { n: 3, c: "bg-rec" },
    { n: 1, c: "bg-slate-400" },
  ];
  return (
    <div className="flex h-6 overflow-hidden rounded-lg">
      {parts.map((p, i) => (
        <div
          key={i}
          className={`grid place-items-center ${p.c} text-[11px] font-bold text-white`}
          style={{ width: `${(p.n / 16) * 100}%` }}
        >
          {p.n}
        </div>
      ))}
    </div>
  );
}

function FormulaPlayground() {
  const [n, setN] = useState(2);
  const gametes = 2 ** n;
  const cells = gametes ** 2;
  const domFrac = `(3/4)^${n}`;
  const domPct = Math.pow(3 / 4, n) * 100;
  const recPct = Math.pow(1 / 4, n) * 100;
  const fmt = (x: number) =>
    Number.isInteger(x) ? `${x}` : x.toFixed(2).replace(/\.?0+$/, "");

  return (
    <Card className="border-brand-500/30 bg-brand-50/30">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-ink">🧮 Formula Playground</h2>
        <Pill tone="brand">เปลี่ยน n สูตรอัปเดตทันที</Pill>
      </div>
      <p className="mt-1 text-xs text-muted">
        n = จำนวนยีนที่เป็นพันธุ์ผสม (เฮเทอโรไซกัส) ในการผสมแบบ Aa × Aa
      </p>

      {/* ปรับ n */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm font-semibold text-ink">n =</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setN((v) => Math.max(1, v - 1))}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-lg font-bold text-ink disabled:opacity-40"
            disabled={n <= 1}
          >
            −
          </button>
          <span className="w-10 text-center font-mono text-2xl font-extrabold text-brand-700">
            {n}
          </span>
          <button
            onClick={() => setN((v) => Math.min(4, v + 1))}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-lg font-bold text-ink disabled:opacity-40"
            disabled={n >= 4}
          >
            +
          </button>
        </div>
        <span className="text-xs text-muted">
          ({n === 1 ? "monohybrid" : n === 2 ? "dihybrid" : n === 3 ? "trihybrid" : "4 ยีน"})
        </span>
      </div>

      {/* ผลลัพธ์สูตร */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <PlayRow label="เซลล์สืบพันธุ์ 2ⁿ" expr={`2^${n}`} value={`${gametes} ชนิด`} />
        <PlayRow label="ช่องในตาราง (2ⁿ)²" expr={`${gametes}²`} value={`${cells} ช่อง`} />
        <PlayRow label="เด่นครบทุกยีน (3/4)ⁿ" expr={domFrac} value={`${fmt(domPct)}%`} />
        <PlayRow label="ด้อยทุกยีน (1/4)ⁿ" expr={`(1/4)^${n}`} value={`${fmt(recPct)}%`} />
      </div>
    </Card>
  );
}

function PlayRow({
  label,
  expr,
  value,
}: {
  label: string;
  expr: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="text-[11px] font-medium text-muted">{label}</p>
      <p className="mt-1 font-mono text-xs text-muted">{expr} =</p>
      <p className="font-mono text-lg font-extrabold text-brand-700">{value}</p>
    </div>
  );
}

export default function FormulaPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-extrabold text-ink">สูตรสำคัญ</h1>
        <p className="text-sm text-muted">
          จำสูตรลัด แล้วกด “ทดลอง” เพื่อดูตารางจริง
        </p>
      </header>

      <FormulaPlayground />

      <div className="space-y-3">
        {FORMULAS.map((f) => {
          const isOpen = active === f.id;
          const result = f.cross ? analyzeCross(f.cross[0], f.cross[1]) : null;
          return (
            <Card key={f.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-ink">{f.title}</h3>
                    <Pill tone="brand">
                      <span className="font-mono">{f.formula}</span>
                    </Pill>
                  </div>
                  <p className="mt-1 text-xs text-muted">{f.desc}</p>
                  <div className="mt-2 text-xs">
                    <span className="text-muted">ตัวอย่าง: </span>
                    <Mono>{f.example}</Mono>
                  </div>
                  <div className="mt-3 max-w-xs">
                    <Visual kind={f.visual} />
                  </div>
                </div>
              </div>

              {f.cross && (
                <div className="mt-3 border-t border-line pt-3">
                  <Button
                    variant={isOpen ? "soft" : "outline"}
                    onClick={() => setActive(isOpen ? null : f.id)}
                    className="!px-3 !py-1.5 text-xs"
                  >
                    {isOpen ? "ซ่อนตาราง" : "ทดลอง ▶"}
                  </Button>

                  {isOpen && result && (
                    <div className="mt-3 animate-fade space-y-3">
                      <PunnettSquare result={result} />
                      <div className="flex flex-wrap gap-2">
                        {result.phenotypes.map((p) => (
                          <span
                            key={p.key}
                            className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                              p.isAllDominant
                                ? "bg-dom-bg text-dom"
                                : "bg-rec-bg text-rec"
                            }`}
                          >
                            {p.label} = {p.percent.toFixed(0)}%
                          </span>
                        ))}
                        <span className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                          อัตราส่วน {result.phenotypeRatio}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

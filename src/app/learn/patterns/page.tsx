"use client";

import { useState } from "react";
import { PATTERNS, type CrossPattern } from "@/lib/patterns";
import { analyzeCross } from "@/lib/genetics";
import PunnettSquare from "@/components/PunnettSquare";
import { Card, Button, Pill } from "@/components/ui";
import Link from "next/link";

function ProportionBar({ dom, rec }: { dom: number; rec: number }) {
  if (dom === 0 && rec === 0) return null;
  return (
    <div className="flex h-5 overflow-hidden rounded-lg">
      {dom > 0 && (
        <div
          className="grid place-items-center bg-dom text-[10px] font-bold text-white"
          style={{ width: `${dom}%` }}
        >
          เด่น {dom}%
        </div>
      )}
      {rec > 0 && (
        <div
          className="grid place-items-center bg-rec text-[10px] font-bold text-white"
          style={{ width: `${rec}%` }}
        >
          ด้อย {rec}%
        </div>
      )}
    </div>
  );
}

function PatternCard({ p }: { p: CrossPattern }) {
  const [open, setOpen] = useState(false);
  // ใช้ตัวอักษรจริงจากสตริง cross เช่น "Aa × Aa"
  const [g1, g2] = p.cross.split("×").map((s) => s.trim());
  const result = open ? analyzeCross(g1, g2) : null;

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-lg font-extrabold text-ink">
          {p.cross}
        </span>
        <div className="flex gap-1.5">
          <Pill tone="brand">จีโน {p.genoRatio}</Pill>
          <Pill tone="dom">ฟีโน {p.phenoRatio}</Pill>
        </div>
      </div>

      <p className="mt-2 text-sm font-semibold text-brand-700">{p.headline}</p>
      <p className="mt-1 text-xs text-muted">{p.detail}</p>

      <div className="mt-3">
        <ProportionBar dom={p.domPercent} rec={p.recPercent} />
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <Button
          variant={open ? "soft" : "outline"}
          onClick={() => setOpen((o) => !o)}
          className="!px-3 !py-1.5 text-xs"
        >
          {open ? "ซ่อนตาราง" : "ดูตารางจริง ▶"}
        </Button>
        {open && result && (
          <div className="mt-3 animate-fade">
            <PunnettSquare result={result} />
          </div>
        )}
      </div>
    </Card>
  );
}

export default function PatternsPage() {
  return (
    <div className="space-y-4">
      <header>
        <Link href="/learn" className="text-xs font-semibold text-brand-700">
          ← เรียนรู้
        </Link>
        <h1 className="mt-1 text-xl font-extrabold text-ink">
          รูปแบบที่พบบ่อย
        </h1>
        <p className="text-sm text-muted">
          จำแพตเทิร์นเหล่านี้ ตอบได้ทันทีโดยไม่ต้องวาดตาราง
        </p>
      </header>

      <div className="space-y-3">
        {PATTERNS.map((p) => (
          <PatternCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

"use client";

import type { CrossResult } from "@/lib/genetics";
import { Card, Pill } from "./ui";

function Bar({ percent, tone }: { percent: number; tone: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas">
      <div
        className={`h-full rounded-full ${tone}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default function ResultPanel({ result }: { result: CrossResult }) {
  const { genotypes, phenotypes, genotypeRatio, phenotypeRatio } = result;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {/* จีโนไทป์ */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">จีโนไทป์ (Genotype)</h3>
          <Pill tone="brand">{genotypes.length} แบบ</Pill>
        </div>
        <ul className="space-y-2.5">
          {genotypes.map((g) => (
            <li key={g.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-mono font-semibold">{g.label}</span>
                <span className="text-muted">
                  {g.count}/{result.total} ·{" "}
                  <span className="font-semibold text-ink">
                    {g.percent.toFixed(g.percent % 1 === 0 ? 0 : 1)}%
                  </span>
                </span>
              </div>
              <Bar percent={g.percent} tone="bg-brand-500" />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          อัตราส่วนจีโนไทป์ ={" "}
          <span className="font-mono font-semibold text-ink">
            {genotypeRatio}
          </span>
        </p>
      </Card>

      {/* ฟีโนไทป์ */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">ฟีโนไทป์ (Phenotype)</h3>
          <Pill tone="brand">{phenotypes.length} แบบ</Pill>
        </div>
        <ul className="space-y-2.5">
          {phenotypes.map((p) => (
            <li key={p.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="font-mono font-semibold">{p.key}</span>
                  <Pill tone={p.isAllDominant ? "dom" : "rec"}>{p.label}</Pill>
                </span>
                <span className="text-muted">
                  <span className="font-semibold text-ink">
                    {p.percent.toFixed(p.percent % 1 === 0 ? 0 : 1)}%
                  </span>
                </span>
              </div>
              <Bar
                percent={p.percent}
                tone={p.isAllDominant ? "bg-dom" : "bg-rec"}
              />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          อัตราส่วนฟีโนไทป์ ={" "}
          <span className="font-mono font-semibold text-ink">
            {phenotypeRatio}
          </span>
        </p>
      </Card>
    </div>
  );
}

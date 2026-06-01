"use client";

import type { CrossResult } from "@/lib/genetics";
import PunnettSquare from "./PunnettSquare";
import { Mono } from "./ui";

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
          {n}
        </span>
        <span className="mt-1 w-px flex-1 bg-line" />
      </div>
      <div className="flex-1 pb-5">
        <h4 className="mb-1.5 text-sm font-bold text-ink">{title}</h4>
        <div className="text-sm text-muted">{children}</div>
      </div>
    </div>
  );
}

export default function StepExplanation({
  result,
  embedSquare = true,
}: {
  result: CrossResult;
  embedSquare?: boolean;
}) {
  const n = result.geneCount;
  const gametesPer = result.uniqueGametes1.length;

  return (
    <div>
      <Step n={1} title="แยกยีน (Separate genes)">
        แยกจีโนไทป์ออกเป็นยีนทีละคู่
        <div className="mt-2 flex flex-wrap gap-2">
          {result.genes.map((g) => (
            <span
              key={g.letter}
              className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-xs"
            >
              ยีน {g.letter}: <Mono>{g.p1.join("")}</Mono> ×{" "}
              <Mono>{g.p2.join("")}</Mono>
            </span>
          ))}
        </div>
      </Step>

      <Step n={2} title="แตกเซลล์สืบพันธุ์ (Gametes)">
        จำนวนเซลล์สืบพันธุ์ = <Mono>2^{n}</Mono> ={" "}
        <span className="font-semibold text-ink">{gametesPer}</span> แบบต่อพ่อแม่
        หนึ่งตัว (n = จำนวนยีนเฮเทอโรไซกัส; ที่นี่นับทุกยีน = {n})
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-canvas px-3 py-2 text-xs">
            <span className="text-muted">♀ {result.parent1} →</span>{" "}
            {result.uniqueGametes1.map((g) => (
              <span
                key={g}
                className="mr-1 inline-block rounded bg-brand-50 px-1.5 py-0.5 font-mono font-semibold text-brand-700"
              >
                {g}
              </span>
            ))}
          </div>
          <div className="rounded-lg border border-line bg-canvas px-3 py-2 text-xs">
            <span className="text-muted">♂ {result.parent2} →</span>{" "}
            {result.uniqueGametes2.map((g) => (
              <span
                key={g}
                className="mr-1 inline-block rounded bg-brand-50 px-1.5 py-0.5 font-mono font-semibold text-brand-700"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </Step>

      <Step n={3} title="สร้างตาราง (Punnett Square)">
        นำเซลล์สืบพันธุ์มาผสมในตาราง จำนวนช่อง ={" "}
        <Mono>(2^{n})²</Mono> ={" "}
        <span className="font-semibold text-ink">{result.total}</span> ช่อง
        {embedSquare && (
          <div className="mt-3">
            <PunnettSquare result={result} />
          </div>
        )}
      </Step>

      <Step n={4} title="นับจีโนไทป์ (Count genotypes)">
        นับจีโนไทป์ที่ซ้ำกัน ได้ {result.genotypes.length} แบบ
        <div className="mt-2 flex flex-wrap gap-1.5">
          {result.genotypes.map((g) => (
            <span
              key={g.label}
              className="rounded-md border border-line bg-canvas px-2 py-0.5 text-xs"
            >
              <Mono>{g.label}</Mono> × {g.count}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs">
          อัตราส่วนจีโนไทป์ ={" "}
          <span className="font-mono font-semibold text-ink">
            {result.genotypeRatio}
          </span>
        </p>
      </Step>

      <Step n={5} title="คำนวณฟีโนไทป์ (Phenotype)">
        จัดกลุ่มตามลักษณะที่แสดงออก (มีอัลลีลเด่นอย่างน้อย 1 = แสดงลักษณะเด่น)
        <div className="mt-2 flex flex-wrap gap-1.5">
          {result.phenotypes.map((p) => (
            <span
              key={p.key}
              className={`rounded-md border px-2 py-0.5 text-xs ${
                p.isAllDominant
                  ? "border-dom/20 bg-dom-bg text-dom"
                  : "border-rec/20 bg-rec-bg text-rec"
              }`}
            >
              <Mono>{p.key}</Mono> × {p.count}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs">
          อัตราส่วนฟีโนไทป์ ={" "}
          <span className="font-mono font-semibold text-ink">
            {result.phenotypeRatio}
          </span>
        </p>
      </Step>

      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
            6
          </span>
        </div>
        <div className="flex-1">
          <h4 className="mb-1.5 text-sm font-bold text-ink">
            สรุปเปอร์เซ็นต์ (Summary)
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.phenotypes.map((p) => (
              <span
                key={p.key}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                  p.isAllDominant
                    ? "bg-dom-bg text-dom"
                    : "bg-rec-bg text-rec"
                }`}
              >
                {p.label} = {p.percent.toFixed(p.percent % 1 === 0 ? 0 : 1)}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import type { CrossResult } from "@/lib/genetics";

function renderGenotype(g: string) {
  return (
    <span className="font-mono">
      {g.split("").map((ch, i) => {
        const isDom = ch === ch.toUpperCase();
        return (
          <span
            key={i}
            className={isDom ? "font-bold text-dom" : "text-rec/90"}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

/** หาประเภทฟีโนไทป์ของช่อง: เด่นทั้งหมด / ด้อยทั้งหมด / ผสม */
function cellTone(g: string): "dom" | "rec" | "mix" {
  let allDom = true;
  let allRec = true;
  for (let i = 0; i < g.length; i += 2) {
    const a = g[i];
    const b = g[i + 1];
    const dominant = a === a.toUpperCase() || b === b.toUpperCase();
    if (dominant) allRec = false;
    else allDom = false;
  }
  if (allDom) return "dom";
  if (allRec) return "rec";
  return "mix";
}

const toneBg: Record<string, string> = {
  dom: "bg-dom-bg",
  rec: "bg-rec-bg",
  mix: "bg-surface",
};

export default function PunnettSquare({ result }: { result: CrossResult }) {
  const { gametes1, gametes2, square, geneCount } = result;
  const n = gametes2.length;
  // ขนาดช่องลดลงเมื่อยีนเยอะ
  const cell =
    geneCount >= 3
      ? "h-9 w-12 text-[11px]"
      : geneCount === 2
        ? "h-11 w-14 text-sm"
        : "h-14 w-16 text-base";

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto no-scrollbar">
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              <th className={`${cell} align-middle`}>
                <span className="text-xs text-muted">♀ \ ♂</span>
              </th>
              {gametes2.map((g, i) => (
                <th key={i} className={`${cell}`}>
                  <div className="grid h-full place-items-center rounded-lg bg-brand-600 font-mono font-bold text-white">
                    {g}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gametes1.map((rg, r) => (
              <tr key={r}>
                <th className={`${cell}`}>
                  <div className="grid h-full place-items-center rounded-lg bg-brand-600 font-mono font-bold text-white">
                    {rg}
                  </div>
                </th>
                {square[r].map((g, c) => {
                  const tone = cellTone(g);
                  return (
                    <td key={c} className={`${cell}`}>
                      <div
                        className={`grid h-full place-items-center rounded-lg border border-line ${toneBg[tone]}`}
                      >
                        {renderGenotype(g)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-dom-bg ring-1 ring-dom/30" />
          แสดงลักษณะเด่นครบ
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-rec-bg ring-1 ring-rec/30" />
          ลักษณะด้อยล้วน
        </span>
        <span>ตาราง {n}×{n} = {n * n} ช่อง</span>
      </div>
    </div>
  );
}

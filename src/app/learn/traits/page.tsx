"use client";

import { useState } from "react";
import {
  CATEGORY_LABEL,
  traitsByCategory,
  type TraitCategory,
} from "@/lib/traits";
import { Card } from "@/components/ui";
import Link from "next/link";

const CATS: TraitCategory[] = ["plant", "animal", "human"];
const CAT_EMOJI: Record<TraitCategory, string> = {
  plant: "🌿",
  animal: "🐾",
  human: "🧑",
};

export default function TraitsPage() {
  const [cat, setCat] = useState<TraitCategory>("plant");
  const traits = traitsByCategory(cat);

  return (
    <div className="space-y-4">
      <header>
        <Link href="/learn" className="text-xs font-semibold text-brand-700">
          ← เรียนรู้
        </Link>
        <h1 className="mt-1 text-xl font-extrabold text-ink">
          คลังลักษณะพันธุกรรม
        </h1>
        <p className="text-sm text-muted">
          ลักษณะเด่น–ด้อย พร้อมอักษรประจำยีน ใช้อ้างอิงตอนทำโจทย์
        </p>
      </header>

      {/* เลือกหมวด */}
      <div className="flex gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors ${
              cat === c
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-line bg-surface text-muted"
            }`}
          >
            {CAT_EMOJI[c]} {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas text-xs text-muted">
              <th className="px-3 py-2 text-left font-semibold">ลักษณะ</th>
              <th className="px-2 py-2 text-center font-semibold">ยีน</th>
              <th className="px-2 py-2 text-left font-semibold">เด่น</th>
              <th className="px-2 py-2 text-left font-semibold">ด้อย</th>
            </tr>
          </thead>
          <tbody>
            {traits.map((t) => (
              <tr key={t.id} className="border-b border-line last:border-0">
                <td className="px-3 py-2.5 font-medium text-ink">
                  <span className="mr-1">{t.emoji}</span>
                  {t.name}
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className="font-mono font-bold text-ink">
                    {t.letter.toUpperCase()}
                    <span className="text-muted">{t.letter.toLowerCase()}</span>
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <span className="rounded bg-dom-bg px-1.5 py-0.5 text-xs font-semibold text-dom">
                    {t.dominant}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <span className="rounded bg-rec-bg px-1.5 py-0.5 text-xs font-semibold text-rec">
                    {t.recessive}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="px-1 text-xs text-muted">
        💡 ตัวพิมพ์ใหญ่ = อัลลีลเด่น, ตัวพิมพ์เล็ก = อัลลีลด้อย เช่น{" "}
        <span className="font-mono">Pp</span> = ดอกม่วงพันธุ์ผสม
      </p>
    </div>
  );
}

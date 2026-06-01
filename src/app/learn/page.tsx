import { LinkButton } from "@/components/ui";
import Link from "next/link";

const SECTIONS = [
  {
    href: "/learn/basics",
    emoji: "🧬",
    title: "พื้นฐานพันธุศาสตร์",
    desc: "ยีน อัลลีล เด่น–ด้อย จีโนไทป์ ฟีโนไทป์ พันธุ์แท้–พันธุ์ผสม พร้อมแบบทดสอบสั้น",
  },
  {
    href: "/learn/words",
    emoji: "📝",
    title: "แปลโจทย์เป็นจีโนไทป์",
    desc: "เปลี่ยนคำพูดในโจทย์ให้เป็นยีน เช่น “ดอกม่วงพันธุ์ผสม” → Pp จุดที่นักเรียนพลาดบ่อยที่สุด",
  },
  {
    href: "/learn/traits",
    emoji: "📚",
    title: "คลังลักษณะพันธุกรรม",
    desc: "ตารางลักษณะเด่น–ด้อย แยกพืช สัตว์ มนุษย์ ใช้เปิดดูเวลาทำโจทย์",
  },
  {
    href: "/learn/patterns",
    emoji: "⚡",
    title: "รูปแบบที่พบบ่อย",
    desc: "จำแพตเทิร์น Aa×Aa → 3:1, Aa×aa → 1:1, AA×aa → เด่นหมด ตอบไวไม่ต้องวาดตาราง",
  },
];

export default function LearnPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-extrabold text-ink">เรียนรู้</h1>
        <p className="text-sm text-muted">
          ปูพื้นฐานและฝึกคิดก่อนลงมือทำโจทย์จริง
        </p>
      </header>

      <div className="space-y-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block rounded-2xl border border-line bg-surface p-4 shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50/40 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{s.emoji}</span>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-ink">{s.title}</h2>
                <p className="mt-1 text-xs text-muted">{s.desc}</p>
              </div>
              <span className="text-muted">→</span>
            </div>
          </Link>
        ))}
      </div>

      <LinkButton href="/practice" variant="soft" className="w-full">
        พร้อมแล้ว ไปฝึกทำโจทย์ →
      </LinkButton>
    </div>
  );
}

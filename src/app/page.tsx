import Link from "next/link";
import { Card, LinkButton } from "@/components/ui";

const FEATURES = [
  {
    href: "/learn/basics",
    title: "เรียนพื้นฐาน",
    desc: "ยีน อัลลีล เด่น–ด้อย จีโนไทป์ ฟีโนไทป์ พร้อมแบบทดสอบสั้น",
    emoji: "🧬",
  },
  {
    href: "/learn/words",
    title: "แปลโจทย์เป็นยีน",
    desc: "“ดอกม่วงพันธุ์ผสม” → Pp จุดที่พลาดบ่อยที่สุด",
    emoji: "📝",
  },
  {
    href: "/learn/patterns",
    title: "รูปแบบที่พบบ่อย",
    desc: "จำ Aa×Aa→3:1, Aa×aa→1:1 ตอบไวไม่ต้องวาดตาราง",
    emoji: "⚡",
  },
  {
    href: "/practice",
    title: "ฝึกทำโจทย์",
    desc: "สุ่มโจทย์ ง่าย–กลาง–ยาก ตรวจทันที พร้อมคำใบ้",
    emoji: "✏️",
  },
  {
    href: "/generator",
    title: "สร้างตารางพันเน็ต",
    desc: "กรอกพ่อแม่ ระบบแตกเซลล์สืบพันธุ์และคำนวณให้",
    emoji: "🔲",
  },
  {
    href: "/formula",
    title: "สูตรลัด + Playground",
    desc: "3/4, 1/4, 2ⁿ, 9:3:3:1 เปลี่ยน n แล้วสูตรอัปเดตทันที",
    emoji: "🧮",
  },
];

export default function Home() {
  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="animate-pop rounded-2xl border border-line bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">
          พันธุศาสตร์ ม.3
        </p>
        <h1 className="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">
          ฝึก Punnett Square
          <br />
          ให้คิดเปอร์เซ็นต์ได้จริง
        </h1>
        <p className="mt-2 max-w-md text-sm text-brand-50/90">
          แตกเซลล์สืบพันธุ์ สร้างตาราง คำนวณจีโนไทป์–ฟีโนไทป์
          และใช้สูตรลัด พร้อมโหมดฝึกคิดเร็ว
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <LinkButton href="/practice" variant="outline" className="!text-ink">
            เริ่มฝึกเลย →
          </LinkButton>
          <LinkButton
            href="/generator"
            variant="ghost"
            className="!text-white hover:!bg-white/10"
          >
            ลองสร้างตาราง
          </LinkButton>
        </div>
      </section>

      {/* Quick demo card */}
      <Card className="animate-fade">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">ตัวอย่างเร็ว ๆ</h2>
          <Link
            href="/generator"
            className="text-xs font-semibold text-brand-700"
          >
            เปิดเครื่องคำนวณ →
          </Link>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-canvas p-3">
          <div className="font-mono text-lg font-bold">Aa × Aa</div>
          <div className="text-muted">→</div>
          <div className="flex flex-wrap gap-1.5 text-sm">
            <span className="rounded-md bg-dom-bg px-2 py-0.5 font-semibold text-dom">
              เด่น 75%
            </span>
            <span className="rounded-md bg-rec-bg px-2 py-0.5 font-semibold text-rec">
              ด้อย 25%
            </span>
            <span className="rounded-md bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
              3 : 1
            </span>
          </div>
        </div>
      </Card>

      {/* Feature grid */}
      <section className="grid gap-3 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <Link key={f.href} href={f.href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md group-active:scale-[0.99]">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{f.emoji}</span>
                <div>
                  <h3 className="text-sm font-bold text-ink">{f.title}</h3>
                  <p className="mt-0.5 text-xs text-muted">{f.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </section>

      <p className="px-1 text-center text-xs text-muted">
        เป้าหมาย: เข้าใจตาราง คิด % เป็น มองยีนออก และทำข้อสอบพันธุศาสตร์ได้จริง
      </p>
    </div>
  );
}

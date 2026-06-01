// Pattern Recognition — รูปแบบการผสมที่พบบ่อย จำได้ตอบไว ไม่ต้องวาดตาราง

export interface CrossPattern {
  id: string;
  cross: string; // เช่น "Aa × Aa"
  genoRatio: string; // อัตราส่วนจีโนไทป์
  phenoRatio: string; // อัตราส่วนฟีโนไทป์
  headline: string; // สรุปสั้นจำง่าย
  detail: string; // อธิบายว่าทำไม
  domPercent: number; // % ลักษณะเด่น
  recPercent: number; // % ลักษณะด้อย
}

export const PATTERNS: CrossPattern[] = [
  {
    id: "het-het",
    cross: "Aa × Aa",
    genoRatio: "1 : 2 : 1",
    phenoRatio: "3 : 1",
    headline: "พันธุ์ผสม × พันธุ์ผสม → เด่น 3 : ด้อย 1",
    detail:
      "จีโนไทป์ออกมา 1 AA : 2 Aa : 1 aa เมื่อรวมเด่นเข้าด้วยกัน (AA+Aa) จะได้ฟีโนไทป์เด่น 3 ส่วน ด้อย (aa) 1 ส่วน เป็นรูปแบบคลาสสิกที่ออกสอบบ่อยที่สุด",
    domPercent: 75,
    recPercent: 25,
  },
  {
    id: "het-rec",
    cross: "Aa × aa",
    genoRatio: "1 : 1",
    phenoRatio: "1 : 1",
    headline: "พันธุ์ผสม × ด้อย → เด่นครึ่ง ด้อยครึ่ง",
    detail:
      "ได้ลูก 1 Aa : 1 aa หรือฟีโนไทป์เด่น : ด้อย = 1 : 1 (อย่างละ 50%) เรียกว่า test cross ใช้ตรวจว่าพ่อแม่เป็นพันธุ์แท้หรือผสม",
    domPercent: 50,
    recPercent: 50,
  },
  {
    id: "hom-rec",
    cross: "AA × aa",
    genoRatio: "ทั้งหมดเป็น Aa",
    phenoRatio: "เด่นทั้งหมด",
    headline: "เด่นพันธุ์แท้ × ด้อย → ลูกเด่นหมด (Aa)",
    detail:
      "ลูกรุ่น F1 ได้อัลลีลเด่นจากพ่อแม่ฝั่งหนึ่งและด้อยจากอีกฝั่ง จึงเป็น Aa ทุกตัว แสดงลักษณะเด่นทั้งหมด 100%",
    domPercent: 100,
    recPercent: 0,
  },
  {
    id: "hom-het",
    cross: "AA × Aa",
    genoRatio: "1 : 1 (AA : Aa)",
    phenoRatio: "เด่นทั้งหมด",
    headline: "เด่นพันธุ์แท้ × พันธุ์ผสม → เด่นหมด",
    detail:
      "ได้ 1 AA : 1 Aa แต่ทั้งคู่แสดงลักษณะเด่น จึงเป็นเด่น 100% ไม่มีลูกด้อยเลย",
    domPercent: 100,
    recPercent: 0,
  },
  {
    id: "rec-rec",
    cross: "aa × aa",
    genoRatio: "ทั้งหมดเป็น aa",
    phenoRatio: "ด้อยทั้งหมด",
    headline: "ด้อย × ด้อย → ลูกด้อยหมด",
    detail:
      "ไม่มีอัลลีลเด่นเลย ลูกจึงเป็น aa ทุกตัว แสดงลักษณะด้อย 100%",
    domPercent: 0,
    recPercent: 100,
  },
  {
    id: "hom-hom",
    cross: "AA × AA",
    genoRatio: "ทั้งหมดเป็น AA",
    phenoRatio: "เด่นทั้งหมด",
    headline: "เด่นพันธุ์แท้ × เด่นพันธุ์แท้ → เด่นแท้หมด",
    detail: "ลูกได้อัลลีลเด่นจากทั้งสองฝ่าย เป็น AA ทุกตัว แสดงลักษณะเด่น 100%",
    domPercent: 100,
    recPercent: 0,
  },
];

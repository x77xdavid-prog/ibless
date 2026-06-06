/* =====================================================================
   아이블레스 가맹 사업설명회 — PPTX 생성기 (pptxgenjs)
   HTML 덱(사업설명회.html)과 동일한 14장 구성. 9번 = 교육과정(5과정) 슬라이드.
   실행: node make.js  →  ../사업설명회.pptx
   ===================================================================== */
const Pptx = require("pptxgenjs");
const p = new Pptx();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
p.author = "iBless";
p.company = "아이블레스";
p.title = "아이블레스 가맹 사업설명회";

const W = 13.333, MX = 0.85, CW = W - MX * 2; // content width
const FONT = "Malgun Gothic";

const C = {
  primary: "FF7A00", primaryDark: "CF6300", primarySoft: "FFF2E6",
  sky: "00B8E4", skyDark: "0094B8",
  yellow: "FECA0A",
  ink: "151515", body: "494B4A", muted: "6B6B6B", line: "E7E7E7",
  white: "FFFFFF",
  dark: "12141B", darkCard: "20232E", darkLine: "33384A",
  lightTint: "FBF7F2",
};

/* ---------- helpers ---------- */
function slide(theme) {
  const s = p.addSlide();
  s.background = { color: theme === "dark" ? C.dark : C.white };
  if (theme === "dark") {
    // 은은한 보라 글로우
    s.addShape("ellipse", { x: 8.7, y: -2.4, w: 6.5, h: 6.5, fill: { color: "2A2350", transparency: 55 }, line: { type: "none" } });
  } else {
    // 상단 옅은 브랜드 틴트 바
    s.addShape("rect", { x: 0, y: 0, w: W, h: 0.16, fill: { color: C.primary }, line: { type: "none" } });
  }
  return s;
}
function eyebrow(s, text, theme) {
  s.addText(text.toUpperCase(), {
    x: MX, y: 0.62, w: CW, h: 0.4, fontFace: FONT, bold: true, fontSize: 11,
    color: theme === "dark" ? C.yellow : C.primary, charSpacing: 2,
  });
}
function title(s, runs, theme, y = 1.05) {
  s.addText(runs.map(r => ({ text: r.t, options: { bold: true, color: r.em ? (theme === "dark" ? C.yellow : C.primary) : (theme === "dark" ? C.white : C.ink) } })),
    { x: MX, y, w: CW, h: 1.2, fontFace: FONT, fontSize: 32, lineSpacingMultiple: 1.05 });
}
function lead(s, text, theme, y = 2.3, h = 0.9) {
  s.addText(text, { x: MX, y, w: CW, h, fontFace: FONT, fontSize: 16,
    color: theme === "dark" ? "D7D7E0" : C.body, lineSpacingMultiple: 1.3, valign: "top" });
}
function note(s, runs, theme, y = 6.7) {
  s.addText(Array.isArray(runs) ? runs.map(r => ({ text: r.t, options: { bold: !!r.b, color: r.c || (theme === "dark" ? "9A9AB0" : C.muted) } })) : runs,
    { x: MX, y, w: CW, h: 0.6, fontFace: FONT, fontSize: 11.5,
      color: theme === "dark" ? "9A9AB0" : C.muted, lineSpacingMultiple: 1.2, valign: "top" });
}
// 카드 그리드: items = [{tag,tagColor,n,h4,p}]
function cards(s, items, { cols, y, h, theme, gap = 0.28 }) {
  const cw = (CW - gap * (cols - 1)) / cols;
  items.forEach((it, i) => {
    const col = i % cols, rowGap = 0.28;
    const row = Math.floor(i / cols);
    const cx = MX + col * (cw + gap);
    const cy = y + row * (h + rowGap);
    s.addShape("roundRect", { x: cx, y: cy, w: cw, h, rectRadius: 0.09,
      fill: { color: theme === "dark" ? C.darkCard : C.white },
      line: { color: theme === "dark" ? C.darkLine : C.line, width: 1 },
      shadow: theme === "dark" ? undefined : { type: "outer", blur: 8, offset: 2, angle: 90, color: "BFBFBF", opacity: 0.35 } });
    let ty = cy + 0.22;
    const pad = 0.26;
    if (it.tag) {
      s.addText(it.tag, { x: cx + pad, y: ty, w: cw - pad * 2, h: 0.34, fontFace: FONT, bold: true, fontSize: 10.5,
        color: C.white, fill: { color: it.tagColor || C.primary }, align: "center", rectRadius: 0.17, shape: "roundRect", valign: "middle" });
      ty += 0.5;
    }
    if (it.n) {
      s.addText(it.n, { x: cx + pad, y: ty, w: cw - pad * 2, h: 0.4, fontFace: FONT, bold: true, fontSize: 19,
        color: theme === "dark" ? C.yellow : C.primary });
      ty += 0.5;
    }
    if (it.h4) {
      s.addText(it.h4, { x: cx + pad, y: ty, w: cw - pad * 2, h: 0.4, fontFace: FONT, bold: true, fontSize: 14.5,
        color: theme === "dark" ? C.white : C.ink });
      ty += 0.46;
    }
    if (it.cefr) {
      s.addText(it.cefr, { x: cx + pad, y: ty, w: cw - pad * 2, h: 0.3, fontFace: FONT, bold: true, fontSize: 10.5,
        color: theme === "dark" ? C.yellow : C.skyDark });
      ty += 0.36;
    }
    if (it.p) {
      s.addText(it.p.map(r => ({ text: r.t, options: { bold: !!r.b, color: r.b ? (theme === "dark" ? C.white : C.ink) : (theme === "dark" ? "C7C7D4" : C.body), breakLine: !!r.br } })),
        { x: cx + pad, y: ty, w: cw - pad * 2, h: cy + h - ty - 0.18, fontFace: FONT, fontSize: 11.5, lineSpacingMultiple: 1.18, valign: "top" });
    }
  });
}
// 체크 불릿
function bullets(s, items, theme, y = 2.4) {
  items.forEach((t, i) => {
    const by = y + i * 0.72;
    s.addText("✓", { x: MX, y: by, w: 0.45, h: 0.45, fontFace: FONT, bold: true, fontSize: 13, color: C.white,
      fill: { color: theme === "dark" ? C.yellow : C.primary }, shape: "ellipse", align: "center", valign: "middle" });
    s.addText(t.map(r => ({ text: r.t, options: { bold: !!r.b, color: r.b ? (theme === "dark" ? C.white : C.ink) : (theme === "dark" ? "D7D7E0" : C.body) } })),
      { x: MX + 0.6, y: by - 0.05, w: CW - 0.6, h: 0.55, fontFace: FONT, fontSize: 15, valign: "middle", lineSpacingMultiple: 1.1 });
  });
}
// 스탯 행
function stats(s, items, theme, y = 2.5) {
  const cw = CW / items.length;
  items.forEach((it, i) => {
    const cx = MX + i * cw;
    s.addText(it.b, { x: cx, y, w: cw - 0.3, h: 0.9, fontFace: FONT, bold: true, fontSize: 38, color: theme === "dark" ? C.yellow : C.primary });
    s.addText(it.s, { x: cx, y: y + 0.95, w: cw - 0.3, h: 0.8, fontFace: FONT, fontSize: 12, color: theme === "dark" ? "B7B7C6" : C.muted, lineSpacingMultiple: 1.15, valign: "top" });
  });
}
// 흐름(플로우) 칩
function flow(s, steps, theme, y) {
  const chipH = 0.5, gap = 0.18;
  let cx = MX;
  steps.forEach((t, i) => {
    const w = 0.55 + t.length * 0.135 + 0.5;
    s.addText([{ text: String(i + 1).padStart(2, "0") + " ", options: { bold: true, color: theme === "dark" ? C.yellow : C.primary } }, { text: t, options: { bold: true, color: theme === "dark" ? C.white : C.ink } }],
      { x: cx, y, w, h: chipH, fontFace: FONT, fontSize: 11.5, align: "center", valign: "middle",
        fill: { color: theme === "dark" ? C.darkCard : C.primarySoft }, line: { color: theme === "dark" ? C.darkLine : C.line, width: 1 }, rectRadius: 0.25, shape: "roundRect" });
    cx += w + gap;
    if (i < steps.length - 1) { s.addText("›", { x: cx - 0.02, y, w: 0.16, h: chipH, fontFace: FONT, fontSize: 13, color: C.muted, align: "center", valign: "middle" }); cx += 0.16; }
  });
}
function brandRow(s, y, theme, center) {
  s.addText([{ text: "iBless", options: { bold: true, color: theme === "dark" ? C.white : C.primary } }, { text: "  아이블레스", options: { color: theme === "dark" ? "9A9AB0" : C.muted, fontSize: 12 } }],
    { x: MX, y, w: CW, h: 0.5, fontFace: FONT, fontSize: 22, align: center ? "center" : "left" });
}

/* ===================== 1. 표지 ===================== */
{ const s = slide("dark");
  brandRow(s, 1.5, "dark");
  s.addText("가맹 사업설명회 · FRANCHISE BRIEFING", { x: MX, y: 2.15, w: CW, h: 0.4, fontFace: FONT, bold: true, fontSize: 12, color: C.yellow, charSpacing: 2 });
  s.addText([{ text: "스스로 자라는\n영어 습관을 만드는\n", options: { color: C.white } }, { text: "검증된 교육 시스템", options: { color: C.yellow } }],
    { x: MX, y: 2.6, w: CW, h: 2.6, fontFace: FONT, bold: true, fontSize: 44, lineSpacingMultiple: 1.05 });
  s.addText("동기과학(자기결정이론)으로 설계한 아동 영어 교육 — 함께 시작하세요.",
    { x: MX, y: 5.4, w: CW, h: 0.6, fontFace: FONT, fontSize: 16, color: "D7D7E0" });
}
// remove duplicate eyebrow from cover (we added a custom one); harmless if both — but clean: re-add cover without helper eyebrow
// (helper eyebrow already placed "가맹 사업설명회..." at y0.62; keep one — delete by not worrying; both readable)

/* ===================== 2. 시장·기회 ===================== */
{ const s = slide("light");
  eyebrow(s, "왜 지금인가", "light");
  title(s, [{ t: "커지는 " }, { t: "사교육·영어 시장", em: true }], "light");
  lead(s, "학령인구는 줄어도 사교육 지출과 참여율은 매년 증가합니다. 검증된 시스템을 가진 브랜드의 기회입니다.", "light", 2.25, 0.8);
  stats(s, [
    { b: "29.2조원", s: "2024 초·중·고 사교육비 총액 (전년比 +7.7%)" },
    { b: "80.0%", s: "전체 사교육 참여율 (초등 87.7%)" },
    { b: "47.4만원", s: "학생 1인당 월평균 사교육비" },
  ], "light", 3.5);
  note(s, "출처: 통계청 「2024년 초중고사교육비조사」(2025 발표). 영유아 영어학원비도 ’20년 대비 약 +35% 상승.", "light");
}

/* ===================== 3. 문제 ===================== */
{ const s = slide("light");
  eyebrow(s, "학부모의 고민", "light");
  title(s, [{ t: "학년이 같아도 " }, { t: "실력은 다릅니다", em: true }], "light");
  bullets(s, [
    [{ t: "학년 일괄 진도 → 뒤처진 아이는 포기, 앞선 아이는 지루함" }],
    [{ t: "점수·등수 비교 → 영어가 싫어지는 아이들" }],
    [{ t: "“왜 배우는지” 모른 채 시키니 " }, { t: "스스로 하지 않음", b: true }],
  ], "light", 2.6);
  lead(s, "필요한 건 실력에서 출발하고 스스로 하게 만드는 설계입니다.", "light", 5.1, 0.7);
}

/* ===================== 4. 솔루션 ===================== */
{ const s = slide("light");
  eyebrow(s, "솔루션", "light");
  title(s, [{ t: "아이블레스 = " }, { t: "실력에서 출발하는 1:1 맞춤", em: true }], "light");
  cards(s, [
    { h4: "정확한 레벨 진단", p: [{ t: "세분화된 레벨에서 지금 실력의 위치를 과학적으로 측정" }] },
    { h4: "1:1 맞춤 학습", p: [{ t: "현재 실력에 꼭 맞는 교재·코칭으로 자신감부터" }] },
    { h4: "4대 영역 통합", p: [{ t: "듣기·읽기·말하기·쓰기를 균형 있게" }] },
    { h4: "블렌디드 러닝", p: [{ t: "오프라인 수업 + 온라인 복습·앱" }] },
  ], { cols: 2, y: 2.55, h: 1.85, theme: "light" });
}

/* ===================== 5. 차별점: SDT ===================== */
{ const s = slide("dark");
  eyebrow(s, "핵심 차별점", "dark");
  s.addText([{ text: "동기과학", options: { color: C.yellow } }, { text: "으로 설계한 교육", options: { color: C.white } }],
    { x: MX, y: 1.0, w: CW, h: 0.7, fontFace: FONT, bold: true, fontSize: 32 });
  s.addText("자기결정이론(SDT) · 6개 미니이론 기반", { x: MX, y: 1.66, w: CW, h: 0.4, fontFace: FONT, fontSize: 14, color: "B7B7C6" });
  cards(s, [
    { n: "CET", h4: "인지평가이론", p: [{ t: "점수 비교 대신 과정·전략 칭찬" }] },
    { n: "OIT", h4: "유기적통합이론", p: [{ t: "외적 보상→내적 동기로 내면화" }] },
    { n: "COT", h4: "인과지향성이론", p: [{ t: "선택권으로 자기주도 성향 강화" }] },
    { n: "BPNT", h4: "기본심리욕구", p: [{ t: "자율성·유능감·관계성 충족" }] },
    { n: "GCT", h4: "목표내용이론", p: [{ t: "“할 수 있게 되는” 내재적 목표" }] },
    { n: "RMT", h4: "관계동기이론", p: [{ t: "1:1 유대 + 또래 커뮤니티" }] },
  ], { cols: 3, y: 2.3, h: 1.78, theme: "dark" });
  note(s, [{ t: "경쟁사가 따라 할 수 없는, " }, { t: "이론에 근거한 교육 설계", b: true, c: C.white }, { t: "가 브랜드의 해자입니다." }], "dark", 6.75);
}

/* ===================== 6. 교육 프로그램: 3대 욕구 ===================== */
{ const s = slide("light");
  eyebrow(s, "교육 프로그램", "light");
  title(s, [{ t: "아이를 " }, { t: "스스로 움직이게", em: true }, { t: " 하는 3가지" }], "light");
  cards(s, [
    { tag: "자율성", tagColor: C.primary, h4: "내가 선택해서 한다", p: [{ t: "오늘의 목표 스스로 정하기, 학습 메뉴 선택권, 난이도 자기조절" }] },
    { tag: "유능감", tagColor: C.sky, h4: "점점 잘하고 있어", p: [{ t: "정밀 레벨링으로 잦은 성공, 약점 집중, 정보적 피드백 리포트" }] },
    { tag: "관계성", tagColor: C.yellow, h4: "연결되어 있어", p: [{ t: "1:1 코칭 유대, 또래 챌린지, 학부모 알림" }] },
  ], { cols: 3, y: 2.55, h: 2.3, theme: "light" });
  note(s, [{ t: "포인트 보상은 " }, { t: "“성취 인정”", b: true, c: C.ink }, { t: "으로 설계 — 비교·등수 대신 내 성장 기록(CET·OIT)." }], "light");
}

/* ===================== 7. 학습 시스템 ===================== */
{ const s = slide("light");
  eyebrow(s, "학습 시스템", "light");
  title(s, [{ t: "매일 굴러가는 " }, { t: "하루 영어 습관", em: true }], "light");
  flow(s, ["목표 확인", "자기주도 학습", "1:1 코칭", "약점 보충", "점검·피드백", "온라인 복습"], "light", 2.45);
  cards(s, [
    { h4: "정밀 레벨링", p: [{ t: "딱 맞는 단계에서 출발" }] },
    { h4: "4대 영역 통합", p: [{ t: "L·R·S·W 균형" }] },
    { h4: "학습 콘텐츠", p: [{ t: "영상·이러닝·워크북·리딩" }] },
    { h4: "학습 앱", p: [{ t: "단어·복습 알림·리포트" }] },
  ], { cols: 4, y: 3.4, h: 1.7, theme: "light" });
}

/* ===================== 8. 커리큘럼·평가 ===================== */
{ const s = slide("light");
  eyebrow(s, "커리큘럼 · 평가", "light");
  title(s, [{ t: "유아부터 고등까지 " }, { t: "단계별 로드맵", em: true }], "light");
  cards(s, [
    { tag: "STEP 1", tagColor: C.sky, h4: "Phonics", p: [{ t: "유치원~초등 저 · Junior 진단" }] },
    { tag: "STEP 2", tagColor: C.sky, h4: "Basic", p: [{ t: "초등 · JET 3~6" }] },
    { tag: "STEP 3", tagColor: C.sky, h4: "Master", p: [{ t: "초등 고~중등 · JET 1·2/Bridge" }] },
    { tag: "STEP 4", tagColor: C.sky, h4: "Advanced", p: [{ t: "중등~고등 · TOEIC/iBT" }] },
  ], { cols: 4, y: 2.55, h: 2.0, theme: "light" });
  note(s, [{ t: "공인시험은 " }, { t: "성장 확인 도구", b: true, c: C.ink }, { t: " — 단계별 목표로 객관적 검증(GCT)." }], "light");
}

/* ===================== 9. ★ 교육과정: 대상별 5과정 (NEW) ===================== */
{ const s = slide("dark");
  eyebrow(s, "교육과정", "dark");
  s.addText([{ text: "대상별 ", options: { color: C.white } }, { text: "5과정", options: { color: C.yellow } }, { text: ", 연구로 설계한 깊이", options: { color: C.white } }],
    { x: MX, y: 1.05, w: CW, h: 0.8, fontFace: FONT, bold: true, fontSize: 32 });
  cards(s, [
    { tag: "유아", tagColor: "00B8E4", h4: "만 3~7세", cefr: "Pre-A1 → A1", p: [{ t: "놀이·노래·TPR로 소리부터, 침묵기 존중", br: true }, { t: "Phonics", b: true }, { t: " · Junior 진단" }] },
    { tag: "초등", tagColor: "FF7A00", h4: "초1~6", cefr: "Pre-A1 → A2", p: [{ t: "듣기·말하기 → 체계적 파닉스·다독", br: true }, { t: "Phonics·Basic", b: true }, { t: " · JET 3~6" }] },
    { tag: "중등", tagColor: "6C5CE7", h4: "중1~3", cefr: "A2 → B1", p: [{ t: "학업영어(CALP) 도약·과제+인출", br: true }, { t: "Master", b: true }, { t: " · JET 1·2/Bridge" }] },
    { tag: "고등", tagColor: "12998A", h4: "고1~3", cefr: "B1 → B2+", p: [{ t: "학문영어·비판적 읽기·에세이·시험", br: true }, { t: "Advanced", b: true }, { t: " · 수능/TOEIC/iBT" }] },
    { tag: "가족", tagColor: "FF5D8F", h4: "아동+학부모", cefr: "Pre-A1 → A2", p: [{ t: "가정 루틴·대화식 읽기로 학습 확장", br: true }, { t: "가정 연계", b: true }, { t: " 블렌디드" }] },
  ], { cols: 5, y: 2.3, h: 3.0, theme: "dark", gap: 0.22 });
  note(s, [{ t: "각 과정은 " }, { t: "단계 · 예시 차시(레슨플랜) · 진단 · 교재 매핑", b: true, c: C.white }, { t: "까지 설계 — Krashen·과학적 읽기·다독·인출/간격반복·SDT 근거. 경쟁사가 따라 하기 힘든 교육 설계의 해자입니다." }], "dark", 5.75);
}

/* ===================== 10. 리텐션 ===================== */
{ const s = slide("light");
  eyebrow(s, "동기 · 리텐션", "light");
  title(s, [{ t: "계속 다니게 하는 " }, { t: "보상 설계", em: true }], "light");
  lead(s, "iBless 포인트로 성취를 인정하고, 스토어에서 교환. 처음엔 외적 동기로 시작해 “잘하고 싶은 마음”으로 내면화되도록 설계합니다(OIT).", "light", 2.25, 0.9);
  bullets(s, [
    [{ t: "학습 앱 복습 알림 → 잊을 때쯤 다시" }],
    [{ t: "학부모 리포트·알림 → 가정의 신뢰·재등록" }],
    [{ t: "또래 챌린지 → 지속의 즐거움" }],
  ], "light", 3.5);
}

/* ===================== 11. 가맹 강점 ===================== */
{ const s = slide("dark");
  eyebrow(s, "가맹 강점", "dark");
  title(s, [{ t: "검증된 시스템을 " }, { t: "그대로", em: true }], "dark");
  cards(s, [
    { n: "01", h4: "검증된 커리큘럼", p: [{ t: "레벨링·4대영역·공인시험 연계" }] },
    { n: "02", h4: "교재·콘텐츠", p: [{ t: "단계별 자체 개발 교재·앱" }] },
    { n: "03", h4: "평가 시스템", p: [{ t: "진단·리포트·수료 인증" }] },
    { n: "04", h4: "운영 매뉴얼", p: [{ t: "본사 직영 노하우 전수" }] },
  ], { cols: 4, y: 2.7, h: 2.1, theme: "dark" });
}

/* ===================== 12. 가맹 지원 + 절차 ===================== */
{ const s = slide("dark");
  eyebrow(s, "가맹 지원 · 절차", "dark");
  title(s, [{ t: "오픈부터 운영까지 " }, { t: "함께", em: true }], "dark");
  cards(s, [
    { h4: "오픈 지원", p: [{ t: "상권분석·인테리어 가이드" }] },
    { h4: "강사 교육", p: [{ t: "교수법·시스템 교육" }] },
    { h4: "마케팅", p: [{ t: "브랜드·지역 홍보 지원" }] },
    { h4: "슈퍼바이징", p: [{ t: "정기 운영 컨설팅" }] },
  ], { cols: 4, y: 2.5, h: 1.7, theme: "dark" });
  flow(s, ["가맹 문의", "상담·설명", "상권 분석", "계약", "교육", "오픈"], "dark", 4.65);
}

/* ===================== 13. 수익 모델 ===================== */
{ const s = slide("light");
  s.addText([{ text: "수익 모델 ", options: { bold: true, color: C.primary } }, { text: "(예시 · 실제 값으로 교체)", options: { bold: true, color: C.primary } }],
    { x: MX, y: 0.62, w: CW, h: 0.4, fontFace: FONT, fontSize: 11, charSpacing: 2 });
  title(s, [{ t: "안정적인 " }, { t: "교육 사업", em: true }], "light");
  cards(s, [
    { h4: "초기 개설 비용", p: [{ t: "가맹비 + 교육·오픈 지원 + 인테리어 + 초도물품", br: true }, { t: "예시: 총 OO,OOO만원", b: true }] },
    { h4: "월 수익 구조", p: [{ t: "재원생 × 수강료 − 운영비(임대·인건비·로열티)", br: true }, { t: "예시: 재원 OO명 기준", b: true }] },
    { h4: "로열티·정책", p: [{ t: "월 매출의 ", }, { t: "예시 O%", b: true }, { t: " 또는 정액", br: true }, { t: "계약 조건은 정보공개서 기준" }] },
  ], { cols: 3, y: 2.55, h: 2.2, theme: "light" });
  note(s, [{ t: "⚠️ 위 수치는 " }, { t: "예시", b: true, c: C.ink }, { t: "입니다. 실제 비용·수익은 " }, { t: "가맹사업법 정보공개서", b: true, c: C.ink }, { t: " 기준으로 확정해 과장 없이 안내하세요." }], "light");
}

/* ===================== 14. 클로징 ===================== */
{ const s = slide("dark");
  brandRow(s, 1.7, "dark", true);
  s.addText([{ text: "검증된 교육으로,\n", options: { color: C.white } }, { text: "함께 성장", options: { color: C.yellow } }, { text: "하시겠어요?", options: { color: C.white } }],
    { x: MX, y: 2.5, w: CW, h: 1.8, fontFace: FONT, bold: true, fontSize: 38, align: "center", lineSpacingMultiple: 1.1 });
  s.addText("지금 가맹 상담을 신청하세요. 자세한 사업 안내를 드립니다.",
    { x: MX, y: 4.4, w: CW, h: 0.5, fontFace: FONT, fontSize: 16, color: "D7D7E0", align: "center" });
  s.addText("가맹 문의하기", { x: 4.4, y: 5.15, w: 2.2, h: 0.62, fontFace: FONT, bold: true, fontSize: 14, color: C.white,
    fill: { color: C.primary }, align: "center", valign: "middle", rectRadius: 0.31, shape: "roundRect" });
  s.addText("홈페이지 보기", { x: 6.75, y: 5.15, w: 2.2, h: 0.62, fontFace: FONT, bold: true, fontSize: 14, color: C.white,
    line: { color: "FFFFFF", width: 1.5, transparency: 40 }, align: "center", valign: "middle", rectRadius: 0.31, shape: "roundRect" });
  s.addText("문의 {전화 / 이메일} · 인천 송도 본사", { x: MX, y: 6.3, w: CW, h: 0.4, fontFace: FONT, fontSize: 11.5, color: "9A9AB0", align: "center" });
}

p.writeFile({ fileName: "../사업설명회.pptx" }).then(f => console.log("WROTE", f));

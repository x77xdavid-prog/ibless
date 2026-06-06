/* =====================================================================
   아이블레스 — 상담/무료 레벨테스트 신청 폼
   클라이언트 검증 + 완료 안내(UI). 제출 백엔드는 미연동(TODO).
   ===================================================================== */
(() => {
  "use strict";
  const form = document.getElementById("leveltestForm");
  if (!form) return;
  const success = document.getElementById("signupSuccess");

  const fieldIds = ["f-name", "f-grade", "f-phone", "f-agree"];

  const setErr = (id, msg) => {
    const small = form.querySelector(`.err[data-for="${id}"]`);
    const el = document.getElementById(id);
    if (small) small.textContent = msg || "";
    if (el) el.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  const phoneOk = (v) => /^01[016789]-?\d{3,4}-?\d{4}$/.test(v.replace(/\s/g, ""));

  // 전화번호 자동 하이픈
  const phoneEl = document.getElementById("f-phone");
  if (phoneEl) {
    phoneEl.addEventListener("input", () => {
      let d = phoneEl.value.replace(/\D/g, "").slice(0, 11);
      if (d.length >= 8) d = d.replace(/(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
      else if (d.length >= 4) d = d.replace(/(\d{3})(\d+)/, "$1-$2");
      phoneEl.value = d;
    });
  }

  // 입력/변경 시 해당 에러 해제
  fieldIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    ["input", "change"].forEach((ev) => el.addEventListener(ev, () => setErr(id, "")));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    const name = document.getElementById("f-name").value.trim();
    const grade = document.getElementById("f-grade").value;
    const phone = document.getElementById("f-phone").value.trim();
    const agree = document.getElementById("f-agree").checked;

    fieldIds.forEach((id) => setErr(id, ""));

    if (!name) { setErr("f-name", "학생 이름을 입력해 주세요."); ok = false; }
    if (!grade) { setErr("f-grade", "학년을 선택해 주세요."); ok = false; }
    if (!phone) { setErr("f-phone", "연락처를 입력해 주세요."); ok = false; }
    else if (!phoneOk(phone)) { setErr("f-phone", "올바른 휴대폰 번호 형식이 아닙니다."); ok = false; }
    if (!agree) { setErr("f-agree", "개인정보 수집·이용에 동의해 주세요."); ok = false; }

    if (!ok) {
      const firstErr = form.querySelector('[aria-invalid="true"]');
      if (firstErr) firstErr.focus();
      return;
    }

    // 제출 저장 (localStorage) — 정적 사이트용 보관. 내역은 상담신청내역.html 에서 확인.
    // ⚠️ localStorage 는 브라우저(기기)별로 분리됨 → 실제 리드 수집은 백엔드 연동 필요.
    try {
      const submission = {
        name: name,
        grade: grade,
        phone: phone,
        campus: (document.getElementById("f-campus") || {}).value || "",
        time: (document.getElementById("f-time") || {}).value || "",
        message: (document.getElementById("f-msg") || {}).value || "",
        ts: new Date().toISOString(),
      };
      const KEY = "ibless.submissions";
      const list = JSON.parse(localStorage.getItem(KEY) || "[]");
      list.push(submission);
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (err) { /* localStorage 비활성 환경 무시 */ }

    // TODO(백엔드): 여기서 Formspree/구글폼/CRM/구글시트로 전송.
    // 예) fetch("https://formspree.io/f/{ID}", { method:"POST", body: new FormData(form) })
    // inline style.display 로 숨김 (.signup-inner 의 display:grid 가 [hidden] 속성을 덮어쓰므로)
    const inner = form.closest(".signup-inner");
    if (inner) inner.style.display = "none";
    else form.hidden = true;
    if (success) {
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
      success.focus({ preventScroll: true });
    }
  });
})();

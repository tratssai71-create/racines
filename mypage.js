// ==============================================
// ご予約の確認・キャンセル ページ ロジック
// ログイン機能の代わりに、メールアドレスによる本人確認のみで
// 自分の予約一覧の閲覧・キャンセルができるようにしたもの。
// ==============================================

(() => {
  const CFG = SALON_CONFIG;
  const isDemo = !CFG.API_URL;
  const DOW_JA = ["日", "月", "火", "水", "木", "金", "土"];
  const LOOKUP_EMAIL_KEY = "salon_mypage_email";

  const $demoBanner = document.getElementById("demoBanner");
  const $salonName = document.getElementById("salonName");
  const $salonMeta = document.getElementById("salonMeta");
  const $salonFooterMeta = document.getElementById("salonFooterMeta");
  const $lookupEmail = document.getElementById("lookupEmail");
  const $lookupBtn = document.getElementById("lookupBtn");
  const $resultArea = document.getElementById("resultArea");

  async function loadRuntimeConfig() {
    if (isDemo) return;
    try {
      const res = await fetch(`${CFG.API_URL}?action=getConfig`);
      const json = await res.json();
      if (json.success) Object.assign(CFG, json.config);
    } catch (e) {
      console.error("設定の取得に失敗しました", e);
    }
  }

  function renderHeader() {
    document.title = `ご予約の確認・キャンセル | ${CFG.salonName}`;
    $salonName.textContent = CFG.salonName;
    $salonMeta.textContent = `${CFG.address}　TEL ${CFG.tel}`;
    $salonFooterMeta.textContent = `${CFG.salonName}　${CFG.address}　TEL ${CFG.tel}`;
    if (isDemo) $demoBanner.style.display = "block";
  }

  function pad2(n) { return String(n).padStart(2, "0"); }
  function fmtDateTime(d) {
    return `${d.getMonth() + 1}/${d.getDate()}（${DOW_JA[d.getDay()]}）${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  // ---------- 予約データ取得（本番はGAS、デモはlocalStorage） ----------
  function loadDemoReservations() {
    try {
      return JSON.parse(localStorage.getItem("demo_reservations") || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveDemoReservations(list) {
    localStorage.setItem("demo_reservations", JSON.stringify(list));
  }

  async function fetchMyReservations(email) {
    if (isDemo) {
      const emailLower = email.toLowerCase();
      return loadDemoReservations()
        .filter((r) => (r.email || "").toLowerCase() === emailLower)
        .map((r) => {
          const start = new Date(`${r.date}T${r.time}:00`);
          const end = new Date(start.getTime() + (r.durationMin || 60) * 60 * 1000);
          return { eventId: r.reservationId, title: `【予約】${r.menuName}`, start: start.toISOString(), end: end.toISOString() };
        });
    }
    const url = `${CFG.API_URL}?action=getMyReservations&email=${encodeURIComponent(email)}`;
    const res = await fetch(url);
    const json = await res.json();
    return json.success ? json.reservations : [];
  }

  async function cancelMyReservation(eventId, email) {
    if (isDemo) {
      const list = loadDemoReservations().filter((r) => r.reservationId !== eventId);
      saveDemoReservations(list);
      return { success: true };
    }
    const res = await fetch(CFG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "cancelMyReservation", eventId, email }),
    });
    return res.json();
  }

  // ---------- 表示 ----------
  function renderList(items, mode) {
    if (items.length === 0) {
      return `<p class="empty-msg">${mode === "upcoming" ? "今後のご予約はありません" : "過去のご予約履歴はありません"}</p>`;
    }
    return `
      <ul class="history-list">
        ${items.map((r) => `
          <li class="history-item">
            <div class="history-item__main">
              <span class="history-item__date">${fmtDateTime(new Date(r.start))}〜</span>
              <span class="history-item__title">${r.title}${r.status === "pending" ? '　<span style="color:var(--ac-d);">（承認待ち）</span>' : ""}</span>
            </div>
            ${mode === "upcoming" ? `<button class="btn btn-small btn-danger" data-id="${r.eventId}">キャンセル</button>` : ""}
          </li>
        `).join("")}
      </ul>
    `;
  }

  async function doLookup() {
    const email = $lookupEmail.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.getElementById("f-lookupEmail").classList.toggle("invalid", !emailOk);
    if (!emailOk) return;

    try {
      localStorage.setItem(LOOKUP_EMAIL_KEY, email);
    } catch (e) { /* 無視 */ }

    $lookupBtn.disabled = true;
    $lookupBtn.textContent = "確認中…";
    $resultArea.innerHTML = `<div class="loading">読み込み中…</div>`;

    try {
      const reservations = await fetchMyReservations(email);
      const now = new Date();
      const upcoming = reservations.filter((r) => new Date(r.start) >= now);
      const past = reservations.filter((r) => new Date(r.start) < now).reverse();

      $resultArea.innerHTML = `
        <h2 style="margin-top:28px;">今後のご予約</h2>
        ${renderList(upcoming, "upcoming")}
        <h2 style="margin-top:28px;">ご予約履歴</h2>
        ${renderList(past, "history")}
      `;

      $resultArea.querySelectorAll("[data-id]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("この予約をキャンセルしますか？")) return;
          btn.disabled = true;
          btn.textContent = "キャンセル中…";
          const r = await cancelMyReservation(btn.dataset.id, email);
          if (r.success) {
            doLookup();
          } else {
            alert("キャンセルに失敗しました。時間をおいて再度お試しください。");
            btn.disabled = false;
            btn.textContent = "キャンセル";
          }
        });
      });
    } catch (e) {
      $resultArea.innerHTML = `<p class="empty-msg">読み込みに失敗しました</p>`;
    }
    $lookupBtn.disabled = false;
    $lookupBtn.textContent = "予約を確認する";
  }

  $lookupBtn.addEventListener("click", doLookup);
  $lookupEmail.addEventListener("keydown", (e) => { if (e.key === "Enter") doLookup(); });

  (async () => {
    await loadRuntimeConfig();
    renderHeader();
    try {
      const savedEmail = localStorage.getItem(LOOKUP_EMAIL_KEY) || (JSON.parse(localStorage.getItem("salon_customer_profile") || "null") || {}).email;
      if (savedEmail) {
        $lookupEmail.value = savedEmail;
        doLookup();
      }
    } catch (e) { /* 無視 */ }
  })();
})();

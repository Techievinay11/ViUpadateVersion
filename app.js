/* =========================================================
   Visuya – app.js  |  All interactive functionality
   ========================================================= */

// ──────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────

const CARDS_DATA = [
  {
    name: "Sapphire Preferred® Card",
    bank: "Chase Bank",
    logo: "CHASE",
    bg: "card-bg-1",
    rating: 4.8,
    badge: "Best for Travel",
    desc: "60,000 bonus points after you spend $4,000 in the first 3 months.",
    fee: "$95",
    stars: 5
  },
  {
    name: "American Express® Gold Card",
    bank: "American Express",
    logo: "AMEX",
    bg: "card-bg-2",
    rating: 4.7,
    badge: "Best for Dining",
    desc: "60,000 Membership Rewards® after you spend $6,000 in the first 6 months.",
    fee: "$250",
    stars: 5
  },
  {
    name: "Citi® Double Cash Card",
    bank: "Citi Bank",
    logo: "CITI",
    bg: "card-bg-3",
    rating: 4.6,
    badge: "Best for Cashback",
    desc: "Earn 2% cash back on every purchase. No annual fee required.",
    fee: "$0",
    stars: 4
  },
  {
    name: "Capital One Venture Rewards Card",
    bank: "Capital One",
    logo: "CAP1",
    bg: "card-bg-4",
    rating: 4.6,
    badge: "Best for Travel",
    desc: "75,000 miles after you spend $4,000 in the first 3 months.",
    fee: "$95",
    stars: 4
  }
];

const COMPARISONS_DATA = [
  {
    card1: "Chase Sapphire",
    card1bg: "#1e3a5f",
    card2: "Amex Gold",
    card2bg: "#8b5a00",
    title: "Chase Sapphire Preferred vs Amex Gold",
    desc: "Detailed comparison"
  },
  {
    card1: "Capital One Venture X",
    card1bg: "#c41e3a",
    card2: "Chase Sapphire Reserve",
    card2bg: "#1e3a5f",
    title: "Capital One Venture X vs Chase Sapphire Reserve",
    desc: "Detailed comparison"
  },
  {
    card1: "Discover it",
    card1bg: "#ff6900",
    card2: "Chase Freedom Flex",
    card2bg: "#1e3a5f",
    title: "Discover it vs Chase Freedom Flex",
    desc: "Detailed comparison"
  },
  {
    card1: "Citi Double Cash",
    card1bg: "#003087",
    card2: "Wells Fargo Active",
    card2bg: "#c41e3a",
    title: "Citi Double Cash vs Wells Fargo Active Cash",
    desc: "Detailed comparison"
  }
];

const SEARCH_DATA = [
  { icon: "fa-credit-card", text: "Best Credit Cards 2026", section: "#credit-cards" },
  { icon: "fa-calculator", text: "EMI Calculator", section: "#calculators" },
  { icon: "fa-tachometer-alt", text: "Credit Score Checker", section: "#credit-score" },
  { icon: "fa-piggy-bank", text: "Savings Calculator", section: "#calculators" },
  { icon: "fa-umbrella-beach", text: "Retirement Calculator", section: "#calculators" },
  { icon: "fa-chart-line", text: "Compound Interest Calculator", section: "#calculators" },
  { icon: "fa-university", text: "Best Savings Accounts", section: "#banking" },
  { icon: "fa-hand-holding-usd", text: "Personal Loans", section: "#loans" },
  { icon: "fa-shield-alt", text: "Health Insurance Plans", section: "#insurance" },
  { icon: "fa-chart-bar", text: "Best Mutual Funds", section: "#investing" },
  { icon: "fa-star", text: "Cashback Credit Cards", section: "#credit-cards" },
  { icon: "fa-search-dollar", text: "Credit Card Finder", section: "#calculators" },
  { icon: "fa-home", text: "Home Loans", section: "#loans" },
  { icon: "fa-car", text: "Auto Insurance", section: "#insurance" },
  { icon: "fab fa-bitcoin", text: "Cryptocurrency Guide", section: "#investing" }
];

const CALC_TEMPLATES = {
  emi: {
    title: "📊 EMI Calculator",
    fields: [
      { id: "loanAmount", label: "Loan Amount ($)", type: "number", placeholder: "100000", min: 1000 },
      { id: "interestRate", label: "Interest Rate (% per year)", type: "number", placeholder: "8.5", step: "0.1" },
      { id: "tenure", label: "Loan Tenure (months)", type: "number", placeholder: "60" }
    ],
    btnLabel: "Calculate EMI",
    calc(fields) {
      const P = parseFloat(fields.loanAmount) || 0;
      const r = (parseFloat(fields.interestRate) || 0) / 12 / 100;
      const n = parseInt(fields.tenure) || 0;
      if (!P || !r || !n) return null;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      const interest = total - P;
      return {
        value: `$${emi.toFixed(2)}/mo`,
        sub: `Total Payment: $${total.toFixed(2)} | Interest: $${interest.toFixed(2)}`
      };
    }
  },
  savings: {
    title: "💰 Savings Calculator",
    fields: [
      { id: "initial", label: "Initial Savings ($)", type: "number", placeholder: "5000" },
      { id: "monthly", label: "Monthly Contribution ($)", type: "number", placeholder: "500" },
      { id: "years", label: "Years to Save", type: "number", placeholder: "10" },
      { id: "rate", label: "Annual Interest Rate (%)", type: "number", placeholder: "5", step: "0.1" }
    ],
    btnLabel: "Calculate Savings",
    calc(fields) {
      const P = parseFloat(fields.initial) || 0;
      const pmt = parseFloat(fields.monthly) || 0;
      const y = parseInt(fields.years) || 0;
      const r = (parseFloat(fields.rate) || 0) / 100;
      if (!y) return null;
      const n = y * 12;
      const rm = r / 12;
      const fv = rm
        ? P * Math.pow(1 + rm, n) + pmt * ((Math.pow(1 + rm, n) - 1) / rm)
        : P + pmt * n;
      const contributed = P + pmt * n;
      const earned = fv - contributed;
      return {
        value: `$${fv.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
        sub: `Contributed: $${contributed.toLocaleString()} | Interest Earned: $${earned.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
      };
    }
  },
  retirement: {
    title: "🏖️ Retirement Calculator",
    fields: [
      { id: "currentAge", label: "Current Age", type: "number", placeholder: "30" },
      { id: "retireAge", label: "Retirement Age", type: "number", placeholder: "60" },
      { id: "monthly", label: "Monthly Investment ($)", type: "number", placeholder: "1000" },
      { id: "rate", label: "Expected Annual Return (%)", type: "number", placeholder: "12", step: "0.1" }
    ],
    btnLabel: "Calculate Corpus",
    calc(fields) {
      const cur = parseInt(fields.currentAge) || 0;
      const ret = parseInt(fields.retireAge) || 0;
      const pmt = parseFloat(fields.monthly) || 0;
      const r = (parseFloat(fields.rate) || 0) / 100;
      if (!cur || !ret || cur >= ret) return null;
      const n = (ret - cur) * 12;
      const rm = r / 12;
      const fv = rm
        ? pmt * ((Math.pow(1 + rm, n) - 1) / rm) * (1 + rm)
        : pmt * n;
      return {
        value: `$${(fv / 1e6).toFixed(2)}M`,
        sub: `Retire in ${ret - cur} years with $${fv.toLocaleString("en-US", { maximumFractionDigits: 0 })} corpus`
      };
    }
  },
  compound: {
    title: "📈 Compound Interest Calculator",
    fields: [
      { id: "principal", label: "Principal Amount ($)", type: "number", placeholder: "10000" },
      { id: "rate", label: "Annual Interest Rate (%)", type: "number", placeholder: "8", step: "0.1" },
      { id: "years", label: "Time Period (years)", type: "number", placeholder: "10" },
      {
        id: "freq", label: "Compounding Frequency", type: "select",
        options: [
          { value: "1", label: "Annually" },
          { value: "2", label: "Semi-Annually" },
          { value: "4", label: "Quarterly" },
          { value: "12", label: "Monthly" },
          { value: "365", label: "Daily" }
        ]
      }
    ],
    btnLabel: "Calculate",
    calc(fields) {
      const P = parseFloat(fields.principal) || 0;
      const r = (parseFloat(fields.rate) || 0) / 100;
      const t = parseInt(fields.years) || 0;
      const n = parseInt(fields.freq) || 1;
      if (!P || !r || !t) return null;
      const A = P * Math.pow(1 + r / n, n * t);
      const interest = A - P;
      return {
        value: `$${A.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
        sub: `Principal: $${P.toLocaleString()} | Interest Earned: $${interest.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
      };
    }
  },
  score: {
    title: "⭐ Credit Score Estimator",
    fields: [
      {
        id: "payHistory", label: "Payment History", type: "select",
        options: [
          { value: "excellent", label: "Always on time (Excellent)" },
          { value: "good", label: "Mostly on time (Good)" },
          { value: "fair", label: "Sometimes late (Fair)" },
          { value: "poor", label: "Often late (Poor)" }
        ]
      },
      {
        id: "utilization", label: "Credit Utilization", type: "select",
        options: [
          { value: "low", label: "Below 10% (Excellent)" },
          { value: "moderate", label: "10%–30% (Good)" },
          { value: "high", label: "30%–50% (Fair)" },
          { value: "very_high", label: "Above 50% (Poor)" }
        ]
      },
      {
        id: "creditAge", label: "Credit History Length", type: "select",
        options: [
          { value: "long", label: "7+ years" },
          { value: "medium", label: "3–7 years" },
          { value: "short", label: "1–3 years" },
          { value: "new", label: "Less than 1 year" }
        ]
      }
    ],
    btnLabel: "Estimate Score",
    calc(fields) {
      const scores = {
        payHistory: { excellent: 160, good: 120, fair: 80, poor: 40 },
        utilization: { low: 120, moderate: 90, high: 55, very_high: 20 },
        creditAge: { long: 90, medium: 65, short: 40, new: 15 }
      };
      let base = 300;
      base += scores.payHistory[fields.payHistory] || 0;
      base += scores.utilization[fields.utilization] || 0;
      base += scores.creditAge[fields.creditAge] || 0;
      const score = Math.min(850, Math.max(300, base + Math.floor(Math.random() * 20)));
      const label =
        score >= 750 ? "Excellent 🟢" :
        score >= 700 ? "Good 🔵" :
        score >= 650 ? "Fair 🟡" : "Poor 🔴";
      return {
        value: `${score}`,
        sub: `Rating: ${label} | Range: 300–850`
      };
    }
  },
  finder: {
    title: "🔍 Credit Card Finder",
    fields: [
      {
        id: "spending", label: "Primary Spending Category", type: "select",
        options: [
          { value: "travel", label: "Travel & Hotels" },
          { value: "dining", label: "Dining & Restaurants" },
          { value: "cashback", label: "Everyday Cashback" },
          { value: "groceries", label: "Groceries & Supermarkets" },
          { value: "fuel", label: "Fuel & Gas" }
        ]
      },
      {
        id: "fee", label: "Annual Fee Preference", type: "select",
        options: [
          { value: "no_fee", label: "No Annual Fee" },
          { value: "low", label: "Up to $100" },
          { value: "high", label: "Any Fee (Premium)" }
        ]
      },
      {
        id: "credit", label: "Your Credit Score", type: "select",
        options: [
          { value: "excellent", label: "750+ (Excellent)" },
          { value: "good", label: "700–749 (Good)" },
          { value: "fair", label: "650–699 (Fair)" },
          { value: "building", label: "Below 650 (Building)" }
        ]
      }
    ],
    btnLabel: "Find Best Card",
    calc(fields) {
      const recs = {
        travel_no_fee: "Capital One VentureOne – No fee travel card",
        travel_low: "Chase Sapphire Preferred® – Best travel card under $100",
        travel_high: "Amex Platinum – Ultimate travel card",
        dining_no_fee: "Citi Rewards+ – Great dining rewards, no fee",
        dining_low: "Amex Gold Card – 4x points on dining",
        dining_high: "Amex Gold Card – Best dining card overall",
        cashback_no_fee: "Citi® Double Cash Card – 2% on everything",
        cashback_low: "Wells Fargo Active Cash – 2% flat cashback",
        cashback_high: "Chase Freedom Unlimited – Premium cashback",
        groceries_no_fee: "Amazon Prime Rewards Visa – 5% at Amazon",
        groceries_low: "Blue Cash Preferred® – 6% at supermarkets",
        groceries_high: "Amex Blue Cash Preferred – Best groceries card",
        fuel_no_fee: "PenFed Platinum Rewards – 5x on fuel",
        fuel_low: "Bank of America Cash Rewards – 3% on gas",
        fuel_high: "Citi Premier® – Great fuel rewards"
      };
      const key = `${fields.spending}_${fields.fee}`;
      const rec = recs[key] || "Chase Sapphire Preferred® – Best all-around card";
      return {
        value: "Top Pick! 🏆",
        sub: rec
      };
    }
  }
};

// ──────────────────────────────────────────────
// RENDER CREDIT CARDS
// ──────────────────────────────────────────────
function renderCards() {
  const grid = document.getElementById("cardsGrid");
  if (!grid) return;
  grid.innerHTML = CARDS_DATA.map(card => {
    const starsHTML = Array.from({ length: 5 }, (_, i) =>
      `<i class="fa${i < card.stars ? 's' : 'r'} fa-star"></i>`
    ).join("");
    return `
      <div class="card-item">
        <div class="card-bank-name">${card.bank}</div>
        <div class="card-image-wrap ${card.bg}">
          <div class="card-chip"></div>
          <div class="card-logo-text">${card.logo}</div>
          <div class="card-number-dots">•••• •••• ••••</div>
        </div>
        <div class="card-info">
          <div class="card-name">${card.name}</div>
          <div class="card-rating">
            <div class="card-stars">${starsHTML}</div>
            <span class="card-rating-num">${card.rating}</span>
            <span class="card-badge">${card.badge}</span>
          </div>
          <p class="card-desc">${card.desc}</p>
          <div class="card-footer">
            <div class="card-fee">
              <span>Annual Fee</span>
              <strong>${card.fee}</strong>
            </div>
            <button class="btn-details" onclick="showToast('Viewing ${card.name} details...')">View Details</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ──────────────────────────────────────────────
// RENDER COMPARISONS
// ──────────────────────────────────────────────
function renderComparisons() {
  const grid = document.getElementById("comparisonsGrid");
  if (!grid) return;
  grid.innerHTML = COMPARISONS_DATA.map(c => `
    <div class="comparison-card" onclick="showToast('Loading comparison...')">
      <div class="comparison-vs">
        <div class="comp-card-mini" style="background:${c.card1bg}">${c.card1.split(" ")[0]}</div>
        <div class="comp-vs-badge">VS</div>
        <div class="comp-card-mini" style="background:${c.card2bg}">${c.card2.split(" ")[0]}</div>
      </div>
      <div class="comparison-title">${c.title}</div>
      <div class="comparison-desc">${c.desc}</div>
    </div>
  `).join("");
}

// ──────────────────────────────────────────────
// CALCULATOR MODAL
// ──────────────────────────────────────────────
function openCalculator(type) {
  const tpl = CALC_TEMPLATES[type];
  if (!tpl) return;

  const fieldsHTML = tpl.fields.map(f => {
    if (f.type === "select") {
      const opts = f.options.map(o => `<option value="${o.value}">${o.label}</option>`).join("");
      return `<div class="calc-group">
        <label for="${f.id}">${f.label}</label>
        <select id="${f.id}">${opts}</select>
      </div>`;
    }
    return `<div class="calc-group">
      <label for="${f.id}">${f.label}</label>
      <input type="${f.type}" id="${f.id}" placeholder="${f.placeholder || ''}"
        ${f.step ? `step="${f.step}"` : ''} ${f.min ? `min="${f.min}"` : ''} />
    </div>`;
  }).join("");

  document.getElementById("calcContent").innerHTML = `
    <h2 class="calc-title">${tpl.title}</h2>
    ${fieldsHTML}
    <button class="btn btn-primary" style="width:100%" onclick="runCalc('${type}')">
      ${tpl.btnLabel}
    </button>
    <div class="calc-result" id="calcResult" style="display:none">
      <div class="calc-result-label">Result</div>
      <div class="calc-result-value" id="calcResultValue"></div>
      <div class="calc-result-sub" id="calcResultSub"></div>
    </div>
  `;
  document.getElementById("calcModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function runCalc(type) {
  const tpl = CALC_TEMPLATES[type];
  const fields = {};
  tpl.fields.forEach(f => {
    const el = document.getElementById(f.id);
    fields[f.id] = el ? el.value : "";
  });
  const result = tpl.calc(fields);
  const resultEl = document.getElementById("calcResult");
  if (!result) {
    showToast("⚠️ Please fill in all fields correctly.");
    return;
  }
  document.getElementById("calcResultValue").textContent = result.value;
  document.getElementById("calcResultSub").textContent = result.sub || "";
  resultEl.style.display = "block";
  resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeCalculator() {
  document.getElementById("calcModal").classList.remove("active");
  document.body.style.overflow = "";
}

// Close modal on overlay click
document.getElementById("calcModal").addEventListener("click", function (e) {
  if (e.target === this) closeCalculator();
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCalculator();
});

// ──────────────────────────────────────────────
// SEARCH
// ──────────────────────────────────────────────
const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");

searchInput.addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  if (!query) {
    searchDropdown.classList.remove("active");
    return;
  }
  const results = SEARCH_DATA.filter(item =>
    item.text.toLowerCase().includes(query)
  ).slice(0, 6);

  if (results.length === 0) {
    searchDropdown.classList.remove("active");
    return;
  }
  searchDropdown.innerHTML = results.map(r => `
    <div class="search-result-item" onclick="goToSection('${r.section}')">
      <i class="fas ${r.icon}"></i>
      <span>${highlightMatch(r.text, query)}</span>
    </div>
  `).join("");
  searchDropdown.classList.add("active");
});

function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<strong style='color:var(--primary)'>$1</strong>");
}

function goToSection(section) {
  searchDropdown.classList.remove("active");
  searchInput.value = "";
  const el = document.querySelector(section);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-bar")) {
    searchDropdown.classList.remove("active");
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const first = searchDropdown.querySelector(".search-result-item");
    if (first) first.click();
  }
});

// ──────────────────────────────────────────────
// HAMBURGER MENU
// ──────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("open");
});

// ──────────────────────────────────────────────
// SCROLL EFFECTS
// ──────────────────────────────────────────────
const header = document.getElementById("header");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    header.classList.add("scrolled");
    backToTop.classList.add("visible");
  } else {
    header.classList.remove("scrolled");
    backToTop.classList.remove("visible");
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ──────────────────────────────────────────────
// INTERSECTION OBSERVER (Scroll Animations)
// ──────────────────────────────────────────────
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -60px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

function addAnimations() {
  const animatables = document.querySelectorAll(
    ".category-card, .tool-card, .card-item, .comparison-card, .invest-card, .insurance-card"
  );
  animatables.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
    observer.observe(el);
  });
}

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .category-card.visible, .tool-card.visible, .card-item.visible,
  .comparison-card.visible, .invest-card.visible, .insurance-card.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(styleSheet);

// ──────────────────────────────────────────────
// NEWSLETTER SUBMIT
// ──────────────────────────────────────────────
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector("input[type='email']");
  if (input && input.value) {
    showToast(`✅ Subscribed! Welcome to Visuya, ${input.value.split("@")[0]}!`);
    input.value = "";
  }
}

// ──────────────────────────────────────────────
// TOAST NOTIFICATION
// ──────────────────────────────────────────────
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 3500);
}

// ──────────────────────────────────────────────
// SMOOTH SCROLL for nav anchor links
// ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // close mobile menu
        navMenu.classList.remove("open");
        hamburger.classList.remove("active");
      }
    }
  });
});

// ──────────────────────────────────────────────
// LIVE COUNTER ANIMATION
// ──────────────────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      return;
    }
    el.textContent = Math.floor(start).toLocaleString();
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ──────────────────────────────────────────────
// ACTIVE NAV HIGHLIGHTING
// ──────────────────────────────────────────────
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-item > a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = "";
    link.style.background = "";
    if (link.getAttribute("href") === `#${current}`) {
      link.style.color = "var(--primary)";
      link.style.background = "var(--primary-light)";
    }
  });
}, { passive: true });

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderCards();
  renderComparisons();
  addAnimations();

  // Small hero stat counter
  setTimeout(() => {
    const scoreEl = document.querySelector(".gauge-number");
    if (scoreEl) animateCounter(scoreEl, 753);
  }, 800);
});

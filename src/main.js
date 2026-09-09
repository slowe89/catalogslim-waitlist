const DEFAULT_FORM_ACTION = "https://formsubmit.co/thespencerlowe@gmail.com";
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || DEFAULT_FORM_ACTION;
const SCORECARD_VERSION = "catalogslim-polish-2026-09-09";

const KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"];

const BANDS = [
  { max: 39, label: "Baseline not established" },
  { max: 69, label: "Some checks covered" },
  { max: 89, label: "Most checks covered" },
  { max: 100, label: "Checklist largely covered" },
];

const form = document.getElementById("priestley-form");
const success = document.getElementById("form-success");
const formError = document.getElementById("form-error");
const submitBtn = document.getElementById("submit-btn");
const sourceField = document.getElementById("meta-source");
const scoreTotalField = document.getElementById("meta-score-total");
const scoreVectorField = document.getElementById("meta-score-vector");
const timestampField = document.getElementById("meta-timestamp");
const scoreVersionField = document.getElementById("meta-score-version");
const scoreTotalEl = document.getElementById("score-total");
const scoreBandEl = document.getElementById("score-band");
const scoreProgressEl = document.getElementById("score-progress");
const scoreInvite = document.getElementById("score-invite");
const scoreInviteText = document.getElementById("score-invite-text");

form.action = FORM_ENDPOINT;
if (scoreVersionField) {
  scoreVersionField.value = SCORECARD_VERSION;
}

let submitting = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function answers() {
  return KEYS.map((key) => {
    const checked = document.querySelector(`input[name="maturity-${key}"]:checked`);
    return checked ? checked.value : null;
  });
}

function bandFor(total) {
  return BANDS.find((band) => total <= band.max).label;
}

function syncScore() {
  const vector = answers();
  const answered = vector.filter((value) => value !== null);
  const yesCount = answered.filter((value) => value === "Y").length;
  const total = yesCount * 10;
  const complete = answered.length === KEYS.length;

  scoreProgressEl.textContent = `${answered.length} / 10 answered`;

  if (!answered.length) {
    scoreTotalEl.textContent = "—";
    scoreBandEl.textContent = "Answer to score";
    scoreBandEl.dataset.band = "";
    scoreInvite.hidden = true;
    scoreTotalField.value = "";
    scoreVectorField.value = "";
    return;
  }

  if (complete) {
    const band = bandFor(total);
    scoreTotalEl.textContent = `${total} / 100`;
    scoreBandEl.textContent = band;
    scoreBandEl.dataset.band = band;
    scoreInvite.hidden = false;
    scoreInviteText.textContent = `Your Catalog Readiness Score is ${total} / 100 — ${band}. This is a self-assessment, not a measured routing benchmark. Share this score and your answers via the waitlist form.`;
    scoreTotalField.value = String(total);
    scoreVectorField.value = vector.join("/");
    sourceField.value = "catalogslim-scorecard";
    return;
  }

  scoreTotalEl.textContent = `${total}`;
  scoreBandEl.textContent = "Partial — finish all 10 to see your band";
  scoreBandEl.dataset.band = "";
  scoreInvite.hidden = true;
  scoreTotalField.value = String(total);
  scoreVectorField.value = vector.map((value) => value ?? "-").join("/");
}

function setSource(source) {
  if (!scoreInvite || scoreInvite.hidden) {
    sourceField.value = source;
  }
}

function ajaxUrl(endpoint) {
  return endpoint.includes("formsubmit.co/")
    ? endpoint.replace("formsubmit.co/", "formsubmit.co/ajax/")
    : endpoint;
}

async function readCaptureBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function isConfirmedSuccess(response, body) {
  if (!response.ok || !body || typeof body !== "object") {
    return false;
  }

  if (body.success === true || body.success === "true") return true;
  if (body.success === false || body.success === "false") return false;
  if (body.ok === true) return true;
  if (body.ok === false) return false;

  if (typeof body.message === "string") {
    const message = body.message.toLowerCase();
    if (/(error|fail|invalid|activation)/.test(message)) return false;
    if (/(success|sent)/.test(message)) return true;
  }

  return false;
}

function errorMessage(body) {
  if (body && typeof body.message === "string" && body.message.trim()) {
    return body.message.trim();
  }
  return "We couldn’t send your answers. Nothing was lost — try again.";
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
  formError.focus?.();
  form.hidden = false;
  success.hidden = true;
}

function showSuccess() {
  form.hidden = true;
  formError.hidden = true;
  success.hidden = false;
  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  success.focus({ preventScroll: true });
  success.scrollIntoView({ behavior, block: "center" });
}

function resetSubmit() {
  submitting = false;
  submitBtn.disabled = false;
  submitBtn.textContent = "Join the waitlist";
}

document.querySelectorAll("[data-source]").forEach((link) => {
  link.addEventListener("click", () => {
    setSource(link.dataset.source);
  });
});

document.getElementById("score-items").addEventListener("change", syncScore);

form.addEventListener("submit", async (event) => {
  if (submitting) {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  formError.hidden = true;

  timestampField.value = new Date().toISOString();
  if (scoreVersionField) {
    scoreVersionField.value = SCORECARD_VERSION;
  }
  if (!scoreVectorField.value) {
    scoreVectorField.value = answers()
      .map((value) => value ?? "-")
      .join("/");
  }
  if (!sourceField.value) {
    sourceField.value = "catalogslim-waitlist";
  }

  submitting = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  const payload = new FormData(form);

  try {
    const response = await fetch(ajaxUrl(FORM_ENDPOINT), {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload,
    });
    const body = await readCaptureBody(response);

    if (!isConfirmedSuccess(response, body)) {
      showError(errorMessage(body));
      resetSubmit();
      return;
    }

    showSuccess();
  } catch {
    showError("We couldn’t reach the waitlist service. Check your connection and try again.");
    resetSubmit();
  }
});

syncScore();

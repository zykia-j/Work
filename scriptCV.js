/* =========================================================
   CV Website Enhancements
   - Copy Email/Phone
   - Project table filtering
   - Contact form: validation + localStorage draft + mailto
   ========================================================= */

function safeQuery(selector) {
  const el = document.querySelector(selector);
  return el || null;
}

async function copyToClipboard(text) {
  // Modern clipboard API (works on HTTPS / localhost)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  // Fallback (older browsers)
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.setAttribute("readonly", "");
  temp.style.position = "absolute";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);
  temp.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(temp);
  return ok;
}

/* -------------------------
   1) Copy buttons
------------------------- */
(function setupCopyButtons() {
  const emailLink = safeQuery("#emailLink");
  const phoneText = safeQuery("#phoneText");
  const copyEmailBtn = safeQuery("#copyEmailBtn");
  const copyPhoneBtn = safeQuery("#copyPhoneBtn");

  if (copyEmailBtn && emailLink) {
    copyEmailBtn.addEventListener("click", async () => {
      const ok = await copyToClipboard(emailLink.textContent.trim());
      copyEmailBtn.textContent = ok ? "Copied!" : "Copy failed";
      setTimeout(() => (copyEmailBtn.textContent = "Copy"), 1200);
    });
  }

  if (copyPhoneBtn && phoneText) {
    copyPhoneBtn.addEventListener("click", async () => {
      const ok = await copyToClipboard(phoneText.textContent.trim());
      copyPhoneBtn.textContent = ok ? "Copied!" : "Copy failed";
      setTimeout(() => (copyPhoneBtn.textContent = "Copy"), 1200);
    });
  }
})();


/* -------------------------
   Contact form:
      - draft saving
      - basic validation
      - mailto compose
------------------------- */
(function setupContactForm() {
  const form = safeQuery("#contactForm");
  const status = safeQuery("#formStatus");

  if (!form) return;

  const fields = ["name", "email", "phone", "organization", "role", "reason", "message"];
  const storageKey = "cv_contact_form_draft_v1";

  // Load draft
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    fields.forEach((name) => {
      const el = form.elements[name];
      if (el && saved[name]) el.value = saved[name];
    });

    // Restore radio choice if present
    if (saved.contactMethod) {
      const radio = form.querySelector(`input[name="contactMethod"][value="${saved.contactMethod}"]`);
      if (radio) radio.checked = true;
    }
  } catch {
    // ignore bad JSON
  }

  // Save draft on input
  form.addEventListener("input", () => {
    const data = {};
    fields.forEach((name) => {
      const el = form.elements[name];
      if (el) data[name] = el.value;
    });

    const chosen = form.querySelector('input[name="contactMethod"]:checked');
    if (chosen) data.contactMethod = chosen.value;

    localStorage.setItem(storageKey, JSON.stringify(data));
  });

  // Submit behavior: validate + open mailto
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements.name?.value.trim();
    const email = form.elements.email?.value.trim();
    const message = form.elements.message?.value.trim();
    const org = form.elements.organization?.value.trim() || "";
    const role = form.elements.role?.value.trim() || "";
    const reason = form.elements.reason?.value || "other";
    const contactMethod = form.querySelector('input[name="contactMethod"]:checked')?.value || "Email";

    if (!name || !email || !message) {
      if (status) status.textContent = "Please fill in Name, Email, and Message.";
      return;
    }

    // Build a professional email subject/body
    const subject = encodeURIComponent(`Website Contact: ${reason.toUpperCase()} — ${name}`);
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${form.elements.phone?.value.trim() || ""}`,
      `Organization: ${org}`,
      `Role: ${role}`,
      `Preferred Contact Method: ${contactMethod}`,
      "",
      "Message:",
      message,
    ];

    const body = encodeURIComponent(bodyLines.join("\n"));

    // Your resume email (matches your header mailto)
    const to = "zykia1270@yahoo.com";
    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;

    // Feedback + clear draft
    if (status) status.textContent = "Opening your email app with the message…";
    localStorage.removeItem(storageKey);

    // Open email client
    window.location.href = mailtoUrl;

    // Optional: clear form after triggering mail client
    setTimeout(() => {
      form.reset();
      if (status) status.textContent = "Draft cleared. If your email app didn’t open, please allow popups.";
    }, 600);
  });
})();

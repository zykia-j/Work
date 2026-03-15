# Code Explanation — CV Website (CV2.html, scriptCV.js, styles.css)

This document walks through every section of the portfolio/resume website line by line, explaining the reasoning behind each decision. Use this to articulate your thought process in technical interviews.

---

## CV2.html — Structure & Semantics

### Document Setup (Lines 1–9)

```html
<!DOCTYPE html>
```
Tells the browser this is an HTML5 document. Without this, browsers enter "quirks mode" and render inconsistently across browsers.

```html
<html lang="en">
```
The `lang` attribute declares the page language as English. This matters for screen readers and search engine indexing (accessibility and SEO).

```html
<meta charset="UTF-8">
```
Sets the character encoding to UTF-8, which supports virtually all characters and symbols. Prevents garbled text for special characters.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Critical for responsive design. Without this, mobile browsers zoom out to show the full desktop layout. `width=device-width` tells the browser to match the screen width, and `initial-scale=1.0` prevents default zooming.

```html
<title>Zykia Godbolt-Jones - Resume</title>
```
Sets the browser tab title. Also used by search engines and screen readers to identify the page.

```html
<link rel="stylesheet" href="styles.css">
```
Links the external CSS file. Keeping styles separate from HTML follows the **separation of concerns** principle — HTML handles structure, CSS handles presentation.

```html
<script src="scriptCV.js" defer></script>
```
The `defer` attribute is intentional: it tells the browser to download the script in the background while the HTML continues parsing, then execute it after the DOM is fully built. This avoids the classic bug where JavaScript tries to access elements that haven't been rendered yet. Placing it in `<head>` with `defer` is cleaner than placing `<script>` at the bottom of `<body>`.

---

### Header Section (Lines 12–23)

```html
<header class="header-flex">
```
Uses a semantic `<header>` tag (not a `<div>`) to communicate the role of this block. The `header-flex` class applies a Flexbox layout defined in CSS.

```html
<img src="image.png" alt="Profile Picture" class="profile-pic">
```
The `alt` attribute provides a text description for screen readers and displays if the image fails to load — an accessibility requirement.

```html
<div class="name-center">
  <h1>Zykia Godbolt-Jones</h1>
</div>
```
Wrapping the `<h1>` in a div gives Flexbox a child element to grow and center independently of the image and contact info.

```html
<a id="emailLink" href="mailto:zykia1270@yahoo.com">zykia1270@yahoo.com</a>
<button id="copyEmailBtn" class="copy-btn" title="Copy email">Copy</button>
```
`mailto:` opens the user's default email client. The copy button gives an alternative for users who don't want to open an email client — they can copy the address and use any platform they choose. The `id` attributes are hooks for the JavaScript to attach event listeners.

```html
<a href="https://github.com/zykia-j" target="_blank">GitHub</a> &nbsp;|&nbsp;
<a href="https://www.linkedin.com/in/..." target="_blank">LinkedIn</a>
```
`target="_blank"` opens the link in a new tab so the visitor doesn't navigate away from the resume. `&nbsp;` is an HTML entity for a non-breaking space, used here purely for visual spacing around the `|` separator.

---

### Content Sections (Lines 26–88)

```html
<section>
  <h2>Summary</h2>
  ...
</section>
```
`<section>` is a semantic HTML5 element that groups related content with a heading. Using semantic tags (vs. plain `<div>`) improves accessibility (screen readers announce them) and SEO (search engines understand document structure).

```html
<h2>Technologies</h2>
<h3>Web Development</h3>
```
`<h2>` and `<h3>` maintain a proper heading hierarchy (h1 → h2 → h3). Skipping heading levels (e.g., h1 → h3) is an accessibility violation and confuses screen reader navigation.

---

### Projects Table (Lines 54–88)

```html
<div class="scroll-box">
  <table>
```
Wrapping the table in a `scroll-box` div allows the table to scroll horizontally on small screens (`overflow-x: auto` in CSS) instead of breaking the layout. The table itself stays full-width.

```html
<thead>
  <tr>
    <th>Project Name</th>
    ...
  </tr>
</thead>
<tbody>
  <tr>
    <td>...</td>
  </tr>
</tbody>
```
`<thead>` and `<tbody>` separate the header row from data rows. This is semantically meaningful (screen readers announce "column header") and allows browsers to handle table printing correctly (repeating headers on each page). `<th>` elements are automatically bold and centered, and also carry implicit accessibility meaning.

```html
<a href="https://github.com/..." target="_blank">GitHub</a>
```
Each project links directly to its GitHub repo, opening in a new tab.

---

### Contact Form (Lines 89–128)

```html
<form id="contactForm" action="#" method="post">
```
`action="#"` prevents real form submission (no backend server). JavaScript intercepts the submit event and builds a `mailto:` URL instead. `method="post"` is included for semantic correctness, even though `defer` to JS handles the actual behavior.

```html
<input type="text" id="name" name="name" required/>
<input type="email" id="email" name="email" required />
```
`type="email"` tells the browser to validate email format before submitting — built-in browser validation at no extra code cost. `required` enforces the field can't be blank. The `id` pairs with `<label for="...">` for accessibility (clicking the label focuses the input).

```html
<input type="tel" id="phone" name="phone" />
```
`type="tel"` brings up the numeric keypad on mobile devices — a small UX improvement. It's not `required` because not all visitors will want to share a phone number.

```html
<select id="reason" name="reason">
  <option value="job">Job Offer</option>
  ...
</select>
```
A dropdown restricts the input to known values, making it easier to triage messages. The `value` attributes are lowercase (e.g., `"job"`) so the JavaScript can use them programmatically to build the email subject line.

```html
<input type="radio" name="contactMethod" value="Email" checked />
```
Radio buttons share the same `name` attribute — this is what makes them mutually exclusive. `checked` sets the default to Email. The `value` is capitalized so it reads naturally in the email body.

```html
<textarea id="message" name="message" rows="5" cols="40" required></textarea>
```
`rows` and `cols` set a default visible size, but CSS also sets `resize: vertical` so users can drag it taller if needed.

```html
<p id="formStatus" aria-live="polite"></p>
```
`aria-live="polite"` is an ARIA attribute that tells screen readers to announce changes to this element without interrupting the user. When the form gives feedback ("Opening your email app..."), screen reader users will hear it.

---

### Footer (Lines 130–132)

```html
<footer style="text-align: center; font-size: 0.8rem; margin-top: 2rem;">
```
Inline styles are used here for a one-off footer style that doesn't warrant a separate CSS class. This is a minor trade-off between DRY (Don't Repeat Yourself) and pragmatism for small, unique elements.

---

## scriptCV.js — Behavior & Logic

### Helper Function: `safeQuery` (Lines 8–11)

```js
function safeQuery(selector) {
  const el = document.querySelector(selector);
  return el || null;
}
```
A thin wrapper around `document.querySelector`. The reason: if a selector finds nothing, `querySelector` returns `null` anyway — but by centralizing this, all feature functions can check `if (el)` without crashing. It's a **defensive programming** pattern that makes the code resilient to missing elements (e.g., if the HTML is changed and an ID is removed).

---

### Helper Function: `copyToClipboard` (Lines 13–31)

```js
async function copyToClipboard(text) {
```
`async` because the modern Clipboard API is Promise-based (asynchronous). Clipboard access requires user permission in some browsers, which is handled asynchronously.

```js
if (navigator.clipboard && window.isSecureContext) {
  await navigator.clipboard.writeText(text);
  return true;
}
```
`navigator.clipboard` is the modern API — clean, permission-aware, and reliable. But it only works over HTTPS or `localhost` (`isSecureContext`). Both conditions are checked before trying it.

```js
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
```
This is the **fallback for older browsers** (IE, older Edge, older Safari). The trick: create a hidden, off-screen textarea (`left: -9999px`), set its value to the text to copy, select all text in it, and run the legacy `execCommand("copy")`. Then immediately remove the textarea from the DOM so it doesn't affect page layout. `readonly` prevents the virtual keyboard popping up on mobile.

---

### IIFE: Copy Buttons (Lines 36–57)

```js
(function setupCopyButtons() {
  ...
})();
```
This is an **Immediately Invoked Function Expression (IIFE)**. It runs as soon as the script loads and doesn't pollute the global namespace. All variables inside are scoped to this function — no risk of name collisions with other scripts.

```js
copyEmailBtn.addEventListener("click", async () => {
  const ok = await copyToClipboard(emailLink.textContent.trim());
  copyEmailBtn.textContent = ok ? "Copied!" : "Copy failed";
  setTimeout(() => (copyEmailBtn.textContent = "Copy"), 1200);
});
```
`emailLink.textContent.trim()` reads the visible text of the link (the email address string), trimming any surrounding whitespace. The button text changes to "Copied!" as visual feedback, then resets back to "Copy" after 1.2 seconds using `setTimeout`. The ternary `ok ? "Copied!" : "Copy failed"` handles the rare clipboard failure gracefully.

---

### IIFE: Contact Form (Lines 66–156)

```js
(function setupContactForm() {
  const form = safeQuery("#contactForm");
  if (!form) return;
  ...
})();
```
Another IIFE for encapsulation. The early `return` guard (`if (!form) return`) is a common pattern — if the element doesn't exist, exit immediately rather than running code that would throw errors.

```js
const fields = ["name", "email", "phone", "organization", "role", "reason", "message"];
const storageKey = "cv_contact_form_draft_v1";
```
The field names are stored in an array so the same list can be iterated for both loading and saving drafts — DRY principle. The `storageKey` includes a version suffix (`_v1`) — a forward-thinking practice that lets you change the storage format in the future without old cached data causing bugs.

#### Draft Loading (Lines 76–90)

```js
const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
```
`localStorage.getItem` returns `null` if the key doesn't exist. The `|| "{}"` fallback ensures `JSON.parse` always receives a valid JSON string. Wrapping in `try/catch` handles the case where stored JSON is somehow corrupted.

```js
fields.forEach((name) => {
  const el = form.elements[name];
  if (el && saved[name]) el.value = saved[name];
});
```
`form.elements[name]` is the DOM API for accessing form inputs by their `name` attribute — cleaner than `querySelector` inside a form. The `if (el && saved[name])` check prevents errors if an element or saved value is missing.

```js
const radio = form.querySelector(`input[name="contactMethod"][value="${saved.contactMethod}"]`);
if (radio) radio.checked = true;
```
Restoring a radio button requires finding the specific radio input with the matching `value` and setting `checked = true`. You can't simply set `form.elements.contactMethod.value` because radio groups don't work that way.

#### Draft Saving (Lines 93–104)

```js
form.addEventListener("input", () => {
  ...
  localStorage.setItem(storageKey, JSON.stringify(data));
});
```
The `"input"` event fires on every keystroke or change — so the draft is saved continuously as the user types. `JSON.stringify` serializes the data object to a string for localStorage (which only stores strings).

#### Form Submission (Lines 107–155)

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();
  ...
});
```
`e.preventDefault()` stops the browser's default form submission behavior (which would reload the page). This is the standard pattern for handling forms in JavaScript without a backend.

```js
const name = form.elements.name?.value.trim();
```
Optional chaining (`?.`) safely accesses `.value` only if the element exists. `.trim()` removes leading/trailing whitespace so a field filled with spaces doesn't pass as valid.

```js
if (!name || !email || !message) {
  if (status) status.textContent = "Please fill in Name, Email, and Message.";
  return;
}
```
Manual validation as a second layer — HTML `required` attributes handle the first layer, but this JS check ensures the logic is correct even if the HTML changes.

```js
const subject = encodeURIComponent(`Website Contact: ${reason.toUpperCase()} — ${name}`);
```
`encodeURIComponent` converts special characters (spaces, `&`, `=`, etc.) into URL-safe percent-encoded equivalents. This is required because the subject and body are passed as URL query parameters in the `mailto:` link.

```js
const bodyLines = [
  `Name: ${name}`,
  `Email: ${email}`,
  ...
];
const body = encodeURIComponent(bodyLines.join("\n"));
```
Building the email body as an array of lines then joining with `\n` is readable and maintainable — much cleaner than concatenating one long string.

```js
window.location.href = mailtoUrl;
```
Setting `window.location.href` to a `mailto:` URL triggers the operating system to open the default email client with the subject and body pre-filled.

```js
setTimeout(() => {
  form.reset();
  if (status) status.textContent = "Draft cleared. ...";
}, 600);
```
The `600ms` delay gives the browser time to launch the email client before the page state changes. `form.reset()` clears all inputs back to their default values.

---

## styles.css — Visual Design & Layout

### Global Reset (Lines 1–4)

```css
* {
  box-sizing: border-box;
}
```
By default, CSS adds padding and border *outside* an element's declared width, which causes layout math headaches. `box-sizing: border-box` changes this so padding and border are included *inside* the width. The `*` selector applies this to every element — an industry-standard reset.

### Body (Lines 5–12)

```css
body {
  margin: 20px;
  padding: 20px;
  border: 3px solid #ccc;
  background-color: #f0f4f8;
  font-family: Arial, sans-serif;
  color: #333;
}
```
`background-color: #f0f4f8` sets a soft blue-gray page background so the white `.container` card stands out. `font-family: Arial, sans-serif` declares Arial as the first choice with `sans-serif` as a system fallback. `color: #333` is a softer near-black (vs. pure `#000`) which is easier on the eyes.

### Container Card (Lines 16–23)

```css
.container {
  max-width: 900px;
  margin: auto;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
```
`max-width: 900px` caps the content width so lines of text don't become uncomfortably long on wide screens. `margin: auto` with a `max-width` is the classic CSS technique for centering a block element horizontally. `box-shadow` uses `rgba` (with alpha transparency) for a subtle shadow that doesn't look like a hard border.

### Header Flexbox (Lines 27–36)

```css
.header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
```
`display: flex` makes the three header children (photo, name, contact info) lay out in a row. `align-items: center` vertically aligns them to the middle. `justify-content: space-between` pushes the first and last items to the edges with the name centered in between. `flex-wrap: wrap` allows the items to stack vertically on smaller screens before the media query kicks in.

### Profile Picture (Lines 38–44)

```css
.profile-pic {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #2c3e50;
  object-fit: cover;
}
```
`border-radius: 50%` turns the square image into a circle. `object-fit: cover` ensures the image fills the circle without distortion — it crops from the center rather than squashing. Setting both `width` and `height` to the same value ensures the circle stays perfectly round regardless of the image's original dimensions.

### Name & Contact Info (Lines 47–56)

```css
.name-center {
  flex-grow: 1;
  text-align: center;
}
.contact-info {
  text-align: right;
  font-size: 0.9em;
}
```
`flex-grow: 1` tells the name container to absorb all available space between the photo and contact info, pushing them to the edges and centering the name. `font-size: 0.9em` is relative to the parent — a minor size reduction that visually separates contact details from the primary heading.

### Typography (Lines 58–69)

```css
header h1 {
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}
```
`text-transform: uppercase` ensures the name displays in all caps regardless of how it's typed in HTML. `letter-spacing` adds a little breathing room between characters for a professional look. `text-shadow` with low opacity adds a very subtle depth effect.

### Links (Lines 72–79)

```css
a {
  text-decoration: none;
  color: #2980b9;
}
a:hover {
  color: #1abc9c;
}
```
`text-decoration: none` removes the default underline from all links for a cleaner look. The hover color changes from blue to teal — a visual affordance that confirms to the user the element is interactive.

### Section Headings (Lines 82–88)

```css
section h2 {
  border-bottom: 2px solid #1abc9c;
}
```
A teal bottom border under each `h2` creates a visual divider between sections without using a full `<hr>` element. The teal color (`#1abc9c`) is also used for the link hover color — consistent use of an accent color creates visual cohesion.

### Table (Lines 107–126)

```css
table {
  border-collapse: collapse;
}
```
By default, HTML tables render with double borders between cells (each cell has its own border). `border-collapse: collapse` merges adjacent borders into a single line for a cleaner look.

```css
th {
  background-color: #ecf0f1;
  font-weight: bold;
}
td {
  background-color: #fafafa;
}
```
The header row gets a slightly darker background than the data rows, making it easy to distinguish at a glance.

### Form Inputs (Lines 135–146)

```css
input, textarea {
  padding: 12px;
  border-radius: 6px;
  outline: none;
  width: 100%;
}
textarea {
  resize: vertical;
  height: 120px;
}
```
`width: 100%` makes inputs fill their container — important for responsive layout. `outline: none` removes the default browser focus ring (though in a production app you would want to replace this with a custom focus style for accessibility). `resize: vertical` lets users make the textarea taller but not wider, preventing layout breakage.

### Buttons (Lines 148–156)

```css
button {
  background-color: #2c3e50;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
button:hover {
  background-color: #1a242f;
}
```
`cursor: pointer` changes the mouse cursor to a hand on hover — a UX affordance that makes it clear the element is clickable. The hover state darkens the button color, providing tactile visual feedback.

### Copy Buttons (Lines 163–178)

```css
.copy-btn {
  font-size: 0.75rem;
  padding: 2px 8px;
  background-color: #ecf0f1;
  color: #2c3e50;
  border: 1px solid #ccc;
  border-radius: 4px;
  vertical-align: middle;
}
```
The copy buttons are intentionally styled differently from the main submit button — smaller, lighter, and inline. `vertical-align: middle` aligns them with the surrounding text. The muted color palette keeps them from visually competing with the actual content.

### Responsive Media Queries (Lines 181–230)

```css
@media (max-width: 600px) {
  header h1 { font-size: 2rem; }
  section h2 { font-size: 1.5rem; }
}
```
Media queries apply styles only when the screen is below a specified width. Here, heading font sizes are reduced on small screens to prevent overflow.

```css
@media (max-width: 480px) {
  .header-flex {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .contact-info {
    text-align: center;
    margin-top: 10px;
  }
  .radio-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
```
At the narrowest breakpoint (480px, typical small mobile), the header switches from a horizontal row to a vertical stack (`flex-direction: column`). Contact info switches from right-aligned to centered. Radio buttons stack vertically instead of side-by-side. These changes ensure the layout looks intentional on mobile, not just "squished."

### Fade-In Animation (Lines 233–246)

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
section {
  animation: fadeInUp 0.8s ease-out;
}
```
`@keyframes` defines a reusable animation. `fadeInUp` starts sections invisible (`opacity: 0`) and 30px below their final position, then animates them to fully visible at their natural position. `ease-out` means the animation starts fast and slows down at the end — which feels more natural than a linear animation. Applying it to every `section` means all content sections animate in when the page loads.

### Scroll Box (Lines 248–260)

```css
.scroll-box {
  overflow-x: auto;
  max-width: 100%;
}
.scroll-box::-webkit-scrollbar { height: 8px; }
.scroll-box::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}
```
`overflow-x: auto` only shows a horizontal scrollbar when the content is actually wider than the container — unlike `overflow-x: scroll` which always shows it. The `::webkit-scrollbar` pseudo-elements customize the scrollbar appearance in Chrome/Safari, making it slim and matching the page's color scheme.

### Radio Button Alignment (Lines 192–208)

```css
input[type="radio"] {
  margin-right: 6px;
  vertical-align: middle;
}
.radio-group {
  display: flex;
  gap: 20px;
  align-items: center;
}
.radio-group label {
  display: flex;
  align-items: center;
}
```
Radio buttons are notoriously difficult to align with their labels using default browser styles. The solution: `vertical-align: middle` on the input, `display: flex; align-items: center` on the label, and `display: flex; gap: 20px` on the group container. `gap` is a modern Flexbox/Grid property that adds space between flex children without needing margins.

---

## Key Design Decisions to Highlight in Interviews

| Decision | Why It Matters |
|---|---|
| `defer` on `<script>` | Prevents DOM-not-ready errors without moving script to bottom of body |
| IIFE pattern in JS | Encapsulation — avoids polluting the global scope |
| Clipboard API with fallback | Progressive enhancement — works on modern and legacy browsers |
| `localStorage` draft saving | UX improvement — user doesn't lose form data on accidental navigation |
| `aria-live="polite"` | Accessibility — screen readers announce form feedback |
| `box-sizing: border-box` | Predictable layout math across all elements |
| `border-collapse: collapse` | Cleaner table borders |
| Semantic HTML tags | SEO + accessibility — `<section>`, `<header>`, `<th>` all carry meaning |
| Two media query breakpoints | Covers both tablet and mobile screen sizes |
| `object-fit: cover` | Image fills circular frame without distortion |

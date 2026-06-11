# JOIER · joier.art — Implementation Plan

**Site:** joier.art
**Owner:** Walter McCaffrey
**Type:** Single-page bespoke jewelry site (HTML/CSS/JS — no CMS)
**Target buyer:** Affluent Filipino women, 35–60, Manila and Metro area
**Conversion goal:** Commission form submission or WhatsApp inquiry

---

> **How to use this document**
> Work phase by phase. Do not jump to Phase 2 until every Phase 1 item is complete and tested.
> Each task lists the exact file to edit, the exact change to make, and the acceptance test.
> Copy text is ready to paste — do not paraphrase it.

---

## Phase 1 — Highest ROI (do these first)

These seven changes require no new pages, no new photography, and no new code dependencies. They fix the biggest conversion leaks identified in the site audit. Expected impact: measurable increase in form submissions and WhatsApp taps within the first week of deployment.

---

### 1.1 Fix the broken Vault CTA

**Why:** "Enter The Vault" currently links to `javascript:void(0)`. A dead link at the moment of highest curiosity actively damages trust. This is the only broken element on the site and must be fixed before anything else goes live.

**File to edit:** `index.html`

**Find:**
```html
<a href="javascript:void(0)">Enter The Vault</a>
```

**Replace with (interim — while Vault page is being built):**
```html
<a href="#consult">Enter The Vault</a>
```

This redirects to the commission form as a stopgap. Once the Vault page exists (Phase 2), replace `#consult` with `/vault` or `vault.html`.

**Acceptance test:** Click "Enter The Vault" on desktop and mobile. It must scroll to the commission form. No dead state.

---

### 1.2 Add client testimonials — two placements

**Why:** Zero social proof is the biggest trust gap on the site. No testimonials means no evidence that anyone has done this before. For a Filipino buyer who is cautious about online luxury, one real attributed quote does more than any copy rewrite.

**Action required before coding:** Contact two past clients by WhatsApp today. Ask for a short quote — one or two sentences — and permission to use their first name, city, and the type of piece. Format: `"Quote text." — First Name, City · Occasion`.

**File to edit:** `index.html`

**Placement 1 — immediately after the hero section, before the atelier section:**

Add this HTML block:

```html
<!-- TESTIMONIAL 1 — below hero -->
<section class="testimonial-anchor">
  <blockquote>
    <p>"[Client quote here — 1–2 sentences. Specific. Her words, not yours.]"</p>
    <cite>— [First Name], [City] · [Occasion, e.g. Anniversary ring]</cite>
  </blockquote>
  <div class="trust-stats">
    <span>[Number]+ commissions completed</span>
    <span>Designing in Manila since 2014</span>
    <span>Every update from Walter, directly</span>
  </div>
</section>
```

**Placement 2 — immediately before the commission form section:**

```html
<!-- TESTIMONIAL 2 — before form -->
<section class="testimonial-pre-form">
  <blockquote>
    <p>"[Second client quote — preferably an heirloom or anniversary piece, highest emotional register.]"</p>
    <cite>— [First Name], [City] · [Occasion]</cite>
  </blockquote>
</section>
```

**CSS to add** (in `style.css` or inline `<style>` block):

```css
.testimonial-anchor,
.testimonial-pre-form {
  padding: 3rem 2rem;
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
}

.testimonial-anchor blockquote p,
.testimonial-pre-form blockquote p {
  font-style: italic;
  font-size: 1.15rem;
  line-height: 1.8;
  color: inherit;
  margin-bottom: 0.75rem;
}

.testimonial-anchor blockquote cite,
.testimonial-pre-form blockquote cite {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
}

.trust-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.trust-stats span {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
}
```

**Acceptance test:** Both testimonial blocks render correctly on desktop and mobile. Quote and attribution are legible. Stats wrap gracefully at mobile width (375px).

---

### 1.3 Rewrite the atelier section body copy

**Why:** "Walter McCaffrey has been designing fine jewelry in Manila for over a decade" is a résumé line. It tells the buyer a fact but gives her no reason to want a working relationship with you. This section is where she decides if she trusts the person, not just the portfolio.

**File to edit:** `index.html`

**Find the current atelier body paragraph** (the one starting with "Walter McCaffrey has been designing...") and replace the paragraph text with:

```
Every commission I take starts the same way: I ask what this piece is for. Not which metal or what budget — those come later. I need to know who this is for, what it means, and what it should feel like to wear. That conversation is where the piece actually begins.

I design everything from scratch, in Manila, and I work with one client at a time. When you commission from JOIER, every decision — form, stone, finish, weight — comes through me.
```

**Important:** Write this in your own voice. The structure above is the template — meaning first, credentials last. The specific language must be yours. Do not publish copy that sounds like it was written for someone else.

**Acceptance test:** Read it aloud. If it sounds like a press release, rewrite it. If it sounds like something you'd say to a client, it's ready.

---

### 1.4 Add a price anchor above the budget dropdown

**Why:** The budget dropdown is the first price signal on the site. A buyer who has been emotionally engaged for several minutes and then sees "₱280,000+" with no preparation can abandon. One sentence pre-frames the range and removes sticker shock.

**File to edit:** `index.html`

**Find** the budget range `<select>` element in the commission form. Immediately above it, add:

```html
<p class="price-anchor">Commissions begin at ₱35,000 for 18K gold. Most clients work in the ₱70,000–₱140,000 range.</p>
```

**CSS to add:**

```css
.price-anchor {
  font-size: 0.8rem;
  font-style: italic;
  opacity: 0.65;
  margin-bottom: 0.5rem;
}
```

**Acceptance test:** Price anchor line is visible above the budget dropdown. It does not appear above any other field.

---

### 1.5 Reorder the commission form fields

**Why:** The current form order places "What does this piece mean to you?" last — after budget. This is backwards. A buyer who answers the meaning question first is already emotionally invested before she hits the price dropdown. Moving it up reduces form abandonment.

**File to edit:** `index.html`

**Current order:**
1. Your name
2. Email
3. Best way to reach you
4. Your number or handle
5. What are you looking to create?
6. Metal preference
7. Budget range
8. What does this piece mean to you?

**New order:**
1. Your name
2. Email
3. Best way to reach you
4. Your number or handle
5. What are you looking to create?
6. **What does this piece mean to you?** ← moved up
7. Metal preference
8. Budget range ← with price anchor line above it

In the HTML, physically move the meaning `<textarea>` block and its label to position 6. The form submission logic does not depend on field order, so no backend changes are needed.

**Acceptance test:** Submit a test entry. Confirm all fields capture correctly in whatever backend receives the form data. Confirm field order matches the new sequence on both desktop and mobile.

---

### 1.6 Rewrite the post-submission confirmation

**Why:** After submitting, the buyer is in a slightly anxious state. She has handed over personal details to a person she has never met. The current confirmation ("Received. I will be in touch within 24 hours.") is correct but incomplete. One additional sentence describing exactly what the first contact will look like removes that anxiety and increases the chance she responds when you reach out.

**File to edit:** `index.html` (the confirmation state that shows after successful form submission)

**Find** the confirmation message block and replace the body text with:

```
I'll be in touch within 24 hours, usually sooner.

Your first message will come from Walter directly, through the contact method you chose. It will include a few questions about your piece before we talk design.
```

Keep the reference number line exactly as it is.

**Acceptance test:** Submit a test form entry. Confirm the updated confirmation text appears. Confirm reference number still generates.

---

### 1.7 Add a WhatsApp CTA to the navigation bar

**Why:** Filipino luxury buyers use WhatsApp as the default channel for high-trust transactions. One visible tap point in the nav means she can reach you from any scroll position on the page without hunting for contact info in the footer.

**File to edit:** `index.html`

**Find** the nav bar element. Add the following as the rightmost nav item:

```html
<a href="https://wa.me/639173116143" class="nav-whatsapp" target="_blank" rel="noopener">
  Message Walter
</a>
```

**CSS to add:**

```css
.nav-whatsapp {
  /* Style to match your existing nav — adjust colors to fit */
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1px solid currentColor;
  padding: 0.35em 0.9em;
  border-radius: 2px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.nav-whatsapp:hover {
  opacity: 0.7;
}
```

**Acceptance test:** On mobile, tapping "Message Walter" opens WhatsApp with the correct number pre-loaded. On desktop, it opens WhatsApp Web or prompts appropriately. The button does not break the nav layout at 375px width.

---

### Phase 1 testing checklist

Before deploying Phase 1:

- [ ] "Enter The Vault" clicks to `#consult` (not dead)
- [ ] Both testimonial blocks render and are attributed correctly
- [ ] Atelier body copy is in first person and reads naturally
- [ ] Price anchor appears above budget dropdown only
- [ ] Form field order matches new sequence: name / email / contact / number / piece type / meaning / metal / budget
- [ ] Post-submission confirmation shows both paragraphs and reference number
- [ ] WhatsApp nav button opens correct number on mobile
- [ ] Full form submission test passes end-to-end
- [ ] No console errors on desktop Chrome and Safari
- [ ] No layout breaks at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)

---

## Phase 2 — New pages and copy upgrades

These items require building new pages or making structural copy changes. Build in this order: Vault page first (it's already promoted on the homepage), then the standalone Commission page, then the collection page improvements.

---

### 2.1 Build The Vault page

**Why:** The Vault concept is the most original and compelling thing on the site. "Designed. Never Made." is strong copy. The infrastructure to support it needs to exist.

**New file:** `vault.html`

**Page structure:**

```
GLOBAL NAV
│
├── PAGE HEADER
│   ├── Eyebrow: The Vault
│   ├── H1: Designed. Never Made.
│   └── Body: "These pieces were fully designed, studied, and printed.
│           None went to metal. Each one is available to commission —
│           choose your metal, your stone, your finish.
│           The design is already done. It becomes yours."
│
├── PIECE GRID (3-column, responsive to 2-col then 1-col on mobile)
│   └── Each card:
│       ├── Render image (existing 3D prints or CAD renders)
│       ├── Piece ID (e.g. VLT-001) — visible, copyable
│       ├── Type and material line (e.g. "Sculptural drop · 18K ready")
│       └── CTA button: "Commission This Piece →"
│           └── href: "#consult?piece=VLT-001" or pre-fill form via JS
│
├── BOTTOM CTA
│   ├── "Don't see what you want? Every commission begins from scratch."
│   └── Button: "Begin a Custom Commission →" → links to #consult or commission.html
│
└── GLOBAL FOOTER
```

**Update homepage:** Once `vault.html` exists, update the "Enter The Vault" CTA from `#consult` (the Phase 1 stopgap) to `vault.html`.

**Acceptance test:** Every piece card has an image, ID, description, and working CTA. "Commission This Piece" CTA reaches the commission form. Page renders correctly at 375px.

---

### 2.2 Build the standalone Commission page

**Why:** A dedicated `/commission` or `commission.html` URL allows you to link directly from Instagram bio, Stories highlights, and WhatsApp replies. Sending people to the homepage first adds one unnecessary step and risks them getting distracted by the gallery.

**New file:** `commission.html`

**Page structure:**

```
GLOBAL NAV
│
├── PAGE HEADER
│   ├── Eyebrow: Private commissions
│   ├── H1: Begin Your Commission
│   └── Subhead: "Every JOIER piece starts with a conversation —
│           not a catalog. Tell me what you're looking to make
│           and we'll go from there."
│
├── TWO-COLUMN LAYOUT (stacks to single column on mobile)
│   │
│   ├── LEFT COLUMN — context
│   │   ├── Fee explanation (same text as homepage — copy exactly)
│   │   ├── Timeline: "Most commissions take six to ten weeks
│   │   │            from first sketch to delivery."
│   │   ├── Direct contact: "Prefer to message directly?
│   │   │                    WhatsApp · Viber"
│   │   │   (linked buttons to wa.me and viber:// numbers)
│   │   └── Client quote (same as Testimonial 1 from Phase 1)
│   │
│   └── RIGHT COLUMN — form
│       └── Commission form (exact same fields as homepage,
│           same field order from Phase 1 — copy the HTML block)
│
└── GLOBAL FOOTER
```

**Update Instagram bio link** once this page is live. Change the link in bio from `joier.art` to `joier.art/commission.html` (or set up a redirect at `joier.art/commission`).

**Acceptance test:** Form on this page submits correctly and shows the same confirmation as the homepage. Direct WhatsApp and Viber links open correctly on mobile. Two-column layout stacks cleanly on 375px.

---

### 2.3 Add collection description copy to each collection page

**Why:** Collection category labels ("Split Ring · Enamel Signets · Bling Series") identify but do not sell. A buyer browsing a specific collection needs 2–3 sentences that tell her what makes this collection distinct and what commissioning here involves.

**Files to edit:** Each collection's HTML — verify actual filenames by checking the site's collection navigation links.

**Copy for each collection header:**

**KROMA:**
> The split-shank signet, built for color. KROMA pieces are made with hand-fired enamel — layered, not painted — in colorways chosen with each client. Every combination is one of a kind. Available in 14K and 18K yellow, white, and rose gold, with optional stone settings.

**Classic Monograms:**
> Gold letters, drawn for you. Every monogram pendant in this collection was designed from scratch for a specific client — the letterform, the weight, the finish. Yours will be too. Available as pendants, crests, and initial jewelry in 14K and 18K gold.

**Rings:**
> Cocktail rings, signets, sculptural bands, and gemstone commissions. Every ring here was made for a specific hand. If something catches your eye, note the piece number — that reference is your starting point, not a constraint. We'll design from there.

**Pendants:**
> Drops and sculptural forms in 14K and 18K gold. Some geometric, some figurative, all designed for the person who will wear them. Browse by piece number and bring what you like to your commission.

**Earrings:**
> Geometric drops, architectural studs, and sculptural pairs. Each set in this collection was built for a specific woman — the scale, the weight, the finish. Commissioned pairs begin the same way every other piece does: with a conversation.

**Bracelets:**
> Fine bracelets, ID cuffs, and bespoke wrist work in gold. The kind you don't take off. If you have something specific in mind — an inscription, a specific weight, a stone — bring it to your commission.

**Brooch:**
> Wearable objects. Sculptural pieces for the woman who has thought carefully about what she wears. These are not accessories in the conventional sense. They are things that make people ask.

**Add inline commission prompt after every 6–8 pieces in each grid:**

```html
<div class="inline-cta">
  <p class="inline-cta-prompt">Something catch your eye?</p>
  <p class="inline-cta-sub">Note the piece number and bring it to your commission. We'll start from there.</p>
  <a href="commission.html" class="btn-primary">Begin Your Commission →</a>
</div>
```

**Acceptance test:** Every collection page shows the description text below the H1. Inline CTA appears after piece 6 or 8 in the grid. CTA links to `commission.html`.

---

### 2.4 Add a "How it works" section to the homepage

**Why:** The site converts buyers who are ready. It does not currently convert buyers who are interested but uncertain. A four-step process section — placed between the collection grid and The Vault — gives the uncertain buyer a clear picture of what she is agreeing to. The ₱3,000 design fee is already well-explained in the form section; this section introduces the concept earlier.

**File to edit:** `index.html`

**Position:** Between the collection grid section and The Vault section.

**HTML to add:**

```html
<section class="how-it-works" id="process">
  <p class="eyebrow">How it works</p>
  <h2>From your first message to the finished piece.</h2>

  <ol class="process-steps">
    <li>
      <span class="step-n">1</span>
      <div>
        <strong>Tell me what you want to make.</strong>
        A photo, a feeling, a name — that's enough to start.
        Fill out the form or message me on WhatsApp.
      </div>
    </li>
    <li>
      <span class="step-n">2</span>
      <div>
        <strong>I design it.</strong>
        For ₱3,000 — credited in full toward your piece — you receive
        detailed CAD renders: the form, the materials, the finished look.
        A production quote is included. Nothing is cast yet.
      </div>
    </li>
    <li>
      <span class="step-n">3</span>
      <div>
        <strong>You decide.</strong>
        Commission the piece and your ₱3,000 is credited toward the
        final price. Or keep the design package — the renders and
        materials study are yours, with no further obligation.
      </div>
    </li>
    <li>
      <span class="step-n">4</span>
      <div>
        <strong>Your piece is made, then delivered.</strong>
        Every update comes from me directly.
        Most commissions are complete in six to ten weeks.
      </div>
    </li>
  </ol>
</section>
```

Replace "six to ten weeks" with your actual typical timeline.

**Acceptance test:** Section appears between collection grid and Vault. Steps are numbered and legible on mobile. Timeline is accurate.

---

### Phase 2 testing checklist

- [ ] `vault.html` exists and is reachable from the homepage "Enter The Vault" CTA
- [ ] All Vault piece cards have images, IDs, and working CTAs
- [ ] `commission.html` exists and form submits correctly
- [ ] Instagram bio link updated to `joier.art/commission.html`
- [ ] WhatsApp and Viber direct links work on mobile from commission page
- [ ] All 7 collection pages have description copy below the H1
- [ ] Inline CTAs appear mid-grid on collection pages
- [ ] "How it works" section renders correctly between collection grid and Vault
- [ ] Timeline in "How it works" matches your actual turnaround
- [ ] No broken links anywhere on vault.html or commission.html
- [ ] Both new pages share the global nav and footer

---

## Phase 3 — SEO, mobile polish, and About page

These items improve discoverability and experience quality but do not directly unblock conversions the way Phase 1 and 2 do. Do them after Phase 2 is live and tested.

---

### 3.1 Update meta descriptions and social sharing tags

**File to edit:** `index.html` (the `<head>` block)

**Find and replace these meta tags:**

```html
<!-- Meta description — replace current -->
<meta name="description" content="Private jewelry atelier by Walter McCaffrey. Custom commissions, enamel signets, and monogram pieces designed from scratch in Manila. No catalog — only what you commission.">

<!-- OG title — replace current -->
<meta property="og:title" content="JOIER — Private Fine Jewelry Atelier, Manila">

<!-- OG description — replace current -->
<meta property="og:description" content="Every piece designed from scratch for the person it's for. Commissions open. ₱3,000 design study, credited in full.">

<!-- Twitter card title — replace current -->
<meta name="twitter:title" content="JOIER — No catalog. Only what you commission.">

<!-- Twitter card description — replace current -->
<meta name="twitter:description" content="Bespoke fine jewelry by Walter McCaffrey. Custom enamel, monograms, and sculptural commissions. Made in Manila.">
```

**Also add** if not present:

```html
<meta name="author" content="Walter McCaffrey, JOIER">
<link rel="canonical" href="https://joier.art/">
```

For `vault.html` and `commission.html`, add page-specific meta descriptions once those pages are built.

**Acceptance test:** Paste `joier.art` into the Facebook Sharing Debugger and LinkedIn Post Inspector. Confirm OG title, description, and image render correctly. Confirm the correct description appears in a Google search snippet (takes a few days after deployment).

---

### 3.2 Mobile-specific improvements

**File to edit:** `style.css` or equivalent stylesheet

**Issue 1 — nav bar at 375px.** With the WhatsApp CTA added in Phase 1, the nav may overflow on small screens. Add:

```css
@media (max-width: 480px) {
  nav {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .nav-whatsapp {
    width: 100%;
    text-align: center;
    margin-top: 0.25rem;
  }
}
```

Adjust selectors to match your actual nav class names.

**Issue 2 — trust stats bar wrapping.** The three stat items in the testimonial anchor section must wrap gracefully:

```css
@media (max-width: 600px) {
  .trust-stats {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
}
```

**Issue 3 — commission form on mobile.** The form's row-paired fields (name + email, metal + budget) should stack on small screens:

```css
@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }
}
```

Adjust selector to match your actual form row class.

**Issue 4 — hero CTA buttons.** Two buttons side by side may be too narrow for thumbs at 375px. Stack them:

```css
@media (max-width: 480px) {
  .hero-ctas {
    flex-direction: column;
    gap: 0.75rem;
  }

  .hero-ctas a {
    width: 100%;
    text-align: center;
  }
}
```

**Acceptance test:** Visually verify entire homepage at 375px (iPhone SE), 390px (iPhone 14 Pro), 430px (iPhone 15 Plus), and 768px (iPad). No horizontal overflow. No buttons too small to tap. Form fields have sufficient height for touch input (minimum 44px).

---

### 3.3 Add structured data markup (JSON-LD)

**Why:** Structured data helps Google understand that joier.art is a jewelry business in Manila, which improves local search visibility. This is a 30-minute task with no visible change to users.

**File to edit:** `index.html` — add inside the `<head>` tag.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "JOIER",
  "description": "Private bespoke jewelry atelier by Walter McCaffrey. Custom commissions, enamel signets, and monogram pieces designed from scratch in Manila.",
  "url": "https://joier.art",
  "telephone": "+639173116143",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Manila",
    "addressCountry": "PH"
  },
  "founder": {
    "@type": "Person",
    "name": "Walter McCaffrey"
  },
  "sameAs": [
    "https://instagram.com/joier_jewelry"
  ]
}
</script>
```

**Acceptance test:** Paste `joier.art` into Google's Rich Results Test. No errors on the LocalBusiness schema.

---

### 3.4 Build the About Walter page (optional, build when traffic justifies it)

**Why:** An About page is not needed for conversion at current traffic levels. It becomes valuable once you have consistent referral traffic and social media followers who want to know the person before they inquire. Build it when you can verify that people are looking for it.

**New file:** `about.html`

**Page structure:**

```
GLOBAL NAV
│
├── PAGE HEADER (two-column: photo left, text right)
│   ├── Photo: Walter at the bench — hands + tools, not a portrait
│   ├── Eyebrow: The designer
│   ├── H1: Walter McCaffrey
│   └── Subhead: Fine jewelry designer. Manila. Commissions open.
│
├── BIO — four beats, first person, your own voice
│   ├── Beat 1: How a commission with you actually works
│   │          (what you pay attention to, what you ask first)
│   ├── Beat 2: Why you run this as a one-man operation
│   │          (the specific reason — not a philosophy statement)
│   ├── Beat 3: One story about a commission that mattered
│   │          (not the most expensive — the most meaningful)
│   └── Beat 4: One sentence about what you want them to do next
│
├── FOUR CRAFT IMAGES with single-line captions
│   ├── Bench work: "Where every commission begins."
│   ├── Wax model: "The form before the metal."
│   ├── Enamel close-up: "Fired in layers. No two the same."
│   └── Finished piece: "The piece, before it becomes someone's."
│
├── PAGE CTA
│   ├── "Commissions are open."
│   └── Button: "Begin Yours →" → commission.html
│
└── GLOBAL FOOTER
```

**Acceptance test:** Bio reads in first person. Reads naturally aloud. Does not use the word "craftsmanship," "bespoke," "luxury," or "passion." Four images load correctly. CTA links to commission.html.

---

### 3.5 Add the footer closing line

**Why:** The footer currently ends on the brand descriptor: "Not a brand. A designer." That line is good but cold as an exit point. One warm line before it raises the emotional temperature at the last moment.

**File to edit:** `index.html` — footer block

**Find** the footer brand descriptor paragraph and add one line above it:

```html
<p class="footer-close">Every piece I've made started with a conversation.</p>
<p class="footer-descriptor">Not a brand. A designer. Private commissions, enamel signets, and sculptural pieces — designed and made in Manila.</p>
```

**CSS to add:**

```css
.footer-close {
  font-style: italic;
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}
```

**Acceptance test:** Line appears above the brand descriptor in the footer. Renders correctly on mobile.

---

### Phase 3 testing checklist

- [ ] Meta description, OG title, OG description, Twitter card all updated
- [ ] Facebook Sharing Debugger shows correct preview
- [ ] No horizontal scroll on any page at 375px
- [ ] All touch targets minimum 44px height on mobile
- [ ] Form fields stack vertically on mobile
- [ ] JSON-LD passes Google Rich Results Test with no errors
- [ ] If About page built: bio is first-person, reads naturally, no banned words
- [ ] Footer closing line renders above brand descriptor
- [ ] All three pages (index, vault, commission) have page-specific meta descriptions

---

## Master priority summary

| Priority | Item | Phase | Effort | Impact |
|---|---|---|---|---|
| 1 | Fix broken Vault CTA | 1 | 5 min | High — stops active trust damage |
| 2 | Add two client testimonials | 1 | 1–2 hrs | High — biggest missing trust signal |
| 3 | Rewrite atelier copy in first person | 1 | 30 min | High — converts browsers to believers |
| 4 | Reorder form fields (meaning before budget) | 1 | 15 min | Medium-high — reduces abandonment |
| 5 | Add price anchor above budget dropdown | 1 | 10 min | Medium-high — removes sticker shock |
| 6 | Rewrite post-submission confirmation | 1 | 10 min | Medium — reduces post-submit anxiety |
| 7 | Add WhatsApp CTA to nav | 1 | 20 min | Medium-high — surfaces preferred channel |
| 8 | Build vault.html | 2 | 3–4 hrs | High — unlocks strongest existing CTA |
| 9 | Build commission.html | 2 | 2 hrs | Medium-high — enables direct IG linking |
| 10 | Add collection description copy | 2 | 1 hr | Medium — converts gallery browsers |
| 11 | Add "How it works" section | 2 | 1 hr | Medium — converts uncertain buyers |
| 12 | Update meta and OG tags | 3 | 30 min | Medium — improves social sharing |
| 13 | Mobile polish (CSS fixes) | 3 | 1–2 hrs | Medium — improves mobile UX |
| 14 | Add JSON-LD schema | 3 | 30 min | Low-medium — SEO long-term |
| 15 | Build about.html | 3 | 3–4 hrs | Low now, medium later |
| 16 | Add footer closing line | 3 | 5 min | Low — polish |

**Total Phase 1 time estimate:** 3–4 hours
**Total Phase 2 time estimate:** 8–10 hours
**Total Phase 3 time estimate:** 6–8 hours

---

## Files reference

| File | Status | Role |
|---|---|---|
| `index.html` | Exists — edit in phases 1, 2, 3 | Homepage — primary conversion surface |
| `style.css` | Exists — edit in phases 1, 3 | Global styles |
| `vault.html` | Does not exist — build in phase 2 | Vault page |
| `commission.html` | Does not exist — build in phase 2 | Standalone commission page |
| `about.html` | Does not exist — build in phase 3 (optional) | About Walter |

Verify actual CSS filename against the live site before editing — it may be inline or named differently.

---

## What not to do

These items came up in analysis but are not worth your time for conversion purposes at current traffic levels:

- Navigation restructuring beyond adding the WhatsApp button
- A/B testing infrastructure (traffic too low to be statistically meaningful)
- Chat widget (adds load, WhatsApp link covers the use case)
- Email marketing integration (do it later, after inquiry volume grows)
- Site speed optimization (not a conversion bottleneck at this stage)
- Redesigning the collection grid layout (it works; the copy is what's missing)

---

*Last updated: June 2026*
*Based on full site audit, conversion analysis, wireframes, and copy rewrite completed in this session.*

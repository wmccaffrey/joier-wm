# JOIER SEO Checklist — Search Console, Bing, and Indexing

Prerequisites: joier.art must be live and accessible before any of these steps will work.

---

## Part 1 — Google Search Console

### Step 1: Create a Google Account (skip if you already have one)
1. Go to https://accounts.google.com
2. Create an account or sign in with an existing Gmail

### Step 2: Add joier.art as a Property
1. Go to https://search.google.com/search-console
2. Click **Start now**
3. Under **Select property type**, choose **Domain** (not URL prefix)
4. Type `joier.art` and click **Continue**

### Step 3: Verify Ownership via DNS (recommended for GitHub Pages)
1. Google will show you a TXT record to add — it looks like: `google-site-verification=xxxxxxxxxx`
2. Go to https://ap.www.namecheap.com and log in
3. Go to **Domain List** → click **Manage** next to joier.art
4. Click the **Advanced DNS** tab
5. Click **Add New Record**
6. Set Type: **TXT Record**, Host: **@**, Value: paste the verification string from Google
7. Click the checkmark to save
8. Go back to Google Search Console and click **Verify**
9. DNS changes can take up to 48 hours — if it fails, wait an hour and try again

### Step 4: Submit Your Sitemap
1. In Google Search Console, click your joier.art property
2. In the left sidebar, click **Sitemaps**
3. In the "Add a new sitemap" field, type: `sitemap.xml`
4. Click **Submit**
5. Status should change to **Success** within a few minutes to a few hours

### Step 5: Request Indexing for the Homepage
1. In the top search bar inside Search Console, type: `https://joier.art/`
2. Click the result that appears
3. Click **Request Indexing**
4. Google will queue it — typically indexed within 1–7 days

### Step 6: Check Coverage
1. In the left sidebar, click **Pages** (under Indexing)
2. After a few days, you should see `https://joier.art/` listed under **Indexed**
3. If it appears under **Not indexed**, click the reason for details

---

## Part 2 — Bing Webmaster Tools

### Step 7: Create a Microsoft Account (skip if you have one)
1. Go to https://account.microsoft.com
2. Create an account or sign in

### Step 8: Add joier.art to Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Click **Get started** and sign in
3. Click **Add a site**
4. Type `https://joier.art/` and click **Add**

### Step 9: Verify Ownership
**Easiest method — import from Google Search Console:**
1. On the verification screen, click **Import from Google Search Console**
2. Sign in with the same Google account
3. Select joier.art and click **Import**
4. Verification completes automatically

**Manual method (if import fails):**
1. Choose the **XML file** verification method
2. Download the BingSiteAuth.xml file Bing provides
3. Add it to the root of your joier-wm repo (same folder as index.html)
4. Commit and push via GitHub Desktop
5. Wait ~5 minutes for GitHub Pages to deploy, then click **Verify** in Bing

### Step 10: Submit Your Sitemap to Bing
1. In Bing Webmaster Tools, click your joier.art property
2. In the left sidebar, click **Sitemaps**
3. Click **Submit sitemap**
4. Enter: `https://joier.art/sitemap.xml`
5. Click **Submit**

### Step 11: Request Bing Indexing
1. In the left sidebar, click **URL Inspection**
2. Enter `https://joier.art/` and click **Search**
3. Click **Request Indexing**

---

## Part 3 — After Submission

### Step 12: Verify sitemap.xml and robots.txt are live
1. Open a browser and go to: `https://joier.art/sitemap.xml`
   - You should see the XML content, not a 404
2. Open: `https://joier.art/robots.txt`
   - You should see the Allow and Sitemap lines
3. If either returns 404, your latest commit hasn't deployed yet — check GitHub Pages status at https://github.com/[your-username]/joier-wm/actions

### Step 13: Check GitHub Pages is deploying from the right branch
1. Go to your joier-wm repo on GitHub
2. Click **Settings** → **Pages**
3. Confirm Source is set to the correct branch (usually `main`) and root folder `/`
4. The URL shown should read `https://joier.art/`

### Step 14: Test structured data
1. Go to https://validator.schema.org
2. Paste `https://joier.art/` and click **Run Test**
3. Confirm JewelryStore and LocalBusiness types are detected with no errors

### Step 15: Test Open Graph tags
1. Go to https://developers.facebook.com/tools/debug/
2. Paste `https://joier.art/` and click **Debug**
3. Confirm og:title, og:description, and og:image all resolve correctly
4. If the image shows wrong or old data, click **Scrape Again**

### Step 16: Monitor monthly
- Google Search Console → **Performance** tab shows impressions, clicks, and average position
- Bing Webmaster Tools → **Reports** → **Page Traffic**
- Check back 2–3 weeks after submission for first data

---

## Checklist Summary

- [ ] Google account ready
- [ ] joier.art added to Google Search Console
- [ ] DNS TXT record added in Namecheap
- [ ] Google ownership verified
- [ ] Sitemap submitted to Google
- [ ] Homepage indexing requested in Google
- [ ] Microsoft account ready
- [ ] joier.art added to Bing Webmaster Tools
- [ ] Bing ownership verified
- [ ] Sitemap submitted to Bing
- [ ] Homepage indexing requested in Bing
- [ ] sitemap.xml live at joier.art/sitemap.xml
- [ ] robots.txt live at joier.art/robots.txt
- [ ] Structured data validated
- [ ] Open Graph tags validated

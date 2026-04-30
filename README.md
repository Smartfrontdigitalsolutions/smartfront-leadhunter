# SmartFront LeadHunter 🎯

**Fully automated Las Vegas lead generation.**  
Finds local businesses with no website, broken websites, or very poor websites — and pushes them straight into Airtable as scored, prioritized leads. Zero manual work required.

---

## How It Works

```
Every day at 8 AM Las Vegas time:

1. Picks 2 niches to run (rotates through 15 niches over the week)
2. Pulls businesses from Google Maps via Outscraper API
3. Checks every business's website:
   - No website at all?       → Score 100  🔥 HOT
   - Domain unreachable?      → Score 90   🔥 HOT
   - Website broken (4xx/5xx)?→ Score 85   🔥 HOT
   - Parked / under construction? → Score 88 🔥 HOT
   - Not mobile-friendly?     → Score 60+  ⚡ WARM
   - Very thin content?       → Score 55+  ⚡ WARM
   - Slow load time?          → Score 50+  ✅ COOL
4. Scores and deduplicates every lead
5. Pushes qualified leads into Airtable with full details
```

---

## Niches Covered (rotates 2/day)

- HVAC, Plumbing, Electrician
- Landscaping, Hair Salon, Barber
- Roofing, Pest Control, Auto Repair
- Cleaning, Painting, Flooring
- Pool Service, Garage Door, Locksmith

---

## Setup

### 1. Clone / copy files to a new Railway project

### 2. Create Airtable table

Create a table called **"LeadHunter Leads"** with these fields:

| Field | Type |
|-------|------|
| Business Name | Single line text (Primary) |
| Phone | Phone |
| Address | Single line text |
| Category | Single line text |
| Niche | Single line text |
| Website | URL |
| Website Status | Single select |
| Website Issues | Long text |
| Website Score | Number |
| Lead Score | Number |
| Priority | Single select |
| Google Rating | Single line text |
| Review Count | Number |
| Email | Email |
| Source Query | Single line text |
| Date Found | Date |
| Status | Single select |
| Outreach Sent | Checkbox |

### 3. Set Railway Environment Variables

```
OUTSCRAPER_API_KEY      = your key from app.outscraper.com
AIRTABLE_API_KEY        = your Airtable Personal Access Token
AIRTABLE_BASE_ID        = appXXXXXXXXXXXXXX  (from your base URL)
AIRTABLE_TABLE_NAME     = LeadHunter Leads
MIN_LEAD_SCORE          = 45
RESULTS_PER_QUERY       = 20
CRON_SCHEDULE           = 0 15 * * *
RUN_NOW                 = false
```

### 4. Deploy to Railway

The service starts, waits for the daily schedule, and runs automatically.

---

## Trigger a Manual Run

Set `RUN_NOW=true` in Railway variables, then redeploy.  
Or locally: `node index.js --run-now`

---

## Lead Priority Meaning

| Priority | Score | What it means |
|----------|-------|---------------|
| 🔥 HOT | 85-100 | No website or completely broken — ideal pitch |
| ⚡ WARM | 65-84 | Poor/slow website with multiple issues |
| ✅ COOL | 45-64 | Weak website, some clear gaps |

---

## Connecting to Your Email Outreach System

Once leads land in Airtable, your existing smartfront-autopilot system can pick them up by:
1. Filtering `Status = "New Lead"` and `Outreach Sent = false`
2. Pulling the `Phone` and `Email` fields
3. Triggering the 4-email drip sequence

---

## Files

```
index.js                    Main entry + cron scheduler
src/
  pipeline.js               Orchestrates the full run
  scraper.js                Outscraper API integration
  websiteChecker.js         Website quality analysis
  leadScorer.js             Lead scoring logic
  airtableSync.js           Airtable push + dedup
  niches.js                 Niche list + daily rotation
scripts/
  setup-airtable.js         Verify Airtable connection
```

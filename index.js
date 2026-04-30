// index.js
// SmartFront LeadHunter — main entry
// Runs automatically every day at 8 AM Las Vegas time (PST/PDT)

require("dotenv").config();
const cron = require("node-cron");
const { runPipeline } = require("./src/pipeline");
const { NICHES } = require("./src/niches");

const args = process.argv.slice(2);
const RUN_NOW = args.includes("--run-now") || process.env.RUN_NOW === "true";
const DEV_MODE = args.includes("--dev");

// ─── Validate environment ─────────────────────────────────────────────────────

function validateEnv() {
  const required = ["OUTSCRAPER_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error("\n❌ Missing required environment variables:");
    missing.forEach((k) => console.error(`   - ${k}`));
    console.error("\nSet these in Railway → Variables panel (or .env for local dev)\n");
    process.exit(1);
  }
}

// ─── Cron schedule ────────────────────────────────────────────────────────────
// "0 8 * * *" = 8:00 AM UTC — adjust for Las Vegas (PST = UTC-8, PDT = UTC-7)
// To hit 8 AM PST: use "0 16 * * *"  (UTC)
// To hit 8 AM PDT: use "0 15 * * *"  (UTC)
// Using 15 UTC = 8 AM PDT (summer) / configure via env

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 15 * * *";

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  validateEnv();

  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║       SmartFront LeadHunter v1.0              ║");
  console.log("║  Automated Las Vegas Lead Generation System   ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log(`\n📍 Targeting: Las Vegas, NV`);
  console.log(`🏷️  Niches tracked: ${NICHES.length} total (2 per day)`);
  console.log(`⏰  Schedule: ${CRON_SCHEDULE} (UTC)`);
  console.log(`📋 Airtable base: ${process.env.AIRTABLE_BASE_ID}`);
  console.log(`📊 Table: ${process.env.AIRTABLE_TABLE_NAME || "LeadHunter Leads"}`);

  if (RUN_NOW || DEV_MODE) {
    console.log("\n🚀 RUN_NOW flag detected — starting pipeline immediately...\n");
    try {
      await runPipeline();
    } catch (err) {
      console.error("Pipeline error:", err);
      if (!DEV_MODE) process.exit(1);
    }
    if (!DEV_MODE) return; // Exit after one run if not dev mode scheduler
  }

  // Schedule daily runs
  console.log(`\n✅ Scheduler active. Next run at cron: ${CRON_SCHEDULE}\n`);

  cron.schedule(CRON_SCHEDULE, async () => {
    console.log(`\n⏰ Scheduled run triggered at ${new Date().toISOString()}`);
    try {
      await runPipeline();
    } catch (err) {
      console.error("Scheduled pipeline error:", err.message);
    }
  });

  // Keep process alive
  process.on("SIGTERM", () => {
    console.log("SIGTERM received — shutting down gracefully");
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

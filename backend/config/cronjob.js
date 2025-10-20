const { importTMDbData } = require("../scripts/import");

module.exports = {
  tmdbDailyImport: {
    task: async ({ strapi }) => {
      try {
        console.log(
          "🕙 Starting scheduled TMDb import at",
          new Date().toISOString()
        );
        await importTMDbData(strapi);
        console.log("✅ Scheduled TMDb import completed successfully");
      } catch (error) {
        console.error("❌ Scheduled TMDb import failed:", error);
      }
    },
    options: {
      rule: "0 30 17 * * *",
      tz: "Europe/Paris",
    },
  },
};

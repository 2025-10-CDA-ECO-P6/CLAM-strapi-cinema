const { importTMDbData } = require('../scripts/import');

module.exports = {
  /**
   * TMDb Data Import Cron Job
   * Runs every day at 10:00 AM
   * Cron format: second minute hour day month weekday
   * '0 0 10 * * *' = At 10:00:00 AM every day
   */
  tmdbImport: {
    task: async ({ strapi }) => {
      try {
        console.log('🕙 Starting scheduled TMDb import at', new Date().toISOString());
        await importTMDbData(strapi);
        console.log('✅ Scheduled TMDb import completed successfully');
      } catch (error) {
        console.error('❌ Scheduled TMDb import failed:', error.message);
        // You could also send notifications or log to external services here
      }
    },
    options: {
      rule: '0 30 17 * * *', // Every day at 5:30 PM
      tz: 'Europe/Paris', // France/Paris timezone
    },
  },
};
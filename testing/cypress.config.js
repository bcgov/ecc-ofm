const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    experimentalModifyObstructiveThirdPartyCode: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {},
  },
});

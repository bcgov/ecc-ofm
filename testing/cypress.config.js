const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    experimentalModifyObstructiveThirdPartyCode: true,
    chromeWebSecurity: false,
    experimentalInteractiveRunEvents: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // on("task", {
      //   generateOTP() {
      //     require("cypress-otp");
      //     return null;
      //   },
      // });
    },
  },
});

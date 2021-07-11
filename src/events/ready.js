const i18n = require("../utils/i18n").i18n;
const error = require("../utils/Logger").error;
const Config = require("../config.json");

module.exports = (client) => {
  // Log that the bot is online.
  if (client.env === "PROD") {
    client.users.fetch(Config.OWNER.id).then(user => {
      user.send(
        i18n("READY_MESSAGE", Config.DEFAULTSETTINGS.language)
      );
    }).catch(() => {
      error(i18n("ERROR_OWNER_NOTFOUND", Config.DEFAULTSETTINGS.language));
    });
  }

  if (client.env === "PROD") {
    // Make the bot "play the game" which is the help command with default prefix.
    client.user.setActivity(
      i18n("SET_ACTIVITY", Config.DEFAULTSETTINGS.language)
        .replace("{{variable}}", Config.DEFAULTSETTINGS.prefix), 
      {type: "WATCHING"});
  } else if (client.env === "DEV") {
    client.user.setActivity(
      i18n("SET_ACTIVITY_DEV", Config.DEFAULTSETTINGS.language), 
      {type: "PLAYING"});
  }
};

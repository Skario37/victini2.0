const i18n = require("../../utils/i18n").i18n;
const reloadModules = require("../../utils/Loader").reloadModules;

exports.run = async (client, message, args, settings) => {
  reloadModules(client, message, settings);
};

exports.conf = {
  name: "reloadmodules",
  permLevel: "Admin",
  cooldown: 0,
  enabled: true,
  guildOnly: false,
  aliases: ["rm"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_RM_NAME", language),
    category: i18n("HELP_RM_CATEGORY", language),
    description: i18n("HELP_RM_DESCRIPTION", language),
    usage: i18n("HELP_RM_USAGE", language)
  }
}
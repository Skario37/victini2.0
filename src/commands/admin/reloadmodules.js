const { i18n } = require("../../utils/i18n");
const { reloadModules } = require("../../utils/Loader");

exports.run = async (client, message, args, settings) => {
  reloadModules(client, message, settings);
  setTimeout(() => message.delete().catch(e => {}), 10000);
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
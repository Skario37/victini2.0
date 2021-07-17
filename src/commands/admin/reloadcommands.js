const { i18n } = require("../../utils/i18n");
const { reloadCommands } = require("../../utils/Loader");

exports.run = async (client, message, args, settings) => {
  reloadCommands(client, message, settings);
  message.delete({"timeout": 10000}).catch(e => {});
};

exports.conf = {
  name: "reloadcommands",
  permLevel: "Admin",
  cooldown: 0,
  enabled: true,
  guildOnly: false,
  aliases: ["rc"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_RC_NAME", language),
    category: i18n("HELP_RC_CATEGORY", language),
    description: i18n("HELP_RC_DESCRIPTION", language),
    usage: i18n("HELP_RC_USAGE", language)
  }
}
const i18n = require("../../utils/i18n").i18n;
const loadCommand = require("../../utils/Loader").loadCommand;

exports.run = async (client, message, args, settings) => {
  const arg = args[0];
  if (args.length === 0) {
    let text = i18n("ERROR_LC_ARGUMENTS", settings.language);
    text += "\n";
    text += i18n("USAGE", settings.language)
      .replace("{{prefix}}", settings.prefix)
      .replace("{{usage}}", this.help(settings.language).usage);

    return message.channel.send(text).then(msg => msg.delete({"timeout": 10000}));
  }
  loadCommand(client, message, settings, arg);
};

exports.conf = {
  name: "loadcommand",
  permLevel: "Admin",
  cooldown: 0,
  enabled: true,
  guildOnly: false,
  aliases: ["lc"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_LC_NAME", language),
    category: i18n("HELP_LC_CATEGORY", language),
    description: i18n("HELP_LC_DESCRIPTION", language),
    usage: i18n("HELP_LC_USAGE", language)
  }
}
const i18n = require("../../utils/i18n").i18n;
const unloadCommand = require("../../utils/Loader").unloadCommand;

exports.run = async (client, message, args, settings) => {
  const arg = args[0];
  if (args.length === 0) {
    let text = i18n("ERROR_UC_ARGUMENTS", settings.language);
    text += "\n";
    text += i18n("USAGE", settings.language)
      .replace("{{prefix}}", settings.prefix)
      .replace("{{usage}}", this.help(settings.language).usage);

    return message.lineReplyNoMention(text).then(msg => {
      message.delete({"timeout": 10000}).catch(e => {});
      msg.delete({"timeout": 10000}).catch(e => {});
    });
  }
  unloadCommand(client, message, settings, arg);
  message.delete({"timeout": 10000}).catch(e => {});
};

exports.conf = {
  name: "unloadcommand",
  permLevel: "Admin",
  cooldown: 0,
  enabled: true,
  guildOnly: false,
  aliases: ["uc"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_UC_NAME", language),
    category: i18n("HELP_UC_CATEGORY", language),
    description: i18n("HELP_UC_DESCRIPTION", language),
    usage: i18n("HELP_UC_USAGE", language)
  }
}
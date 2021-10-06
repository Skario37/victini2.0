const { i18n } = require("../../utils/i18n");
const { unloadModule } = require("../../utils/Loader");

exports.run = async (client, message, args, settings) => {
  const arg = args[0];
  if (args.length === 0) {
    let text = i18n("ERROR_UM_ARGUMENTS", settings.language);
    text += "\n";
    text += i18n("USAGE", settings.language)
      .replace("{{prefix}}", settings.prefix)
      .replace("{{usage}}", this.help(settings.language).usage);

    return message.reply({content: text, allowedMentions: { repliedUser: false}}).then(msg => {
      setTimeout(() => message.delete().catch(e => {}), 10000);
      setTimeout(() => msg.delete().catch(e => {}), 10000);
    });
  }
  unloadModule(client, message, settings, arg);
  setTimeout(() => message.delete().catch(e => {}), 10000);
};

exports.conf = {
  name: "unloadmodule",
  permLevel: "Admin",
  cooldown: 0,
  enabled: true,
  guildOnly: false,
  aliases: ["um"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_UM_NAME", language),
    category: i18n("HELP_UM_CATEGORY", language),
    description: i18n("HELP_UM_DESCRIPTION", language),
    usage: i18n("HELP_UM_USAGE", language)
  }
}
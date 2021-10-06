const { i18n } = require("../../utils/i18n");
const { loadModule } = require("../../utils/Loader");

exports.run = async (client, message, args, settings) => {
  const arg = args[0];
  if (args.length === 0) {
    let text = i18n("ERROR_LM_ARGUMENTS", settings.language);
    text += "\n";
    text += i18n("USAGE", settings.language)
      .replace("{{prefix}}", settings.prefix)
      .replace("{{usage}}", this.help(settings.language).usage);

    return message.reply({content: text, allowedMentions: { repliedUser: false}}).then(msg => {
      setTimeout(() => message.delete().catch(e => {}), 10000);
      setTimeout(() => msg.delete().catch(e => {}), 10000);
    });
  }
  loadModule(client, message, settings, arg);
  setTimeout(() => message.delete().catch(e => {}), 10000);
};

exports.conf = {
  name: "loadmodule",
  permLevel: "Admin",
  cooldown: 0,
  enabled: true,
  guildOnly: false,
  aliases: ["lm"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_LM_NAME", language),
    category: i18n("HELP_LM_CATEGORY", language),
    description: i18n("HELP_LM_DESCRIPTION", language),
    usage: i18n("HELP_LM_USAGE", language)
  }
}
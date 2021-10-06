const { MessageEmbed } = require("discord.js");
const { i18n } = require("../../utils/i18n");
const Emoji = require("../../pictogram/emoji.json");
const { getEmbedColor } = require("../../utils/Functions");
const Math = require('mathjs');

exports.run = (client, message, args, settings) => {
  if (args.length === 0) {
    let text = i18n("ERROR_CALC_ARGUMENTS", settings.language);
    text += "\n";
    text += i18n("USAGE", settings.language)
      .replace("{{prefix}}", settings.prefix)
      .replace("{{usage}}", this.help(settings.language).usage);

    return message.reply({content: text, allowedMentions: { repliedUser: false}}).then(msg => {
      setTimeout(() => message.delete().catch(e => {}), 10000);
      setTimeout(() => msg.delete().catch(e => {}), 10000);
    });
  }

  let result;
  try {
    result = Math.evaluate(args.join(" "));
  } catch (e) {
    return message.reply({content: i18n("ERROR_CALC_FAILED", settings.language), allowedMentions: { repliedUser: false}}).then(msg => {
      setTimeout(() => message.delete().catch(e => {}), 10000);
      setTimeout(() => msg.delete().catch(e => {}), 10000);
    });
  }

  if (isNaN(parseFloat(result))) {
    return message.reply({content: i18n("ERROR_CALC_INVALID", settings.language), allowedMentions: { repliedUser: false}}).then(msg => {
      setTimeout(() => message.delete().catch(e => {}), 10000);
      setTimeout(() => msg.delete().catch(e => {}), 10000);
    });
  } else {
    return message.reply({content: i18n("SUCCESS_CALC_EXPRESSION", settings.language).replace("{{variable}}", result), allowedMentions: { repliedUser: false}});
  }

};

exports.conf = {
  name: "calculate",
  permLevel: "User",
  cooldown: 1,
  enabled: true,
  guildOnly: false,
  aliases: ["calc", "calculer"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_CALC_NAME", language),
    category: i18n("HELP_CALC_CATEGORY", language),
    description: i18n("HELP_CALC_DESCRIPTION", language),
    usage: i18n("HELP_CALC_USAGE", language)
  }
}
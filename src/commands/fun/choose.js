const { i18n } = require("../../utils/i18n");
const Emoji = require("../../pictogram/emoji.json");
const { MessageEmbed } = require("discord.js");
const { getEmbedColor } = require("../../utils/Functions");
const { getRandomInt } = require("../../utils/Math");

exports.run = async (client, message, args, settings) => {
  const elements = args.join(" ").split(",");
  if (elements.length < 2) {
    let text = i18n("ERROR_CHOOSE_ARGUMENTS", settings.language);
    text += "\n";
    text += i18n("USAGE", settings.language)
      .replace("{{prefix}}", settings.prefix)
      .replace("{{usage}}", this.help(settings.language).usage);

    return message.reply({content: text, allowedMentions: { repliedUser: false}}).then(msg => {
      setTimeout(() => message.delete().catch(e => {}), 10000);
      setTimeout(() => msg.delete().catch(e => {}), 10000);
    });
  }

  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));

  embed.addField(
    i18n("CHOOSE_TITLE", settings.language)
      .replace("{{emoji}}", Emoji.HOOK.text)
      .replace("{{items}}", args.join(" ")),
    i18n("CHOOSE_ITEM", settings.language)
      .replace("{{variable}}", elements[getRandomInt(0, elements.length)])
  );

  return message.reply({embeds: [embed], allowedMentions: { repliedUser: false}}).catch(e => {});
};

exports.conf = {
  name: "choose",
  permLevel: "User",
  cooldown: 10,
  enabled: true,
  guildOnly: false,
  aliases: ["choisir"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_CHOOSE_NAME", language),
    category: i18n("HELP_CHOOSE_CATEGORY", language),
    description: i18n("HELP_CHOOSE_DESCRIPTION", language),
    usage: i18n("HELP_CHOOSE_USAGE", language)
  }
}
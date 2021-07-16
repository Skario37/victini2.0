const i18n = require("../../utils/i18n").i18n;
const Emoji = require("../../pictogram/emoji.json");
const MessageEmbed = require("discord.js").MessageEmbed;
const getEmbedColor = require("../../utils/Functions").getEmbedColor;
const getRandomIntInclusive = require("../../utils/Math").getRandomIntInclusive;

exports.run = async (client, message, args, settings) => {
  const rate = getRandomIntInclusive(0,20);


  let text = "";
  if (rate === 0) text = i18n("RATE_PERFECT_LOSE", settings.language);
  else if (rate > 0 && rate <= 4) text = i18n("RATE_VERY_BAD", settings.language);
  else if (rate > 4 && rate <= 6) text = i18n("RATE_BAD", settings.language);
  else if (rate > 6 && rate <= 8) text = i18n("RATE_PRETTY_BAD", settings.language);
  else if (rate > 8 && rate < 12) text = i18n("RATE_COMMON", settings.language);
  else if (rate >= 12 && rate < 14) text = i18n("RATE_PRETTY_GOOD", settings.language);
  else if (rate >= 14 && rate < 16) text = i18n("RATE_GOOD", settings.language);
  else if (rate >= 16 && rate < 20) text = i18n("RATE_VERY_GOOD", settings.language);
  else text = i18n("RATE_PERFECT_GOOD", settings.language);
  
  if (args.length) text = text.replace("{{variable}}", args.join(" "));
  else text = text.replace("{{variable}}", message.author);

  text = text.replace("{{number}}", rate);

  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));
  embed.addField(
    i18n("RATE_TITLE", settings.language).replace("{{emoji}}", Emoji.WRITE.text),
    text
  )

  return message.lineReplyNoMention(embed);
};

exports.conf = {
  name: "rate",
  permLevel: "User",
  cooldown: 10,
  enabled: true,
  guildOnly: false,
  aliases: ["noter"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_RATE_NAME", language),
    category: i18n("HELP_RATE_CATEGORY", language),
    description: i18n("HELP_RATE_DESCRIPTION", language),
    usage: i18n("HELP_RATE_USAGE", language)
  }
}
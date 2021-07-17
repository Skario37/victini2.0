const { i18n } = require("../../utils/i18n");
const Emoji = require("../../pictogram/emoji.json");
const { MessageEmbed } = require("discord.js");
const { getEmbedColor } = require("../../utils/Functions");
const { decodeMorse, encodeMorse } = require("../../utils/Deen");


exports.run = async (client, message, args, settings) => {
  if (args.length === 0) {
    let text = i18n("ERROR_MORSE_ARGUMENTS", settings.language);
    text += "\n";
    text += i18n("USAGE", settings.language)
      .replace("{{prefix}}", settings.prefix)
      .replace("{{usage}}", this.help(settings.language).usage);

    return message.lineReplyNoMention(text).then(msg => {
      message.delete({"timeout": 10000}).catch(e => {});
      msg.delete({"timeout": 10000}).catch(e => {});
    });
  };

  const text = args.join(" ").normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase();
  let deen = "";
  let decode = false;
  if ([".","/","-"].includes(text.charAt(0))) {
    deen = decodeMorse(text);
    decode = true;
  } else {
    deen = encodeMorse(text);
  }
  if (!deen.length) deen = "\u200b";

  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));
  embed.addField(
    i18n(decode ? "MORSE_DECODE_TITLE" : "MORSE_ENCODE_TITLE", settings.language),
    deen
  )

  return message.lineReplyNoMention(embed);
};

exports.conf = {
  name: "morse",
  permLevel: "User",
  cooldown: 10,
  enabled: true,
  guildOnly: false,
  aliases: []
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_MORSE_NAME", language),
    category: i18n("HELP_MORSE_CATEGORY", language),
    description: i18n("HELP_MORSE_DESCRIPTION", language),
    usage: i18n("HELP_MORSE_USAGE", language)
  }
}
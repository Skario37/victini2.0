const { i18n } = require("../../utils/i18n");
const Emoji = require("../../pictogram/emoji.json");
const { MessageEmbed } = require("discord.js");
const { getEmbedColor } = require("../../utils/Functions");
const { getRole, getMember } = require("../../utils/Guild");

exports.run = async (client, message, args, settings) => {
  let crush = "";
  let member = undefined;
  let role = undefined;
  let everyone = false;
  if (args.length) {
    member = await getMember(message, args);
    if (member) {
      crush = member.user.id;
    } else {
      role = await getRole(message, crush);
      crush = (role ? role.id : args.join(" "));
    }

    if (isNaN(crush)) { // is not a member nor a role
      crush = 0;
      for (let i = 0; i < args.length; i++) {
        crush += args[i].charCodeAt();
      }
      if (crush !== 0) crush = crush.toString();
      else crush = "";
      crush = (crush ? crush.toString() : "");
    }
  }

  // or if (!args.length)
  if (!crush.length) {
    crush = message.guild.id; // love everyone
    everyone = true;
  }
  
  const result = (parseInt(message.author.id) % 101 + parseInt(crush) % 101) % 101;

  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));

  let something = "";
  if (member) something = member.user.username;
  else if (role) something = role.name;
  else if (everyone) something = message.guild.name;
  else something = args.join(" ");

  embed.addField(
    i18n("CRUSH_TITLE", settings.language).replace("{{emoji}}", Emoji.HEART_FIRE.text),
    i18n("CRUSH_AMOUNT", settings.language)
      .replace("{{amount}}", Math.abs(result))
      .replace("{{variable}}", something)
  );

  return message.lineReplyNoMention(embed).catch(e => {});
};

exports.conf = {
  name: "crush",
  permLevel: "User",
  cooldown: 10,
  enabled: true,
  guildOnly: true,
  aliases: ["affinity", "affinite"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_CRUSH_NAME", language),
    category: i18n("HELP_CRUSH_CATEGORY", language),
    description: i18n("HELP_CRUSH_DESCRIPTION", language),
    usage: i18n("HELP_CRUSH_USAGE", language)
  }
}
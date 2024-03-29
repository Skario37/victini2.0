const { i18n } = require("../../utils/i18n");
const { MessageEmbed } = require("discord.js");
const { getEmbedColor } = require("../../utils/Functions");
const { getPerm, getPermNameByLevel } = require("../../utils/PermLevel");
const Config = require("../../config.json");
const { getMember } = require("../../utils/Guild");

exports.run = async (client, message, args, settings) => {
  let user = message.author;
  let member = await getMember(message, args);
  let permName = getPermNameByLevel(message.author.permLevel);
  
  if (member) {
    const memberSettings = Config.DEFAULTSETTINGS;
    permName = getPermNameByLevel(getPerm(message, member, memberSettings));
    user = member.user;
  }
    

  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));
  embed.setAuthor(
    `${message.author.username}#${message.author.discriminator}`,
    message.author.displayAvatarURL()
  );

  embed.addField( 
    `${user.username}#${user.discriminator}`, 
    i18n("PERM_DISPLAY", settings.language)
      .replace("{{permName}}", permName)
  );

  embed.setImage(user.displayAvatarURL());

  message.reply({embeds: [embed], allowedMentions: { repliedUser: false}});
};

exports.conf = {
  name: "permission",
  permLevel: "User",
  cooldown: 10,
  enabled: true,
  guildOnly: false,
  aliases: ["perm"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_PERM_NAME", language),
    category: i18n("HELP_PERM_CATEGORY", language),
    description: i18n("HELP_PERM_DESCRIPTION", language),
    usage: i18n("HELP_PERM_USAGE", language)
  }
}

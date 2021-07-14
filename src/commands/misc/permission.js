const i18n = require("../../utils/i18n").i18n;
const MessageEmbed = require("discord.js").MessageEmbed;
const getEmbedColor = require("../../utils/Functions").getEmbedColor;
const getPerm = require("../../utils/PermLevel").getPerm;
const getPermNameByLevel = require("../../utils/PermLevel").getPermNameByLevel;
const Config = require("../../config.json");

exports.run = async (client, message, args, settings) => {
  let user = message.author;
  let member = undefined;
  let permName = getPermNameByLevel(message.author.permLevel);
  if (message.channel.type !== "dm") {
    if (args.length) {
      member = message.guild.member(message.mentions.users.first()) // By mention
      
      if (!member) {
        const argId = args[0];
        member = await message.guild.members.fetch(argId).catch(e => undefined) // By ID
      }
      
      if (!member) {
        const arg = args.join(" ");
        const lastIndex = arg.lastIndexOf("#");
        const last = (lastIndex !== -1 ? arg.substr(lastIndex, arg.length) : "");
        const discriminator = last.substring(1);
        const username = arg.replace(last,"");
        let members = await message.guild.members.fetch({"query": username, "limit": 100}); // By username
        if (members.size > 0) {
          if (isNaN(discriminator)) {
            member = members.find(m => m.user.discriminator === discriminator && m.user.username === username);
          } else {
            member = members.find(m => m.user.username === username) || members.values().next().value;
          }
        } else {
          members = await message.guild.members.fetch({"query": arg, "limit": 100}); // By username
          if (members.size > 0) member = members.find(m => m.user.username === username) || members.values().next().value;
        }
      }
      
      if (member) {
        const memberSettings = Config.DEFAULTSETTINGS;
        permName = getPermNameByLevel(getPerm(message, member, memberSettings));
        user = member.user;
      }
    }
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

  message.channel.send(embed);
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

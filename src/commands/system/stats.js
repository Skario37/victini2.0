const { version } = require("discord.js");
const moment = require("moment");
const MessageEmbed = require("discord.js").MessageEmbed;
const i18n = require("../../utils/i18n").i18n;
const dhm = require("../../utils/Date").dhm;
const getEmbedColor = require("../../utils/Functions").getEmbedColor;


module.exports.run = (client, message, args, settings) => {
  const now = Date.now();
  const elapsed = now - (now - client.uptime);
  let duration = dhm(elapsed);

  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));
  embed.setTitle("= STATS =");
  embed.addFields(
    {
      "name": i18n("STATS_MEMORY_USAGE", settings.language), 
      "value": `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      "inline": true
    },
    {
      "name": i18n("STATS_UPTIME", settings.language), 
      "value": duration,
      "inline": true
    },
    {
      "name": i18n("STATS_GUILDS", settings.language), 
      "value": client.guilds.cache.size,
      "inline": true
    },
    {
      "name": i18n("STATS_USERS", settings.language), 
      "value": client.users.cache.size,
      "inline": true
    },
    {
      "name": i18n("STATS_API_VERSION", settings.language), 
      "value": version,
      "inline": true
    },
    {
      "name": i18n("STATS_NODE_VERSION", settings.language), 
      "value": process.version,
      "inline": true
    }
  );

  message.channel.send(embed);
};

exports.conf = {
  name: "stats",
  permLevel: "User",
  cooldown: 30,
  enabled: true,
  guildOnly: false,
  aliases: ["stat"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_STATS_NAME", language),
    category: i18n("HELP_STATS_CATEGORY", language),
    description: i18n("HELP_STATS_DESCRIPTION", language),
    usage: i18n("HELP_STATS_USAGE", language)
  }
}
const { version } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { i18n } = require("../../utils/i18n");
const { dhm } = require("../../utils/Date");
const { getEmbedColor } = require("../../utils/Functions");
const error = require("../../utils/Loader").error;


module.exports.run = async (client, message, args, settings) => {
  const now = Date.now();
  const elapsed = now - (now - client.uptime);
  let duration = dhm(elapsed);

  const promises = [
    client.shard.fetchClientValues('guilds.cache.size'),
    client.shard.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
  ];

  const total = await Promise.all(promises)
    .then(results => {
      return {
        guilds: results[0].reduce((acc, guildCount) => acc + guildCount, 0),
        members: results[1].reduce((acc, memberCount) => acc + memberCount, 0)
      }
    })
    .catch(e => {
      error(e);
      return [-1,-1]
    });
  
  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));
  embed.setTitle(i18n("STATS_TITLE"));
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
      "value": total.guilds,
      "inline": true
    },
    {
      "name": i18n("STATS_USERS", settings.language), 
      "value": total.members,
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

  message.reply({embeds: [embed], allowedMentions: { repliedUser: false}}).catch(e => {});
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
const MessageEmbed = require("discord.js").MessageEmbed;
const i18n = require("../../utils/i18n").i18n;
const Emoji = require("../../pictogram/emoji.json");
const getEmbedColor = require("../../utils/Functions").getEmbedColor;

exports.run = async (client, message, args, settings) => {
  const msg = await message.channel.send(
    {
      "ping": i18n("PING_WAIT", settings.language), 
      "pong": i18n("PONG_WAIT", settings.language)
    }[message.commandName]
  );

  const botPing = msg.createdTimestamp - message.createdTimestamp;
  const apiPing = Math.round(client.ws.ping);
  const average = (botPing + apiPing) / 2;

  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));

  embed.addField( 
    { 
      "ping": i18n("PING_SEND", settings.language)
        .replace("{{variable}}", Emoji.PING.text), 
      "pong": i18n("PONG_SEND", settings.language)
        .replace("{{variable}}", Emoji.PING.text) 
    }[message.commandName], 
    i18n("PING_LATENCY", settings.language)
      .replace("{{botPing}}", botPing)
      .replace("{{apiPing}}", apiPing)
  );

  if        ( average <= 200  ) { 
    embed.addField(
      "\u200b", 
      i18n("PING_LOW", settings.language)
        .replace("{{author}}", message.author)
        .replace("{{emoji}}", Emoji.VICTINI.text)
    )
  } else if ( average <= 1200 ) { 
    embed.addField(
      "\u200b", 
      i18n("PING_MEDIUM", settings.language)
        .replace("{{author}}", message.author)
        .replace("{{emoji}}", Emoji.VICTINI.text)
    )
      
  } else if ( average >  1200 ) { 
    embed.addField( 
      "\u200b", 
      i18n("PING_HIGH", settings.language)
        .replace("{{author}}", message.author)
        .replace("{{emoji}}", Emoji.VICTINI.text)
    )
  }
  msg.edit(embed);
};

exports.conf = {
  name: "ping",
  permLevel: "User",
  cooldown: 1,
  enabled: true,
  guildOnly: false,
  aliases: ["pong"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_PING_NAME", language),
    category: i18n("HELP_PING_CATEGORY", language),
    description: i18n("HELP_PING_DESCRIPTION", language),
    usage: i18n("HELP_PING_USAGE", language)
  }
}
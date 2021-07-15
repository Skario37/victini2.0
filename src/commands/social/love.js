const Gfycat = require("gfycat-sdk");
const gfycat = new Gfycat({"clientId": process.env.GFYCAT_API_ID, "clientSecret": process.env.GFYCAT_API_KEY});
const Tenor = require("tenorjs").client({
  "Key": process.env.TENOR_API_KEY, // https://tenor.com/developer/keyregistration
  "Filter": "high", // "off", "low", "medium", "high", not case sensitive
  "Locale": "en_US", // Your locale here, case-sensitivity depends on input
  "MediaFilter": "minimal", // either minimal or basic, not case sensitive
  "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});
const giphy = require("giphy-api")(process.env.GIPHY_API_KEY);


const i18n = require("../../utils/i18n").i18n;
const Emoji = require("../../pictogram/emoji.json");
const MessageEmbed = require("discord.js").MessageEmbed;
const getEmbedColor = require("../../utils/Functions").getEmbedColor;
const getMember = require("../../utils/Guild").getMember;

exports.run = async (client, message, args, settings) => {
  const gifs = [];

  let member = await getMember(message, args);

  // Gfycat
  const dataGfycat = await gfycat.search({"search_text": "love", "count": 10}).then(d => {
    if (d.found <= 0) return undefined;
    const gfy = d.gfycats[Math.floor(Math.random()*d.gfycats.length)];
    return gfy.max5mbGif || gfy.max2mbGif || gfy.max1mbGif || gfy.webpUrl || gfy.webmUrl || gfy.mp4Url || gfy.gifUrl || gfy.mobileUrl || gfy.miniUrl || gfy.gif100px;
  }).catch(e => undefined);
  if (dataGfycat) gifs.push(dataGfycat);
  // EOF Gfycat

  // Giphy
  const dataGiphy = await giphy.search({"q": "love", "limit": 20, "rating": "pg", "fmt": "json"}).then(d => {
    if (d.data.length === 0) return undefined;
    return d.data[Math.floor(Math.random()*d.data.length)].images.original.url;
  }).catch(e => undefined);
  if (dataGiphy) gifs.push(dataGiphy);
  // EOF Giphy


  // Tenor
  const dataTenor = await Tenor.Search.Query("love", "15").then(d => {
    if (d.length === 0) return undefined;
    return d[Math.floor(Math.random()*d.length)].media[0].tinygif.url;
  }).catch(e => undefined);
  if (dataTenor) gifs.push(dataTenor);
  // EOF Tenor
 
  if (gifs.length) {
    const embed = new MessageEmbed();
    embed.setColor(getEmbedColor(settings));
    embed.setAuthor(
      `${message.member.nickname || message.member.user.username}`,
      message.author.displayAvatarURL()
    );

    if (args.length) {
      args = args.join(" ");
      if (member) args = member.nickname || member.user.username;
      embed.setTitle(
        i18n("GIF_LOVE_SOMETHING", settings.language)
          .replace("{{emoji}}", Emoji.LOVE.text)
          .replace("{{author}}", message.member.nickname || message.member.user.username)
          .replace("{{variable}}", args)
      );
    } else {
      embed.setTitle(
        i18n("GIF_LOVE_YOURSELF", settings.language)
          .replace("{{emoji}}", Emoji.LOVE.text)
          .replace("{{author}}", message.member.nickname || message.member.user.username)
      );
    }

    
    embed.setImage(gifs[Math.floor(Math.random()*gifs.length)]);


    return message.lineReplyNoMention(embed);
  } else {
    return message.lineReplyNoMention(i18n("GIF_NOT_FOUND", settings.language))
    .then(msg => {
      message.delete({"timeout": 10000}).catch(e => {});
      msg.delete({"timeout": 10000}).catch(e => {});
    });
  }

};

exports.conf = {
  name: "love",
  permLevel: "User",
  cooldown: 15,
  enabled: true,
  guildOnly: false,
  aliases: ["amour", "poulet", "chicken"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_LOVE_NAME", language),
    category: i18n("HELP_LOVE_CATEGORY", language),
    description: i18n("HELP_LOVE_DESCRIPTION", language),
    usage: i18n("HELP_LOVE_USAGE", language)
  }
}
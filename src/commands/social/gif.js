const i18n = require("../../utils/i18n").i18n;
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

exports.run = async (client, message, args, settings) => {
  const gifs = [];

  if (args.length) {
    args = args.join(" ");
    // Gfycat
    const dataGfycat = await gfycat.search({"search_text": args, "count": 5}).then(d => {
      if (d.found <= 0) return undefined;
      const gfy = d.gfycats[Math.floor(Math.random()*d.gfycats.length)];
      return gfy.max5mbGif || gfy.max2mbGif || gfy.max1mbGif || gfy.webpUrl || gfy.webmUrl || gfy.mp4Url || gfy.gifUrl || gfy.mobileUrl || gfy.miniUrl || gfy.gif100px;
    }).catch(e => undefined);
    if (dataGfycat) gifs.push(dataGfycat);
    // EOF Gfycat

    // Giphy
    const dataGiphy = await giphy.search({"q": args, "limit": 5, "rating": "pg", "fmt": "json"}).then(d => {
      if (d.data.length === 0) return undefined;
      return d.data[Math.floor(Math.random()*d.data.length)].url;
    }).catch(e => undefined);
    if (dataGiphy) gifs.push(dataGiphy);
    // EOF Giphy


    // Tenor
    const dataTenor = await Tenor.Search.Query(args, "5").then(d => {
      if (d.length === 0) return undefined;
      return d[Math.floor(Math.random()*d.length)].url;
    }).catch(e => undefined);
    if (dataTenor) gifs.push(dataTenor);
    // EOF Tenor
  } else {
    // Gfycat
    const dataGfycat = await gfycat.trendingGifs({"count": 50}).then(d => {
      if (d.found <= 0) return undefined;
      const gfy = d.gfycats[Math.floor(Math.random()*d.gfycats.length)];
      return gfy.max5mbGif || gfy.max2mbGif || gfy.max1mbGif || gfy.webpUrl || gfy.webmUrl || gfy.mp4Url || gfy.gifUrl || gfy.mobileUrl || gfy.miniUrl || gfy.gif100px;
    }).catch(e => undefined);
    if (dataGfycat) gifs.push(dataGfycat);
    // EOF Gfycat

    // Giphy
    const dataGiphy = await giphy.trending({"limit": 50, "rating": "pg", "fmt": "json"}).then(d => {
      if (d.data.length === 0) return undefined;
      return d.data[Math.floor(Math.random()*d.data.length)].url;
    }).catch(e => undefined);
    if (dataGiphy) gifs.push(dataGiphy);
    // EOF Giphy


    // Tenor
    const dataTenor = await Tenor.Trending.GIFs("50").then(d => {
      if (d.length === 0) return undefined;
      return d[Math.floor(Math.random()*d.length)].url;
    }).catch(e => undefined);
    if (dataTenor) gifs.push(dataTenor);
    // EOF Tenor
  }

  if (gifs.length) {
    return message.lineReplyNoMention(gifs[Math.floor(Math.random()*gifs.length)]);
  } else {
    return message.lineReplyNoMention(i18n("GIF_NOT_FOUND", settings.language))
    .then(msg => {
      message.delete({"timeout": 10000}).catch(e => {});
      msg.delete({"timeout": 10000}).catch(e => {});
    });
  }
};

exports.conf = {
  name: "gif",
  permLevel: "User",
  cooldown: 30,
  enabled: true,
  guildOnly: false,
  aliases: []
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_GIF_NAME", language),
    category: i18n("HELP_GIF_CATEGORY", language),
    description: i18n("HELP_GIF_DESCRIPTION", language),
    usage: i18n("HELP_GIF_USAGE", language)
  }
}
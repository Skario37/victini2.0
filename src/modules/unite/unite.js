const fs = require("fs");
const https = require('https');
const md5 = require('md5');
const pathResolve = require("path").resolve;
const { MessageEmbed } = require("discord.js");
const { timer } = require("../../utils/Functions");
const { error } = require("../../utils/Logger");

const path = pathResolve(__dirname, "config.json");
let uniteConfig = require(path);

let writingConfig = false;
let watchConfig = null;

const requestIntervals = [];

const observeConfig = () => {
  let md5Previous = null;
  let fsWait = false;
  watchConfig = fs.watch(path, (event, filename) => {
    if (filename && writingConfig) return writingConfig = false; 
    if (filename) {
      if (fsWait) return;
      fsWait = setTimeout(() => fsWait = false, 100);
      const md5Current = md5(fs.readFileSync(path));
      if (md5Current === md5Previous) return;
      md5Previous = md5Current;

      delete require.cache[require.resolve(path)];
      uniteConfig = require(path);
    }
  });
}

const dotcomImagesInit = async (client) => {
  // Pokémon filter
  let pokemon = uniteConfig.POKEMON.concat(uniteConfig.ALOLAN_POKEMON, uniteConfig.GALARIAN_POKEMON);
  pokemon = pokemon.filter(p => {
    if (uniteConfig.KNOWN_POKEMON.indexOf(p) >= 0) return false;
    if (uniteConfig.KNOWN_SUB_POKEMON.indexOf(p) >= 0) return false;
    return true;
  });

  // Callback for Pokémon images
  const callback = (url, index, pokemon, res) => {
    if (this.conf.unsubscribed) return;
    if (res.statusCode === 200) {
      if (uniteConfig.KNOWN_POKEMON.indexOf(pokemon) === -1) {
        uniteConfig.KNOWN_POKEMON.push(pokemon);
        setUniteConfig("KNOWN_POKEMON", uniteConfig.KNOWN_POKEMON);
      }
      clearInterval(requestIntervals[index]);

      const embed = new MessageEmbed();
      embed.setAuthor("A new image!");
      embed.setTitle(url);
      embed.setImage(url);
      embed.setURL(url);
      embed.setFooter("Is now accessible.");

      client.channels.fetch(uniteConfig.DOTCOM_IMAGES.channel)
        .then((channel) => channel.send(embed));
    }
  };

  // Iterate over all filtered Pokémon
  for (let i = 0; i < pokemon.length; i++) {
    if (this.conf.unsubscribed) return;
    for (const category of uniteConfig.DOTCOM_IMAGES.categories) {
      if (this.conf.unsubscribed) return;
      const parsed_url = uniteConfig.DOTCOM_IMAGES.url
      .replace(/{{name}}/g, pokemon[i]) // Replace {name} by the Pokémon name
      .replace(/{{category}}/g, category);

      // Reserve interval
      const interval = undefined;
      const index = requestIntervals.push(interval) - 1;

      https.get(parsed_url, res => callback(parsed_url, index, pokemon[i], res))
        .on("error", (e) => error(e));
      requestIntervals[index] = setInterval(
        () => https.get(parsed_url, res => callback(parsed_url, index, pokemon[i], res)).on("error", (e) => error(e)), 
        uniteConfig.DOTCOM_IMAGES.interval
      );
      await timer(uniteConfig.DOTCOM_IMAGES.interval / pokemon.length * uniteConfig.DOTCOM_IMAGES.categories.length);
    }
  }
}

const dotcomPokemonInit = async (client) => {
  // Pokémon filter
  let pokemon = uniteConfig.POKEMON.concat(uniteConfig.ALOLAN_POKEMON, uniteConfig.GALARIAN_POKEMON);
  pokemon = pokemon.filter(p => {
    if (uniteConfig.KNOWN_URL.indexOf(p) >= 0) return false;
    if (uniteConfig.KNOWN_SUB_POKEMON.indexOf(p) >= 0) return false;
    return true;
  });

  // Callback for Pokémon images
  const callback = (url, index, pokemon, res) => {
    if (this.conf.unsubscribed) return;
    if (res.statusCode === 200) {
      uniteConfig.KNOWN_URL.push(pokemon);
      setUniteConfig("KNOWN_URL", uniteConfig.KNOWN_URL);
      clearInterval(requestIntervals[index]);

      const embed = new MessageEmbed();
      embed.setAuthor("A new page!");
      embed.setTitle(url);
      embed.setURL(url);
      embed.setFooter("Is now accessible.");

      client.channels.fetch(uniteConfig.DOTCOM_POKEMON.channel)
        .then((channel) => channel.send(embed));
    }
  };

  // Iterate over all filtered Pokémon
  for (let i = 0; i < pokemon.length; i++) {
    if (this.conf.unsubscribed) return;
    const parsed_url = uniteConfig.DOTCOM_POKEMON.url
      .replace(/{{name}}/g, pokemon[i]) // Replace {name} by the Pokémon name

    // Reserve interval
    const interval = undefined;
    const index = requestIntervals.push(interval) - 1;

    https.get(parsed_url, res => callback(parsed_url, index, pokemon[i], res))
      .on("error", (e) => error(e));
    requestIntervals[index] = setInterval(
      () => https.get(parsed_url, res => callback(parsed_url, index, pokemon[i], res)).on("error", (e) => error(e)), 
      uniteConfig.DOTCOM_POKEMON.interval
    );
    await timer(uniteConfig.DOTCOM_POKEMON.interval / pokemon.length * uniteConfig.DOTCOM_IMAGES.categories.length);
  }
}

const japanNewsInit = (client) => {
  // Reserve interval
  const interval = undefined;
  const index = requestIntervals.push(interval) - 1; // return reserved interval index

  const callback = res => {
    if (this.conf.unsubscribed) return;
    if (res.statusCode === 200) {
      let str = "";
      res.setEncoding('utf8');
      res.on('data', chunk => str += chunk);
      res.on('end', () => {
        const results = JSON.parse(str).results;
        const news = results.filter(r => !uniteConfig.KNOWN_JAPAN_NEWS_ID.includes(r.id));
        for (const nw of news) {
          uniteConfig.KNOWN_JAPAN_NEWS_ID.push(nw.id);
          setUniteConfig("KNOWN_JAPAN_NEWS_ID", uniteConfig.KNOWN_JAPAN_NEWS_ID);
          
          const embed = new MessageEmbed();
          embed.setAuthor("A news has come!");
          embed.setTitle(nw.title);
          embed.setImage(nw.img_1);
          embed.setURL(nw.type === "body" ? `https://www.pokemonunite.jp${nw.uniq}` : nw.uniq);
          embed.setFooter(`Starting: ${nw.start_date}`);

          client.channels.fetch(uniteConfig.JAPAN_NEWS.channel)
            .then((channel) => channel.send(embed));
        }
      });
    }
  }

  https.get(uniteConfig.JAPAN_NEWS.url, res => callback(res))
    .on("error", (e) => error(e));
  requestIntervals[index] = setInterval(
    () => https.get(uniteConfig.JAPAN_NEWS.url, res => callback(res)).on("error", (e) => error(e)), 
    uniteConfig.JAPAN_NEWS.interval
  );
}

const japanPokemonInit = (client) => {
  // Day of week
  // Take a week ahead
  for (let day = 0; day < 7; day++) {
    if (this.conf.unsubscribed) return;
    const fullDate = getFullDate(day);
    const parsed_url_date = uniteConfig.JAPAN_POKEMON.url.replace(/{{date}}/g, fullDate);
    const parsed_url = parsed_url_date.replace("{{number}}", "01");

    const interval = undefined;
    const index = requestIntervals.push(interval) - 1;

    const callback = (url, index, res) => {
      if (this.conf.unsubscribed) return;
      if (res.statusCode === 200) {
        if (uniteConfig.KNOWN_JAPAN_URL.indexOf(url) === -1) {
          uniteConfig.KNOWN_JAPAN_URL.push(url);
          setUniteConfig("KNOWN_JAPAN_URL", uniteConfig.KNOWN_JAPAN_URL);
          clearInterval(requestIntervals[index]);

          const embed = new MessageEmbed();
          embed.setAuthor("A new page!");
          embed.setTitle(url);
          embed.setURL(url);
          embed.setFooter("Is now accessible.");

          client.channels.fetch(uniteConfig.JAPAN_POKEMON.channel)
            .then((channel) => channel.send(embed));
        }
        let numberStr = url.slice(-3);
        numberStr = numberStr.substring(numberStr.length - 1, -1);
        numberStr = parseInt(numberStr) + 1;
        numberStr = numberStr < 10 ? `0${numberStr}` : numberStr;
        url = parsed_url_date.replace(/{{number}}/g, numberStr);
        https.get(url, res => callback(url, index, res))
          .on("error", (e) => error(e));
      }
    };

    https.get(parsed_url, res => callback(parsed_url, index, res))
      .on("error", (e) => error(e));
    requestIntervals[index] = setInterval(
      () => https.get(parsed_url, res => callback(parsed_url, index, res)).on("error", (e) => error(e)),
      uniteConfig.JAPAN_POKEMON.interval
    );
  }
}

const eShopInit = (client) => {
// Day of week
  // Take a week ahead
  if (this.conf.unsubscribed || (uniteConfig.FR_RELEASED && uniteConfig.JP_RELEASED)) return;

  const interval = undefined;
  const index = requestIntervals.push(interval) - 1;

  const callback = (key, index, res) => {
    if (this.conf.unsubscribed) return;
    if (res.statusCode === 200) {
      let str = "";
      res.setEncoding('utf8');
      res.on('data', chunk => str += chunk);
      res.on('end', () => {
        const results = JSON.parse(str)
        if (results.prices[0].sales_status === "onsale") {
          uniteConfig[`${key}_RELEASED`] = true;
          setUniteConfig(`${key}_RELEASED`, true);
          clearInterval(requestIntervals[index]);

          const embed = new MessageEmbed();
          embed.setAuthor(`Pokémon Unite is now available to play on ${key} eShop!`);

          client.channels.fetch(uniteConfig.ESHOP.channel)
            .then((channel) => {
              channel.send(embed);
              channel.send(`<@${uniteConfig.ESHOP.mention}>`);
            });
        }
      });
    }
  };

  https.get(uniteConfig.ESHOP.JP, res => callback("JP", index, res))
    .on("error", (e) => error(e));
  requestIntervals[index] = setInterval(
    () => https.get(uniteConfig.ESHOP.JP, res => callback("JP", index, res)).on("error", (e) => error(e)),
    uniteConfig.ESHOP.interval
  );

  https.get(uniteConfig.ESHOP.FR, res => callback("FR", index, res))
    .on("error", (e) => error(e));
  requestIntervals[index] = setInterval(
    () => https.get(uniteConfig.ESHOP.FR, res => callback("FR", index, res)).on("error", (e) => error(e)),
    uniteConfig.ESHOP.interval
  );
}

const setUniteConfig = (key, value) => {
  writingConfig = true;

  uniteConfig[key] = value;
  fs.writeFile(
    path, 
    JSON.stringify(uniteConfig,null,2),
    (e) => {
      if (e) error(e);
    }
  );
}

/**
 * Return the full date in japanese format
 * @returns fullDate YearMonthDay in number
 */
 const getFullDate = (i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  let year = date.getFullYear().toString().substring(2);
  let month = date.getMonth() + 1;
  month = (month < 10 ? `0${month}` : month);
  let day = date.getDate();
  day = (day < 10 ? `0${day}`: day);
  return `${year}${month}${day}`;
}

exports.init = (client) => {
  this.conf.unsubscribed = false;
  observeConfig();

  dotcomImagesInit(client);
  dotcomPokemonInit(client);
  japanNewsInit(client);
  japanPokemonInit(client);
  eShopInit(client);
}

exports.commands = []

exports.conf = {
  name: "unite",
  enabled: true,
  unsubscribed: false
}

exports.unsubscribe = () => {
  this.conf.unsubscribed = true;

  watchConfig.close();
  
  for (const requestInterval of requestIntervals) {
    clearInterval(requestInterval);
  }
}
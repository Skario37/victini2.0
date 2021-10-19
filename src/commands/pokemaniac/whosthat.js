const { i18n } = require("../../utils/i18n");
const Config = require("../../config.json");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { getEmbedColor } = require("../../utils/Functions");
const Emoji = require("../../pictogram/emoji.json");
const { getWhosThatForm, getWhosThatPokemon, getFileSprite } = require("../../utils/database/Query");
const { getRandomInt } = require("../../utils/Math");
const Jimp = require('jimp');

const VERYEASY = 0;
const EASY = 1;
const MEDIUM = 3;
const HARD = 3;
const VERYHARD = 4;


exports.run = async (client, message, args, settings) => {
  if (client.games?.has(message.channelId)) return message.delete().catch(e => {});
  let difficulty = MEDIUM;
  let game_language = settings.language;
  for (let i = args.length-1; i >= 0; i--) {
    if (args[i].startsWith("--language=") || args[i].startsWith("--l=")) {
      const l = args.splice(i,1)[0].split("=")[1].toUpperCase();
      if (Config.LANGUAGES.includes(l)) game_language = l;
    } else if (args[i] === "--ve" || args[i] === "--veryeasy") {
      difficulty = EASY;
    } else if (args[i] === "--e" || args[i] === "--easy") {
      difficulty = EASY;
    } else if (args[i] === "--m" || args[i] === "--medium") {
      difficulty = MEDIUM;
    } else if (args[i] === "--h" || args[i] === "--hard") {
      difficulty = HARD;
    } else if (args[i] === "--vh" || args[i] === "--veryhard") {
      difficulty = VERYHARD;
    }
  }

  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));

  embed.setTitle(
    i18n("WHOSTHAT_TITLE", settings.language)
      .replace("{{emoji}}", Emoji.WHOSTHAT.text)
      .replace("{{language}}", game_language)
      .replace("{{difficulty}}", difficulty)
  );

  embed.addField( 
    i18n("GAME_START_IN", settings.language), 
    `15 ${i18n("SECONDS", settings.language)}`
  );


  const msg = await message.reply({embeds:[embed]});
  if (client.games) client.games.set(message.channelId, true);
  else client.games = new Map();


  async function getWhos() {
    const whos = {};
    const images = [];
    let row;
    if (difficulty === MEDIUM) {
      const rows = await getWhosThatPokemon()?.rows;
      if (!rows) return;
      row = rows[getRandomInt(0, rows.length)];
      if (row.has_gender_difference) {
        images.push(row.front_default);
        images.push(row.front_female);
      } else images.push(row.front_default);
      whos.pokemon = row[`species_${game_language.toLowerCase()}`];
    } else if (difficulty === VERYEASY) {
      const rows = await getWhosThatPokemon()?.rows;
      if (!rows) return;
      row = rows[getRandomInt(0, rows.length)];
      images.push(row.front_default);
      whos.pokemon = row[`species_${game_language.toLowerCase()}`];
    } else if (difficulty === EASY) {
      const rows = await getWhosThatPokemon()?.rows;
      if (!rows) return;
      row = rows[getRandomInt(0, rows.length)];
      images.push(row.front_default);
      whos.pokemon = row[`species_${game_language.toLowerCase()}`];
    } else if (difficulty === HARD) {
      let rows = await getWhosThatForm()?.rows;
      if (!rows) return;
      rows = rows.filter(filterForm);
      row = rows[getRandomInt(0, rows.length)];
      const images = [];
      if (row.back_default) images.push(row.back_default);
      if (row.back_female) images.push(row.back_female);
      if (row.has_gender_difference) {
        images.push(row.front_default);
        images.push(row.front_female);
      } else images.push(row.front_default);
      row = specialPokemon(row);
      whos.pokemon = row[`form_${game_language.toLowerCase()}`] ?? row[`species_${game_language.toLowerCase()}`];
    } else if (difficulty === VERYHARD) {
      let rows = await getWhosThatForm()?.rows;
      if (!rows) return;
      rows = rows.filter(filterForm);
      row = rows[getRandomInt(0, rows.length)];
      if (row.back_default) images.push(row.back_default);
      if (row.back_female) images.push(row.back_female);
      if (row.has_gender_difference) {
        images.push(row.front_default);
        images.push(row.front_female);
      } else images.push(row.front_default);
      row = specialPokemon(row);
      whos.pokemon = row[`form_${game_language.toLowerCase()}`] ?? row[`species_${game_language.toLowerCase()}`];
    }
  
    whos.image = '/images/' + await getFileSprite(images[getRandomInt(0,images.length)])?.rows;
    if (!whos.image) return;
    whos.color = '#' + row.color;
    whos.pokemon

    return whos;
  }
  
  setTimeout(async () => {
    

    const whos = await getWhos();
    if (!whos) return msg.edit({content: i18n("DB_FAIL_MESSAGE", settings.language), allowedMentions: { repliedUser: false }});

    embed.setColor(whos.color);
    embed.setTitle(
      i18n("WHOSTHAT_TITLE", settings.language)
        .replace("{{emoji}}", Emoji.WHOSTHAT.text)
        .replace("{{language}}", game_language)
        .replace("{{difficulty}}", difficulty)
    );

    const img = await Jimp.read(whos.image);
    if (difficulty === MEDIUM) img.shadow();
    //else if (difficulty === VERYEASY) 
    else if (difficulty === EASY) img.shadow();
    else if (difficulty === HARD) img.shadow();
    else if (difficulty === VERYHARD) img.shadow();

    const attachment = new MessageAttachment(img, "pokemon.png");
    embed.setImage("attachment://pokemon.png");

    // Looping time
    let totalTime = 120000; // 2min
    const refreshTime = 10000; // 10s
    const timestamp = Date.now();
    const interval = setInterval(() => {
      if ((totalTime -= refreshTime) > 0) {
        embed.fields[0] = { 
          "name": i18n("GAME_END_IN", settings.language), 
          "value": `${totalTime} ${i18n("SECONDS", settings.language)}`
        };
      } else {
        endMessage(msg.author, true, undefined);
        return;
      }
      msg.edit({embeds:[embed], files: [attachment]});
    }, refreshTime);


    const endMessage = (user, noTime, time) => {
      client.off("messageCreate", onMessage);
      clearInterval(interval);
      if (noTime) {
        embed.fields[0] = { 
          "name": i18n("GAME_END_NO_WINNER", settings.language), 
          "value": "\u200b"
        };
      } else {
        embed.fields[0] = { 
          "name": i18n("GAME_END_WINNER", settings.language).replace("{{user}}"), 
          "value": i18n("WHOSTHAT_END_WINNER", settings.language)
            .replace("{{user}}", user)
            .replace("{{pokemon}}", whos.pokemon)
            .replace("{{time}}", time)
            .replace("{{language}}", game_language)
            .replace("{{difficulty}}", difficulty)
        };
      }
      msg.reply({embeds:[embed]})
    }

    const onMessage = (client, message) => {
      if (message.author.bot) return;
      if (message.content === "") return;
      const time = timestamp - Date.now();
      
      if (difficulty === MEDIUM) {
        if (message.content.replace(/\p{Diacritic}/gu, "").toLowerCase().replaceAll("œ", "oe") === whos.pokemon.replace(/\p{Diacritic}/gu, "").toLowerCase().replaceAll("œ", "oe")) return endMessage(message.author, false, time);
      } else if (difficulty === VERYEASY) {
        if (message.content.replace(/\p{Diacritic}/gu, "").toLowerCase().replaceAll("œ", "oe") === whos.pokemon.replace(/\p{Diacritic}/gu, "").toLowerCase().replaceAll("œ", "oe")) return endMessage(message.author, false, time);
      } else if (difficulty === EASY) {
        if (message.content.replace(/\p{Diacritic}/gu, "").toLowerCase().replaceAll("œ", "oe") === whos.pokemon.replace(/\p{Diacritic}/gu, "").toLowerCase().replaceAll("œ", "oe")) return endMessage(message.author, false, time);
      } else if (difficulty === HARD) {
        if (message.content.toLowerCase() === whos.pokemon.toLowerCase()) return endMessage(message.author, false, time);
      } else if (difficulty === VERYHARD) {
        if (message.content === whos.pokemon) return endMessage(message.author, false, time);
      }
    }

    client.on("messageCreate", onMessage);
  }, 15000);
}

// Because some pokémon cant be compared to their original version and we DONT WANT them
function filterForm(form) {
  if (form.form_fr.startsWith("Pikachu Casquette")) return false; // cant compare
  if (form.form_en === "Battle Bond Greninja") return false; // cant compare
  if (form.form_en === "Active Xerneas") return false; // cant compare
  if (form.species_en === "Zygarde") return false; // zygarde = zygarde 50% but we ask to tell the form not the species
  if (form.form_en.startsWith("Totem")) return false; // cant compare
  if (form.form_en === "Rocabot Own Tempo") return false; // cant compare
  if (form.form_en === "Original Color Magearna") return false; // cant compare
}

// Because some pokémon cant be compared to their original version and we WANT them but with species name instead of form name
function specialPokemon(pokemon) {
  const excludes = ["Arceus", "Genesect", "Vivillon", "Flabébé", "Floette", "Florges", "Polteageist", "Sinistea", "Alcremie"];
  for (const p of excludes) {
    if (pokemon.form_en.includes(p)) {
      pokemon.form_en = false;
      pokemon.form_fr = false;
    }
  }

  // Special in special... yeah
  if (pokemon.form_en.includes("Meteor Minior")) {
    pokemon.form_en = "Meteor Minior";
    pokemon.form_fr = "Météno Météor";
  } 
  if (pokemon.form_en.includes("Core Minior")) {
    pokemon.form_en = "Core Minior";
    pokemon.form_fr = "Météno Noyau";
  } 
  if (pokemon.form_en.includes("Toxtricity") && pokemon.form_en.includes("Gigantamax")) {
    pokemon.form_en = "Gigantamax Toxtricity";
    pokemon.form_fr = "Salarsen Gigamax";
  }
  if (pokemon.form_en.includes("Gigantamax Flapple")) { 
    pokemon.second_form_en = "Gigantamax Appletun";
    pokemon.second_form_fr = "Dratatin Gigamax";
  } 
  if (pokemon.form_en.includes("Gigantamax Appletun")) { 
    pokemon.second_form_en = "Gigantamax Flapple";
    pokemon.second_form_fr = "Flapple Gigamax"
  }

  return pokemon;
}

exports.conf = {
  name: "whosthat",
  permLevel: "User",
  cooldown: 30,
  enabled: true,
  guildOnly: false,
  aliases: ["wt"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_WHOSTHAT_NAME", language),
    category: i18n("HELP_WHOSTHAT_CATEGORY", language),
    description: i18n("HELP_WHOSTHAT_DESCRIPTION", language),
    usage: i18n("HELP_WHOSTHAT_USAGE", language)
  }
}
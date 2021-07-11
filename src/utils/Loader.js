const readdirSync = require("fs").readdirSync;
const log = require("./Logger").log;
const warn = require("./Logger").warn;
const i18n = require("./i18n").i18n;
const Config = require("../config.json");

const COMMAND_DIR = ".\/src\/commands";
const SUB_COMMAND_DIR = "..\/commands";

const EVENT_DIR = ".\/src\/events";
const SUB_EVENT_DIR = "..\/events";

const MODULE_DIR = ".\/src\/modules";
const SUB_MODULE_DIR = "..\/modules";


exports.loadCommands = (client, args) => {
  readdirSync(COMMAND_DIR).forEach(dirs => {
    const files = readdirSync(`${COMMAND_DIR}\/${dirs}`).filter(file => file.endsWith('.js'));

    for (const file of files) {
      const fileBase = file.split(".")[0];
      const command = require(`${SUB_COMMAND_DIR}\/${dirs}\/${fileBase}`);
      if (command.conf.enabled) {
        client.commands.set(command.conf.name, command);
        for (const alias of command.conf.aliases) {
          client.aliases.set(alias, command.conf.name);
        }
        log(
          i18n("COMMAND_LOADED", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", command.conf.name));
      } else {
        warn(
          i18n("COMMAND_NOTLOADED", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", command.conf.name));
      }
    }
  });


  if (args?.reload) {
    log(i18n("ALL_COMMAND_RELOADED", Config.DEFAULTSETTINGS.language));
    args.message.channel.send(i18n("ALL_COMMAND_RELOADED", args.settings.language))
      .then(msg => msg.delete({"timeout": 10000}));
  }
}

exports.reloadCommands = (client, message, settings) => {
  for (const [commandName, command] of client.commands) {
    client.commands.delete(commandName);
  }
  
  for (const [alias, command] of client.aliases) {
    client.aliases.delete(alias);
  }

  readdirSync(COMMAND_DIR).forEach(dirs => {
    const file = readdirSync(`${COMMAND_DIR}\/${dirs}`).find(file => file.endsWith('.js'));
    if (file) {
      const fileBase = file.split(".")[0];
      const command = require.cache[require.resolve(`${SUB_COMMAND_DIR}\/${dirs}\/${fileBase}`)];
      delete require.cache[require.resolve(`${SUB_COMMAND_DIR}\/${dirs}\/${file}`)];
    }
  });

  log(i18n("ALL_COMMAND_UNLOADED", Config.DEFAULTSETTINGS.language));
  message.channel.send(i18n("ALL_COMMAND_UNLOADED", settings.language))
    .then(msg => msg.delete({"timeout": 10000}));

  this.loadCommands(client, {"reload": true, settings, message});
}

exports.loadCommand = (client, message, settings, commandName) => {
  let notFoundCount = 0;
  readdirSync(COMMAND_DIR).forEach((dirs, i, array) => {
    const file = readdirSync(`${COMMAND_DIR}\/${dirs}`).find(file => file.startsWith(`${commandName}.js`));
 
    if (!file) {
      if (notFoundCount < array.length) {
        return notFoundCount++;
      }
      warn(
        i18n("COMMAND_NOTFOUND", Config.DEFAULTSETTINGS.language)
          .replace("{{variable}}", commandName));
      return message.channel.send(
        i18n("COMMAND_NOTFOUND", settings.language)
          .replace("{{variable}}", commandName)
        ).then(msg => msg.delete({"timeout": 10000}));
    }
 
    const reloaded = !!client.commands.has(commandName);
    if (reloaded) this.unloadCommand(client, message, settings, commandName, true);

    const fileBase = file.split(".")[0];
    const command = require(`${SUB_COMMAND_DIR}\/${dirs}\/${fileBase}`);

    if (command.conf.enabled) {
      client.commands.set(command.conf.name, command);
      for (const alias of command.conf.aliases) {
        client.aliases.set(alias, command.conf.name);
      }
      if (reloaded) {
        log(
          i18n("COMMAND_RELOADED", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", command.conf.name));
        message.channel.send(
          i18n("COMMAND_RELOADED", settings.language)
            .replace("{{variable}}", command.conf.name)
        ).then(msg => msg.delete({"timeout": 10000}));
      } else {
        log(
          i18n("COMMAND_LOADED", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", command.conf.name));
        message.channel.send(
          i18n("COMMAND_LOADED", settings.language)
            .replace("{{variable}}", command.conf.name)
        ).then(msg => msg.delete({"timeout": 10000}));
      }
    } else {
      warn(
        i18n("COMMAND_NOTLOADED", Config.DEFAULTSETTINGS.language)
          .replace("{{variable}}", command.conf.name));
      message.channel.send(
        i18n("COMMAND_NOTLOADED", settings.language)
          .replace("{{variable}}", command.conf.name)
      ).then(msg => msg.delete({"timeout": 10000}));
    }
  });
}

exports.unloadCommand = (client, message, settings, commandName) => {
  if (client.commands.has(commandName)) {
    client.commands.delete(commandName);
    for (const [alias, command] of client.aliases) {
      if (command === commandName) {
        client.aliases.delete(alias);
      }
    }

    let notFoundCount = 0;
    readdirSync(COMMAND_DIR).forEach((dirs, i, array) => {
      const file = readdirSync(`${COMMAND_DIR}\/${dirs}`).find(file => file.startsWith(commandName));
      if (!file) {
        if (notFoundCount < array.length) {
          return notFoundCount++;
        }
        warn(
          i18n("COMMAND_NOTFOUND", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", commandName));
        return message.channel.send(
          i18n("COMMAND_NOTFOUND", settings.language)
            .replace("{{variable}}", commandName)
        ).then(msg => msg.delete({"timeout": 10000}));
      }
     
      const fileBase = file.split(".")[0];
      const command = require.cache[require.resolve(`${SUB_COMMAND_DIR}\/${dirs}\/${fileBase}`)];
      delete require.cache[require.resolve(`${SUB_COMMAND_DIR}\/${dirs}\/${file}`)];
    });

    log(
      i18n("COMMAND_UNLOADED", Config.DEFAULTSETTINGS.language)
        .replace("{{variable}}", commandName));
    message.channel.send(
      i18n("COMMAND_UNLOADED", settings.language)
        .replace("{{variable}}", commandName)
    ).then(msg => msg.delete({"timeout": 10000}));
  } else {
    warn(
      i18n("COMMAND_NOTLOADED", Config.DEFAULTSETTINGS.language)
        .replace("{{variable}}", commandName));
    message.channel.send(
      i18n("COMMAND_NOTLOADED", settings.language)
        .replace("{{variable}}", commandName)
    ).then(msg => msg.delete({"timeout": 10000}));
  }
}

exports.loadEvents = (client) => {
  const eventFiles = readdirSync(`${EVENT_DIR}`).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const fileBase = file.split(".")[0];
    const event = require(`${SUB_EVENT_DIR}\/${fileBase}`);
    client.on(fileBase, event.bind(null, client));
    log(
      i18n("EVENT_LOADED", Config.DEFAULTSETTINGS.language)
        .replace("{{variable}}", fileBase));
  }
}

exports.loadModules = (client) => {
  readdirSync(MODULE_DIR).forEach(dirs => {
    const modulesFiles = readdirSync(`${MODULE_DIR}\/${dirs}`).filter(file => file.endsWith('.js'));

    for (const file of modulesFiles) {
      const fileBase = file.split(".")[0];
      const module = require(`${SUB_MODULE_DIR}\/${dirs}\/${fileBase}`);
      
      client.modules.set(module.conf.name, module);
      if (module.conf.enabled) {
        module.init();
        log(
          i18n("MODULE_LOADED", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", module.conf.name));
      } else {
        warn(
          i18n("MODULE_NOTLOADED", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", module.conf.name));
      }
    }
  });
}
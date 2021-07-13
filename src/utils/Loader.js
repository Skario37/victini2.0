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
    for (const alias of command.conf.aliases) {
      client.aliases.delete(alias);
    }

    client.commands.delete(commandName);
  }

  readdirSync(COMMAND_DIR).forEach(dirs => {
    const file = readdirSync(`${COMMAND_DIR}\/${dirs}`).find(file => file.endsWith('.js'));
    if (file) {
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
      if (notFoundCount < array.length - 1) {
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
    if (reloaded) this.unloadCommand(client, message, settings, commandName);

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
        if (message) {
          message.channel.send(
            i18n("COMMAND_RELOADED", settings.language)
              .replace("{{variable}}", command.conf.name)
          ).then(msg => msg.delete({"timeout": 10000}));
        }
      } else {
        log(
          i18n("COMMAND_LOADED", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", command.conf.name));
        if (message) {
          message.channel.send(
            i18n("COMMAND_LOADED", settings.language)
              .replace("{{variable}}", command.conf.name)
          ).then(msg => msg.delete({"timeout": 10000}));
        }
      }
    } else {
      warn(
        i18n("COMMAND_NOTLOADED", Config.DEFAULTSETTINGS.language)
          .replace("{{variable}}", command.conf.name));
      if (message) {
        message.channel.send(
          i18n("COMMAND_NOTLOADED", settings.language)
            .replace("{{variable}}", command.conf.name)
        ).then(msg => msg.delete({"timeout": 10000}));
      }
    }
  });
}

exports.unloadCommand = (client, message, settings, commandName) => {
  if (client.commands.has(commandName)) {
    const command = client.commands.get(commandName);
    
    for (const alias of command.conf.aliases) {
      client.aliases.delete(alias);
    }

    client.commands.delete(commandName);

    let notFoundCount = 0;
    readdirSync(COMMAND_DIR).forEach((dirs, i, array) => {
      const file = readdirSync(`${COMMAND_DIR}\/${dirs}`).find(file => file.startsWith(commandName));
      if (!file) {
        if (notFoundCount < array.length - 1) {
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
      delete require.cache[require.resolve(`${SUB_COMMAND_DIR}\/${dirs}\/${file}`)];
    });

    log(
      i18n("COMMAND_UNLOADED", Config.DEFAULTSETTINGS.language)
        .replace("{{variable}}", commandName));
    if (message) {
      message.channel.send(
        i18n("COMMAND_UNLOADED", settings.language)
          .replace("{{variable}}", commandName)
      ).then(msg => msg.delete({"timeout": 10000}));
    }
  } else {
    warn(
      i18n("COMMAND_NOTLOADED", Config.DEFAULTSETTINGS.language)
        .replace("{{variable}}", commandName));
    if (message) {
      message.channel.send(
        i18n("COMMAND_NOTLOADED", settings.language)
          .replace("{{variable}}", commandName)
      ).then(msg => msg.delete({"timeout": 10000}));
    }
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

const loadCommandsFromModule = (client, message, settings, module) => {
  for (const command of module.commands) {
    if (command.conf.enabled) {
      const reloaded = !!client.commands.has(command.conf.name);
      if (reloaded) client.commands.delete(command.conf.name, command);
      client.commands.set(command.conf.name, command);

      for (const alias of command.conf.aliases) {
        if (reloaded) client.aliases.delete(alias);
        client.aliases.set(alias, command.conf.name);
      }

      if (reloaded) {
        log(
          i18n("COMMAND_RELOADED", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", command.conf.name));
        if (message) {
          message.channel.send(
            i18n("COMMAND_RELOADED", settings.language)
              .replace("{{variable}}", command.conf.name)
          ).then(msg => msg.delete({"timeout": 10000}));
        }
      } else {
        log(
          i18n("COMMAND_LOADED", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", command.conf.name));
        if (message) {
          message.channel.send(
            i18n("COMMAND_LOADED", settings.language)
              .replace("{{variable}}", command.conf.name)
          ).then(msg => msg.delete({"timeout": 10000}));
        }
      }
    } else {
      warn(
        i18n("COMMAND_NOTLOADED", Config.DEFAULTSETTINGS.language)
          .replace("{{variable}}", command.conf.name));
      if (message) {
        message.channel.send(
          i18n("COMMAND_NOTLOADED", settings.language)
            .replace("{{variable}}", command.conf.name)
        ).then(msg => msg.delete({"timeout": 10000}));
      }
    }
  }
}

const unloadCommandsFromModule = (client, message, settings, module) => {
  for (const command of module.commands) {
    const deleted = client.commands.delete(command.conf.name);

    for (const alias of command.conf.aliases) {
      client.aliases.delete(alias);
    }

    if (deleted) {
      log(
        i18n("COMMAND_UNLOADED", Config.DEFAULTSETTINGS.language)
          .replace("{{variable}}", command.conf.name));
      if (message) {
        message.channel.send(
          i18n("COMMAND_UNLOADED", settings.language)
            .replace("{{variable}}", command.conf.name)
        ).then(msg => msg.delete({"timeout": 10000}));
      }
    }
  }
}

exports.loadModules = (client, args = {}) => {
  readdirSync(MODULE_DIR).forEach(dirs => {
    const modulesFiles = readdirSync(`${MODULE_DIR}\/${dirs}`).filter(file => file.endsWith('.js'));

    for (const file of modulesFiles) {
      const fileBase = file.split(".")[0];
      const module = require(`${SUB_MODULE_DIR}\/${dirs}\/${fileBase}`);
      
      client.modules.set(module.conf.name, module);
      if (module.conf.enabled) {
        module.init(client);

        loadCommandsFromModule(client, args.message, args.settings, module);

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

  if (args?.reload) {
    log(i18n("ALL_MODULE_RELOADED", Config.DEFAULTSETTINGS.language));
    args.message.channel.send(i18n("ALL_MODULE_RELOADED", args.settings.language))
      .then(msg => msg.delete({"timeout": 10000}));
  }
}

exports.reloadModules = (client, message, settings) => {
  for (const [moduleName, module] of client.modules) {
    client.modules.delete(moduleName);

    unloadCommandsFromModule(client, message, settings, module);
  }

  readdirSync(MODULE_DIR).forEach(dirs => {
    const file = readdirSync(`${MODULE_DIR}\/${dirs}`).find(file => file.endsWith('.js'));
    if (file) {
      delete require.cache[require.resolve(`${SUB_MODULE_DIR}\/${dirs}\/${file}`)];
    }
  });

  log(i18n("ALL_MODULE_UNLOADED", Config.DEFAULTSETTINGS.language));
  message.channel.send(i18n("ALL_MODULE_UNLOADED", settings.language))
    .then(msg => msg.delete({"timeout": 10000}));

  this.loadModules(client, {"reload": true, settings, message});
}

exports.loadModule = (client, message, settings, moduleName) => {
  let notFoundCount = 0;
  readdirSync(MODULE_DIR).forEach((dirs, i, array) => {
    const file = readdirSync(`${MODULE_DIR}\/${dirs}`).find(file => file.startsWith(`${moduleName}.js`));
 
    if (!file) {
      if (notFoundCount < array.length - 1) {
        return notFoundCount++;
      }
      warn(
        i18n("MODULE_NOTFOUND", Config.DEFAULTSETTINGS.language)
          .replace("{{variable}}", moduleName));
      return message.channel.send(
        i18n("MODULE_NOTFOUND", settings.language)
          .replace("{{variable}}", moduleName)
        ).then(msg => msg.delete({"timeout": 10000}));
    }

    const fileBase = file.split(".")[0];
    const module = require(`${SUB_MODULE_DIR}\/${dirs}\/${fileBase}`);
 
    const reloaded = !!client.modules.has(moduleName);
    if (reloaded) this.unloadModule(client, message, settings, moduleName);
    
    if (module.conf.enabled) {
      client.modules.set(module.conf.name, module);
      module.init(client);
      loadCommandsFromModule(client, message, settings, module);

      log(
        i18n("MODULE_LOADED", Config.DEFAULTSETTINGS.language)
          .replace("{{variable}}", module.conf.name));
      message.channel.send(
        i18n("MODULE_LOADED", settings.language)
          .replace("{{variable}}", module.conf.name)
      ).then(msg => msg.delete({"timeout": 10000}));
    } else {
      warn(
        i18n("MODULE_NOTLOADED", Config.DEFAULTSETTINGS.language)
          .replace("{{variable}}", module.conf.name));
      message.channel.send(
        i18n("MODULE_NOTLOADED", settings.language)
          .replace("{{variable}}", module.conf.name)
      ).then(msg => msg.delete({"timeout": 10000}));
    }
  });
}

exports.unloadModule = (client, message, settings, moduleName) => {
  if (client.modules.has(moduleName)) {
    const module = client.modules.get(moduleName);
    module.unsubscribe();

    unloadCommandsFromModule(client, message, settings, module);
    
    client.modules.delete(moduleName);

    let notFoundCount = 0;
    readdirSync(MODULE_DIR).forEach((dirs, i, array) => {
      const file = readdirSync(`${MODULE_DIR}\/${dirs}`).find(file => file.startsWith(moduleName));
      if (!file) {
        if (notFoundCount < array.length - 1) {
          return notFoundCount++;
        }
        warn(
          i18n("MODULE_NOTFOUND", Config.DEFAULTSETTINGS.language)
            .replace("{{variable}}", moduleName));
        return message.channel.send(
          i18n("MODULE_NOTFOUND", settings.language)
            .replace("{{variable}}", moduleName)
        ).then(msg => msg.delete({"timeout": 10000}));
      }
      delete require.cache[require.resolve(`${SUB_MODULE_DIR}\/${dirs}\/${file}`)];
    });

    log(
      i18n("MODULE_UNLOADED", Config.DEFAULTSETTINGS.language)
        .replace("{{variable}}", moduleName));
    if (message) {
      message.channel.send(
        i18n("MODULE_UNLOADED", settings.language)
          .replace("{{variable}}", moduleName)
      ).then(msg => msg.delete({"timeout": 10000}));
    }
  } else {
    warn(
      i18n("MODULE_NOTLOADED", Config.DEFAULTSETTINGS.language)
        .replace("{{variable}}", moduleName));
    if (message) {
      message.channel.send(
        i18n("MODULE_NOTLOADED", settings.language)
          .replace("{{variable}}", moduleName)
      ).then(msg => msg.delete({"timeout": 10000}));
    }
  }
}
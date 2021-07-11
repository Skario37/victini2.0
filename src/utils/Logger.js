/*
Logger class for easy and aesthetically pleasing console logging
*/
const Chalk = require("chalk");
const Moment = require("moment");

exports.log = (content, type = "log") => {
  const timestamp = `[${Moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  switch (type) {
    case "log": {
      console.log(`${timestamp} ${Chalk.bgBlue(type.toUpperCase())} ${content} `);
      break;
    }
    case "warn": {
      console.log(`${timestamp} ${Chalk.black.bgYellow(type.toUpperCase())} ${content} `);
      break;
    }
    case "error": {
      console.log(`${timestamp} ${Chalk.bgRed(type.toUpperCase())} ${content} `);
      break;
    }
    case "debug": {
      console.log(`${timestamp} ${Chalk.green(type.toUpperCase())} ${content} `);
      break;
    }
    case "cmd": {
      console.log(`${timestamp} ${Chalk.black.bgWhite(type.toUpperCase())} ${content}`);
      break;
    }
    case "ready": {
      console.log(`${timestamp} ${Chalk.black.bgGreen(type.toUpperCase())} ${content}`);
      break;
    }
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
};

exports.error  = (...args) => this.log(args, "error");
exports.warn   = (...args) => this.log(args, "warn");
exports.debug  = (...args) => this.log(args, "debug");
exports.cmd    = (...args) => this.log(args, "cmd");


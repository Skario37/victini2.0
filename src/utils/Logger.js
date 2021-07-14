/*
Logger class for easy and aesthetically pleasing console logging
*/
const Chalk = require("chalk");
const Moment = require("moment");
const fs = require('fs');

const LOG_DIR = ".\/src\/logs";

let logStream = null;
let errorStream = null;
let debugStream = null;


exports.log = (content, type = "log") => {
  const timestamp = `[${Moment().format("YYYY-MM-DD HH:mm:ss")}]:`;

  const dir = `${LOG_DIR}\/${Moment().format("YYYY-MM-DD")}`;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);

    // Destroy old write stream
    if (logStream) {
      logStream.destroy();
      logStream = null;
    }
    if (errorStream) {
      errorStream.destroy();
      errorStream = null;
    }
    if (debugStream) {
      debugStream.destroy();
      debugStream = null;
    }
  }

  // Then create write stream
  if (!logStream) logStream = fs.createWriteStream(`${dir}\/log.txt`, {flags: "a+"});
  if (!errorStream) errorStream = fs.createWriteStream(`${dir}\/error.txt`, {flags: "a+"});
  if (!debugStream) debugStream = fs.createWriteStream(`${dir}\/debug.txt`, {flags: "a+"});

  const data = `${timestamp} ${content}\n`;

  switch (type) {
    default:
    case "log": {
      logStream.write(data);
      console.log(`${timestamp} ${Chalk.bgBlue(type.toUpperCase())} ${content}`);
      break;
    }
    case "warn": {
      errorStream.write(data);
      console.log(`${timestamp} ${Chalk.black.bgYellow(type.toUpperCase())} ${content}`);
      break;
    }
    case "error": {
      errorStream.write(data);
      console.log(`${timestamp} ${Chalk.bgRed(type.toUpperCase())} ${content}`);
      break;
    }
    case "debug": {
      debugStream.write(data);
      console.log(`${timestamp} ${Chalk.green(type.toUpperCase())} ${content}`);
      break;
    }
    case "cmd": {
      logStream.write(data);
      console.log(`${timestamp} ${Chalk.black.bgWhite(type.toUpperCase())} ${content}`);
      break;
    }
    case "ready": {
      logStream.write(data);
      console.log(`${timestamp} ${Chalk.black.bgGreen(type.toUpperCase())} ${content}`);
      break;
    }
  }
};

exports.error  = (...args) => this.log(args, "error");
exports.warn   = (...args) => this.log(args, "warn");
exports.debug  = (...args) => this.log(args, "debug");
exports.cmd    = (...args) => this.log(args, "cmd");


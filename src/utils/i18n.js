const Logger = require("./Logger");

const en = require("../locales/en/message.json");
const fr = require("../locales/fr/message.json");

exports.i18n = (index = "UNDEFINED", language = "EN") => {
  let result = undefined;
  switch (language.toUpperCase()) {
    case "FR": {
      result = fr[index];
      break;
    }
    case "EN": {
      result = en[index];
      break;
    }
    default: {
      result = en[index];
    }
  }
  if (result) return result;
  else {
    Logger.error(`Index [${index}] at locales [${language}] not found.`);
    return "{Empty}";
  }
}
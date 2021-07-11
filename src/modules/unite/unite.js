const wf = require("fs").watchFile;
const uniteConfig = {};

exports.init = () => {
  observeConfig();
}

const observeConfig = () => {
  wf("./config.json", (curr, prev) => {
    console.log(curr, prev);
  });
}

exports.conf = {
  name: "unite",
  enabled: true,
}
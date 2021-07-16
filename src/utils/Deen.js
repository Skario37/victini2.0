const getKeyByValue = require("./Object").getKeyByValue;

const MORSE_CODE = {
  "A": ".-",      "B": "-...",    "C": "-.-.",    "D": "-..",
  "E": ".",       "F": "..-.",    "G": "--.",     "H": "....",
  "I": "..",      "J": ".---",    "K": "-.-",     "L": ".-..",
  "M": "--",      "N": "-.",      "O": "---",     "P": ".--.",
  "Q": "--.-",    "R": ".-.",     "S": "...",     "T": "-",
  "U": "..-",     "V": "...-",    "W": ".--",     "X": "-..-",
  "Y": "-.--",    "z": "--..",    "1": ".----",   "2": "..---",
  "3": "...--",   "4": "....-",   "5": ".....",   "6": "-....",
  "7": "--...",   "8": "---..",   "9": "----.",   "0": "-----",
  ".": ".-.-.-",  ",": "--..--",  "?": "..--..",
  "'": ".----.",  "/": "-..-.",   "(": "-.--.",
  ")": "-.--.-",  "&": ".-...",   ":": "---...",
  ";": "-.-.-.",  "=": "-...-",   "+": ".-.-.",
  "-": "-....-",  "_": "..--.-",  '"': ".-..-.",
  "$": "...-..-", "!": "-.-.--",  "@": ".--.-.",
  " ": "/",
};

exports.encodeMorse = (text) => {
  text = text.split("");
  for (i = 0; i < text.length; i++) {
    text[i] = MORSE_CODE[text[i]];
  }
  return text.join(" ");
}

exports.decodeMorse = (text) => {
  text = text.split(" ");
  for (i = 0; i < text.length; i++) {
    text[i] = getKeyByValue(MORSE_CODE, text[i]);
  }
  return text.join("");
}
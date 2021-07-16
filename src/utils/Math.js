
/**
 * @returns 0 or 1
 */
exports.getRandom = () => Math.random();

/**
 * Getting a random number between two values
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
exports.getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

/**
 * Getting a random integer between two values
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/**
 * Getting a random integer between two values, inclusive
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
exports.getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/**
 * Round to nearest multiple of
 * @param {Number} mult 
 * @param {Number} number 
 * @returns {Number}
 */
exports.roundToNearestMultipleOf = (mult, number) => Math.round(number/mult)*mult;
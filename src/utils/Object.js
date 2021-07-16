
/**
 * Return a key of an object by its value
 * @param {Object} object 
 * @param {*} value 
 * @returns 
 */
exports.getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}
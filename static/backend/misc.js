/**
 * Checks if a string contains Arabic language characters.
 *
 * @param {string} text - The input string to be checked.
 * @returns {boolean} - Returns true if the string contains Arabic characters, otherwise false.
 */
function isArabic(text) {
  var arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}
/**
 * Converts a number to its Arabic numeral representation.
 *
 * @param {number} number - The number to convert.
 * @returns {string} The Arabic numeral representation of the number.
 */
function convertToArabicNumeral(number) {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const numberString = number.toString();
  let arabicNumber = '';

  for (let i = 0; i < numberString.length; i++) {
    const char = numberString[i];
    if (char === '.') {
      arabicNumber += ',';
    } else {
      const digit = parseInt(char);
      arabicNumber += arabicNumerals[digit];
    }
  }

  return arabicNumber;
}
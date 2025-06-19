//src/utils/validator.js
/**
 * Validates a string based on a set of rules.
 * @param {string} name - The string to validate.
 * @returns {{isValid: boolean, message: string}} - An object with validation result.
 */
export function validateName(name) {
  // 1. Length Check
  if (name.length < 5 || name.length > 20) {
    return { isValid: false, message: 'Must be between 5 and 20 characters.' };
  }

  // 2. Special Characters Check
  // The regex /[_.*/#\-]/ checks for any of the forbidden characters.
  if (/[ _.*#/-]/.test(name)) {    
    return { isValid: false, message: 'Cannot contain special characters (_,.*#/-) or spaces.' };
  }
  // 3. Cannot be only numbers
  // The regex /^\d+$/ checks if the entire string consists of digits.
  if (/^\d+$/.test(name)) {
    return { isValid: false, message: 'Cannot consist of only numbers.' };
  }

  // 4. Maximum of 3 numbers
  // The regex /\d/g finds all digit occurrences in the string.
  const numberMatches = name.match(/\d/g);
  if (numberMatches && numberMatches.length > 3) {
    return { isValid: false, message: 'Cannot contain more than 3 numbers.' };
  }

  // If all checks pass, the name is valid.
  return { isValid: true, message: '' };
}
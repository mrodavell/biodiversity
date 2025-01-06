/**
 * Joins array elements into a string with separator before the last element.
 * @param {string[]} arr - The array of elements to be joined.
 * @param {string} separator - The separator value for the string result
 * @returns {string} - The formatted string.
 */
const joinArray = (arr: string[], separator: string): string => {
  // Check if the array is empty
  if (arr.length === 0) {
    return "";
  }

  // Check if the array has only one element
  if (arr.length === 1) {
    return arr[0];
  }

  // Join all elements except the last one with a comma
  const allButLast: string = arr.slice(0, -1).join(separator);

  // Get the last element
  const lastElement: string = arr[arr.length - 1];

  // Combine the joined elements with ' or ' before the last element
  const result: string = `${allButLast} ${separator} ${lastElement}`;

  return result;
};

export { joinArray };

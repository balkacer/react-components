import removeLatinChars from "./latins";
import { removeDuplicatesFromString } from "./general";

// if the b string match with the first word of the a string
export const isMatchFirstWord = (a, b) => {
  const cleanA = removeDuplicatesFromString(
    removeLatinChars(a.toLowerCase().trim())
  );
  const first = removeLatinChars(("" + b).toLowerCase()).split(" ")[0];
  return first === cleanA;
};

// valid if it matches, the position of the characters must be the same
export const isMatchWith = (a, b) => {
  const cleanA = removeDuplicatesFromString(
    removeLatinChars(a.toLowerCase().trim())
  );
  const cleanB = removeLatinChars(("" + b).toLowerCase());

  return (
    cleanB.includes(cleanA) &&
    (cleanB.includes(" " + cleanA + " ") ||
      cleanB === cleanA ||
      cleanB.substr(cleanA.length, cleanB.length) === cleanA)
  );
};

// is a match regardless of character position
export const isMatchWithChars = (a, b) => {
  const cleanA = removeDuplicatesFromString(
    removeLatinChars(a.toLowerCase().trim())
  );
  const cleanB = removeLatinChars(("" + b).toLowerCase());

  let matches = [];
  [...cleanA].forEach((char) => {
    if (cleanB.includes(char) && !matches.includes(char)) matches.push(char);
  });
  return matches.length === cleanA.length;
};

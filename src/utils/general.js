import removeLatinChars from "./latins";

export const removeDuplicatesFromString = (str) => {
  return [...str].filter((item, i, self) => self.indexOf(item) === i).join("");
};

export const sort = (arr, key = "") => {
  if (key === "") {
    return arr.sort((a, b) => {
      if (removeLatinChars(a) < removeLatinChars(b)) return -1;
      if (removeLatinChars(a) > removeLatinChars(b)) return 1;
      return 0;
    });
  } else {
    return arr.sort((a, b) => {
      if (removeLatinChars(a[key]) < removeLatinChars(b[key])) return -1;
      if (removeLatinChars(a[key]) > removeLatinChars(b[key])) return 1;
      return 0;
    });
  }
};

export const selectPropsFromObj = (obj, props) => {
  const newObj = {};
  for (let key of props) {
    if (obj.hasOwnProperty(key)) newObj[key] = obj[key];
  }
  return newObj;
};

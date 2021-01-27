import { formatUnits } from "@ethersproject/units";

const tryToDisplay = thing => {
  if (thing && thing.toNumber) {
    try {
      return thing.toNumber();
    } catch (e) {
      return "Ξ" + formatUnits(thing, "ether");
    }
  }
  return JSON.stringify(thing);
};

const hexToString = hex => {
  var str = "";
  for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

export { tryToDisplay, hexToString };

export const randomId = (length: number): string => {
  if (length < 1) return "";
  const chars = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const out: string[] = [];

  for (let i = 0; i < length; i++) {
    let index = Math.floor(Math.random() * chars.length);
    let char = chars[index];
    out.push(char);
  }

  return out.join("");
};

export const generateDynamicString = (
  params: { [key: string]: any },
  schema: string
): string => {
  
  for (let p in params) {
    let regex = new RegExp(`\{${p.toUpperCase()}\}`, "g");
    schema = schema.replace(regex, params[p]);
  }
  return schema;
};

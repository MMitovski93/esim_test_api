import fs from "fs";
import path from "path";

const configFile: string = "config.json";
const configPath: string = path.join(__dirname, "../../../../", configFile);
let config: any = null;

export const getConfig = (section: string): any | null => {
  if (config) return config[section];
  return null;
};

const getLocalSecrets = () => {
  let data = fs.readFileSync(configPath, "utf-8");
  let out = JSON.parse(data);
  return out;
};

export const configInit = () => {
    if(!config) config = getLocalSecrets();
}

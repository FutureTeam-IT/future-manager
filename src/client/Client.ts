import fs from "fs";
import hocon from "ahocon";
import Discord from "discord.js";
import { IConfiguration } from "../models/Configuration";

type ClientOptions = Discord.ClientOptions & {
  path: string;
};

class Client<
  T extends IConfiguration,
  Ready extends boolean = boolean
> extends Discord.Client<Ready> {
  readonly #config: T;

  constructor({ path, ...options }: ClientOptions) {
    super(options);

    // configuration
    const data = fs.readFileSync(path, { encoding: "utf-8" });
    this.#config = hocon.parse<T>(data);
  }

  get config(): Readonly<T> {
    return this.#config;
  }

  start() {
	// * Add commands logic
    this.login(this.#config.token);
  }
}

export { Client };

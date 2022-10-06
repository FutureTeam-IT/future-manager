import fs from 'fs';
import hocon from 'ahocon';
import Discord, { ClientEvents } from 'discord.js';
import { IConfiguration } from '../models/Configuration';
import { CommandManager } from './CommandManager';
import { Listener } from '../models/Listener';

type ClientOptions = Discord.ClientOptions & {
  path: string;
};

class Client<
  T extends IConfiguration = IConfiguration,
  Ready extends boolean = boolean,
> extends Discord.Client<Ready> {
  readonly #config: T;
  readonly #commandManager: CommandManager;

  constructor({ path, ...options }: ClientOptions) {
    super(options);

    // configuration
    const data = fs.readFileSync(path, { encoding: 'utf-8' });
    this.#config = hocon.parse<T>(data);

    // managers
    this.#commandManager = new CommandManager(this);
  }

  get config(): Readonly<T> {
    return this.#config;
  }

  get managers() {
    return { command: this.#commandManager };
  }

  async start() {
    await this.#commandManager.register();
    this.login(this.#config.application.token);
  }

  listen<K extends keyof ClientEvents>(event: K, listener: Listener<K>) {
    this[listener.once ? 'once' : 'on'](
      event,
      listener.on.bind(listener, this),
    );
  }
}

export { Client };

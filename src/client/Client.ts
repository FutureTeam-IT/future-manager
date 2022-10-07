import fs from 'fs';
import * as hocon from 'ahocon';
import Discord, { ClientEvents } from 'discord.js';
import { IConfiguration } from '../models/Configuration';
import { CommandManager } from './CommandManager';
import { IListener } from '../models/Listener';
import { PrismaClient } from '@prisma/client';
import { TicketManager } from './TicketManager';

type ClientOptions = Discord.ClientOptions & {
  path: string;
};

class Client<
  T extends IConfiguration = IConfiguration,
  Ready extends boolean = boolean,
> extends Discord.Client<Ready> {
  readonly #config: T;
  readonly #commandManager: CommandManager;
  readonly #ticketManager: TicketManager;
  readonly #db: PrismaClient;

  constructor({ path, ...options }: ClientOptions) {
    super(options);

    // configuration
    const data = fs.readFileSync(path, { encoding: 'utf-8' });
    this.#config = hocon.parse<T>(data);

    // managers
    this.#commandManager = new CommandManager(this);
    this.#ticketManager = new TicketManager(this);

    this.#db = new PrismaClient();
  }

  get config(): Readonly<T> {
    return this.#config;
  }

  get managers() {
    return {
      command: this.#commandManager,
      ticket: this.#ticketManager
    };
  }

  get database(): Omit<PrismaClient, `$${string}`> {
    return this.#db;
  }

  async start() {
    await this.#commandManager.register();
    this.login(this.#config.application.token);
  }

  listen<K extends keyof ClientEvents>(event: K, listener: IListener<K>) {
    this[listener.once ? 'once' : 'on'](
      event,
      listener.on.bind(listener, this),
    );
  }
}

export { Client };

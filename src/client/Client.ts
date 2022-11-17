import fs from 'fs';
import * as hocon from 'ahocon';
import { PrismaClient } from '@prisma/client';
import Discord, { ClientEvents } from 'discord.js';

import { IListener } from '../models/Listener';
import { TicketManager } from './TicketManager';
import { CommandManager } from './CommandManager';
import { IConfiguration } from '../models/Configuration';
import { ContextMenuManager } from './ContextMenuManager';

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
  readonly #contextMenuManager: ContextMenuManager;
  readonly #db: PrismaClient;

  constructor({ path, ...options }: ClientOptions) {
    super(options);

    // configuration
    const data = fs.readFileSync(path, { encoding: 'utf-8' });
    this.#config = hocon.parse<T>(data);

    // managers
    this.#commandManager = new CommandManager(this);
    this.#ticketManager = new TicketManager(this);
    this.#contextMenuManager = new ContextMenuManager(this);

    this.#db = new PrismaClient();
  }

  get config(): Readonly<T> {
    return this.#config;
  }

  get managers() {
    return {
      command: this.#commandManager,
      ticket: this.#ticketManager,
      contextMenu: this.#contextMenuManager,
    };
  }

  get database(): Omit<PrismaClient, `$${string}`> {
    return this.#db;
  }

  async start() {
    await Promise.all([
      this.#commandManager.register(),
      this.#contextMenuManager.register(),
    ]);
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

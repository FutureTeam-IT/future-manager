import { Interaction, CacheType, Awaitable, REST, Routes } from 'discord.js';
import { IConfiguration } from '../models/Configuration';
import { ContextMenuData, IContextMenu } from '../models/ContextMenu';
import { IListener } from '../models/Listener';
import { Client } from './Client';

class ContextMenuManager implements IListener<'interactionCreate'> {
  readonly #menus: Map<string, IContextMenu>;
  readonly #rest: REST;
  readonly once = false;

  constructor(private client: Client) {
    this.#menus = new Map();
    this.#rest = new REST({ version: '10' });

    client.listen('interactionCreate', this);
    this.#rest.setToken(client.config.application.token);
  }

  get menus() {
    const menus: Array<IContextMenu> = [];

    for (const [_, menu] of this.#menus) {
      menus.push(menu);
    }

    return menus;
  }

  build(): Array<ContextMenuData> {
    const data: Array<ContextMenuData> = [];

    for (const [_, menu] of this.#menus) {
      const builder = menu.builder();
      data.push(builder.toJSON());
    }

    return data;
  }

  add(menu: IContextMenu) {
    this.#menus.set(menu.name, menu);
  }

  async register() {
    const body = this.build();

    return await this.#rest.put(
      Routes.applicationGuildCommands(
        this.client.config.application.id,
        this.client.config.guild.id,
      ),
      { body },
    );
  }

  on(
    client: Client<IConfiguration, true>,
    interaction: Interaction<CacheType>,
  ): Awaitable<void> {
    if (!interaction.isContextMenuCommand() || !interaction.inCachedGuild())
      return;

    const menu = this.#menus.get(interaction.commandName);
    if (menu === undefined) {
      return;
    }

    menu.execute(client, interaction);
  }
}

export { ContextMenuManager };

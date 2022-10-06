import { CommandInteraction, Interaction, REST, Routes } from 'discord.js';
import { CommandData, ICommand } from '../models/Command';
import { Listener } from '../models/Listener';
import { Client } from './Client';

class CommandManager implements Listener<'interactionCreate'> {
  readonly #commands: Map<string, ICommand>;
  readonly #rest: REST;
  readonly once = false;

  constructor(private readonly client: Client) {
    this.#commands = new Map();
    this.#rest = new REST({ version: '10' });

    client.listen('interactionCreate', this);
    this.#rest.setToken(client.config.application.token);
  }

  get commands() {
    const commands: Array<ICommand> = [];

    for (const [_, command] of this.#commands) {
      commands.push(command);
    }

    return commands;
  }

  async build(): Promise<Array<CommandData>> {
    const data: Array<CommandData> = [];

    for (const [_, command] of this.#commands) {
      const builder = await command.builder();
      data.push(builder.toJSON());
    }

    return data;
  }

  add(command: ICommand) {
    this.#commands.set(command.name, command);
  }

  async register() {
    const body = await this.build();

    return await this.#rest.put(
      Routes.applicationGuildCommands(
        this.client.config.application.id,
        this.client.config.guild.id,
      ),
      { body },
    );
  }

  async on(_, interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) {
      return;
    }

    const command = this.#commands.get(interaction.commandName);
    if (command === undefined) {
      return;
    }

    command.execute(this.client, interaction);
  }
}

export { CommandManager };

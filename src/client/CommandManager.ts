import { CommandInteraction, Interaction, REST, Routes } from 'discord.js';
import { CommandData, ICommand } from '../models/Command';
import { Client } from './Client';

class CommandManager {
  readonly #commands: Map<string, ICommand>;
  readonly #rest: REST;

  constructor(private readonly client: Client) {
    this.#commands = new Map();
    this.#rest = new REST({ version: '10' });

    client.on('interactionCreate', this.route);
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

  register(command: ICommand) {
    this.#commands.set(command.name, command);
  }

  registerAll(commands: Array<ICommand>) {
    commands.forEach((cmd) => this.#commands.set(cmd.name, cmd));
  }

  async update() {
    const body = await this.build();

    return await this.#rest.put(
      Routes.applicationGuildCommands(
        this.client.config.application.id,
        this.client.config.guild.id,
      ),
      { body },
    );
  }

  async route(interaction: Interaction) {
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

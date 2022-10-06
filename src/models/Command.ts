import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Client } from '../client/Client';

interface ICommand {
  get name(): string;

  execute(client: Client, ctx: CommandInteraction<"cached">): PromiseLike<void>;
  builder(): PromiseLike<SlashCommandBuilder>;
}

type CommandData = ReturnType<SlashCommandBuilder["toJSON"]>;

export { ICommand, CommandData };

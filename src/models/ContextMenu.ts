import { ApplicationCommandType, Awaitable, CacheType, ContextMenuCommandBuilder, ContextMenuCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import { Client } from "../client/Client";
import { IConfiguration } from "./Configuration";

type ContextMenuData = ReturnType<ContextMenuCommandBuilder["toJSON"]>;

interface IContextMenu<I extends ContextMenuCommandInteraction = ContextMenuCommandInteraction> {
	name: string;
	execute(client: Client<IConfiguration, true>, ctx: I): Awaitable<void>;
	builder(): ContextMenuCommandBuilder;
}

abstract class UserContextMenu implements IContextMenu<UserContextMenuCommandInteraction> {
	constructor (public name: string, private defaultPermission: boolean) {}

	abstract execute(client: Client<IConfiguration, true>, ctx: UserContextMenuCommandInteraction<"cached">): Awaitable<void>;

	builder(): ContextMenuCommandBuilder {
		return new ContextMenuCommandBuilder()
			.setName(this.name)
			.setType(ApplicationCommandType.User)
			.setDefaultMemberPermissions(this.defaultPermission ? undefined : '0');
	}
}

abstract class MessageContextMenu implements IContextMenu<MessageContextMenuCommandInteraction> {
	constructor (public name: string, private defaultPermission: boolean) {}

	abstract execute(client: Client<IConfiguration, true>, ctx: MessageContextMenuCommandInteraction<"cached">): Awaitable<void>;

	builder(): ContextMenuCommandBuilder {
		return new ContextMenuCommandBuilder()
			.setName(this.name)
			.setType(ApplicationCommandType.Message)
			.setDefaultMemberPermissions(this.defaultPermission ? undefined : '0');
	}
}

// abstract class UserContextMenu implements IContextMenu<UserContextMenuCommandInteraction> {
// 	constructor (public name: string, private defaultPermission: boolean) {}

// 	abstract execute(client: Client<IConfiguration, true>, ctx: UserContextMenuCommandInteraction<CacheType>): Awaitable<void>;

// 	builder(): ContextMenuCommandBuilder {
// 		return new ContextMenuCommandBuilder()
// 			.setName(this.name)
// 			.setType(ApplicationCommandType.User)
// 			.setDefaultMemberPermissions(this.defaultPermission ? undefined : '0');
// 	}
// }

export { IContextMenu, UserContextMenu, MessageContextMenu, ContextMenuData }

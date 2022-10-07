import { Awaitable, ClientEvents } from "discord.js";
import { Client } from "../client/Client";

interface IListener<T extends keyof ClientEvents> {
	readonly once: boolean;
	on(client: Client, ...args: ClientEvents[T]): Awaitable<void>;
}

export { IListener }
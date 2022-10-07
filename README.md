# FutureManager 

Official Discord BOT for FutureCraft.

You can fork and use on your own.

***

## Events

To listen to events you have first to create a listener 
```ts
import { IListener } from "../models/Listener";
import { Client } from "../client/Client";

class EventListener implements IListener<'event'> {
	once: boolean = false;		// Whether the bot should execute the listener only once

	on(client: Client<IConfiguration, boolean>, /* The event-specific arguments */) {
		/* [...] */
	}
}
```

Then you just add the listener to the client
```ts
// File: main.ts

// [...]

import {EventListener} from "./events/EventListener";

// [...]

client.listen('event', new EventListener());

```

## Commands

If you need to create custom commands you can use the `ICommand` interface for the executor and register it to the client's CommandManager.

! The command manager is used for guild-only commands by default, you can change it in `client/CommandManager.ts#register` !

1. Create the command executor
```ts

class Command implements ICommand {
	name: string = "command";		// Your command name

	execute(client: Client<IConfiguration, true>, ctx: CommandInteraction<"cached">) {
		// [...]
	}

	builder() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("A sample command")
			/* You can set your custom options here */
			;
	}
}
```

2. Register the command to the command manager
You need to register them before the start method!

```ts
// File: main.ts

// [...]

import {Command} from "./commands/Command";

// [...]

client.manager.command.add(new Command());
await client.start();

```
import { ICommand } from "../models/Command";

type Class<T extends {}> = {
  new (...args: any[]): T;
};

export default function (name: string, description?: string) {
  return function <T extends ICommand>(Command: Class<T>) {
    Reflect.defineMetadata("command:name", name, Command);
    if (description) {
      Reflect.defineMetadata("command:description", description, Command);
    }

    return class extends Command {};
  };
}

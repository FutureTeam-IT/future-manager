interface ICommand {
	execute(...args: any[]): PromiseLike<void>;
}

export { ICommand };

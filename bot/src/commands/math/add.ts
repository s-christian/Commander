import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class AddNumbersCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "add",
			aliases: ["add-numbers", "add-nums"],
			group: "math",
			memberName: "add",
			description: "Sum up a few numbers.",
			examples: [
				"!add 1 2 3",
				"!add-nums 987 654 321",
				"!add 1 2 3 4 5 6 7 8",
				"!add-numbers"
			],
			argsPromptLimit: 1,
			args: [
				{
					key: "numbers",
					type: "float",
					label: "number", // automatic error will say `@mention, You provided an invalid ${label}, "${numbers}". Please try again.`
					prompt:
						"Provide some numbers. Each message will be interpreted as a single number.",
					error:
						"looks like at least one of your inputs isn't a number. Re-enter those values.",
					infinite: true
				}
			]
		});
	}

	async run(message: CommandoMessage, args: { numbers: [number] }): Promise<Message | Message[]> {
		const total: number = args.numbers.reduce((prev, arg) => prev + arg, 0); // 0 is the initial value, so prev = 0 the first time
		return message.reply(`${args.numbers.join(" + ")} = **${total}**`);
	}
}

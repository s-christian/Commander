import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class SayCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "say",
			aliases: ["echo", "repeat", "parrot"],
			group: "main",
			memberName: "say",
			description: "Like a mirror, but for your words.",
			examples: ["say hello", "echo AHHHHH", "repeat I, Commander, am stupid and ugly :("],
			argsType: "single",
			throttling: {
				duration: 10,
				usages: 2
			}
		});
	}

	async run(message: CommandoMessage, text: string): Promise<Message | Message[]> {
		if (!text)
			return message.reply(
				`${
					message.channel.type === "text" ? "g" : "G"
				}ive me something to say! See \`!help say\``
			);
		else if (/http[s]?:\/\//.test(text)) return message.reply("I cannot say URLs.");

		if (message.channel.type === "text" && message.guild.me?.hasPermission("MANAGE_MESSAGES"))
			await message.delete();
		return message.reply(text);
	}
}

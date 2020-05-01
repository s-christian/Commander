import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

import { stripIndents } from "common-tags";
import { messageAutodelete } from "../../util/messageHelpers";

export default class DeleteCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "delete",
			aliases: ["del", "clear", "remove", "rm", "wipe", "purge"],
			group: "mod",
			memberName: "delete",
			description: "Deletes the last n messages.",
			examples: ["!delete 2", "!clear 100"],
			guildOnly: true,
			userPermissions: ["MANAGE_MESSAGES"],
			clientPermissions: ["MANAGE_MESSAGES"],
			guarded: true,
			argsType: "single" // only works if 'args' is not specified
		});
	}

	async run(message: CommandoMessage, args: string): Promise<Message | Message[]> {
		const amount = parseInt(args, 10);
		if (isNaN(amount))
			return message.reply(
				"you must provide a number representing the amount of messages to delete."
			);

		await message.delete();

		if (amount < 1 || amount > 100) {
			const msg = await message.reply(stripIndents`
				I can only delete a minimum of 1 and maximum of 100 messages at once.
				Also, I can only delete messages that have been sent in the past two weeks.
				`);
			setTimeout(() => {
				if (msg instanceof Message && !msg.deleted) msg.delete();
			}, 8000);
			return msg;
		}

		try {
			await message.channel.bulkDelete(amount, true); // continue, even if the selection contains old messages (> 2 weeks)
			const confirmationMessage: Message = await message.channel.send(
				`:white_check_mark: ${amount} ${
					amount > 1 ? "messages have" : "message has"
				} been deleted in <#${message.channel.id}>`
			);
			messageAutodelete(confirmationMessage, 3000);
			return confirmationMessage;
		} catch (error) {
			// only throws an error when there are no messages less than two weeks old
			console.error(error);
			return message.reply("I cannot delete messages older than two weeks :(");
		}
	}
}

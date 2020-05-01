import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, User } from "discord.js";

import { getUserIDFromArg } from "../../util/userHelpers";

export default class UnbanCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "unban",
			group: "mod",
			memberName: "unban",
			description: "Unbans a user from the guild.",
			examples: [
				"!unban [user] [reason?]",
				"!unban id",
				"!unban @mention They paid me $5 to unban them"
			],
			guildOnly: true,
			userPermissions: ["BAN_MEMBERS"],
			clientPermissions: ["BAN_MEMBERS"],
			guarded: true,
			argsType: "single" // only works if 'args' is not specified
		});
	}

	async run(message: CommandoMessage, args: string): Promise<Message | Message[]> {
		if (!args)
			return message.reply(
				"please provide a user to unban. This can be an ID or a user mention."
			);

		const id: string = getUserIDFromArg(args);

		let userToUnban: User;
		try {
			const banEntry = await message.guild.fetchBan(id);
			userToUnban = banEntry.user;
		} catch (error) {
			return message.reply(
				"I can't find that user! Please provide a valid ID or mention for the banned user."
			);
		}

		let reason: string | undefined;
		if (args.length === 2) reason = args[1];

		try {
			const unbannedUser = await message.guild.members.unban(userToUnban, reason);
			return message.say(
				`User **${unbannedUser.tag}** (ID: ${unbannedUser.id} has been unbanned!`
			);
		} catch (error) {
			console.error(error);
			return message.say(
				`:question: Cannot unbanban **${userToUnban.tag}** (ID: ${userToUnban.id})`
			);
		}
	}
}

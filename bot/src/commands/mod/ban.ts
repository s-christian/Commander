import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";

import { stripIndents } from "common-tags";
import { getUserIDFromArg, fetchMemberFromID } from "../../util/userHelpers";
import memberChecks from "../../util/memberChecks";

export default class BanCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "ban",
			group: "mod",
			memberName: "ban",
			description: "Bans a user from the guild.",
			examples: ["!ban [user] [reason?]", "!ban @mention", "!ban id Spamming"],
			guildOnly: true,
			userPermissions: ["BAN_MEMBERS"],
			clientPermissions: ["BAN_MEMBERS"],
			guarded: true,
			argsType: "multiple", // only works if 'args' is not specified
			argsCount: 2 // only applicable if 'argsType' is 'multiple'
		});
	}

	async run(message: CommandoMessage, args: string[]): Promise<Message | Message[]> {
		if (!args.length)
			return message.reply(
				"please provide a member to ban. This can be a mention or a user ID."
			);

		const id: string = getUserIDFromArg(args[0]);
		const memberToBan: GuildMember | undefined = await fetchMemberFromID(
			id,
			message.guild.members
		);

		if (!memberToBan)
			return message.reply(
				"I can't find that member! Please provide a valid mention or ID for a user currently in this guild."
			);

		// Check if the request is valid
		const invalidMessage = memberChecks(message, memberToBan, this.name);
		if (invalidMessage) return message.say(invalidMessage);

		let reason: string | undefined;
		if (args.length === 2) reason = args[1];

		// DM the member
		try {
			const dm = await memberToBan.createDM();
			await dm.send(stripIndents`
				You have been banned from **${message.guild?.name}** :frowning:
				Reason: ${reason}
			`);
		} catch (error) {
			console.error("Cannot create DM channel for banned user");
		}

		// Ban the member
		try {
			const bannedMember = await memberToBan.ban({ days: 7, reason });
			return message.say(stripIndents`
				:wave_tone1: **${bannedMember.user.tag}** (ID: ${bannedMember.id}) has been banned!
				Reason: ${reason}
			`);
		} catch (error) {
			console.error(error);
			return message.say(
				`:question: Cannot ban **${memberToBan.user.tag}** (ID: ${memberToBan.id})`
			);
		}
	}
}

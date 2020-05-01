import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";

import { stripIndents } from "common-tags";
import { getUserIDFromArg, fetchMemberFromID } from "../../util/userHelpers";
import memberChecks from "../../util/memberChecks";

export default class SoftBanCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "softban",
			aliases: ["sb", "soft-ban"],
			group: "mod",
			memberName: "sb",
			description: "Soft-bans a member from the guild.",
			details: "Bans a member, deletes 7 days worth of their messages, then unbans them.",
			examples: [
				"!softban [member] [reason?]",
				"!softban @mention",
				"!sb id This is a reason"
			],
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
				"please provide a member to soft-ban. This can be a mention or a user ID."
			);

		const id: string = getUserIDFromArg(args[0]);
		const memberToSoftBan: GuildMember | undefined = await fetchMemberFromID(
			id,
			message.guild.members
		);

		if (!memberToSoftBan)
			return message.reply(
				"I can't find that member! Please provide a valid mention or ID for a user currently in this guild."
			);

		// Check if the request is valid
		const invalidMessage = memberChecks(message, memberToSoftBan, this.name);
		if (invalidMessage) return message.say(invalidMessage);

		let reason: string | undefined;
		if (args.length === 2) reason = args[1];

		// DM the member
		try {
			const dm = await memberToSoftBan.createDM();
			await dm.send(stripIndents`
				You have been soft-banned from **${message.guild?.name}** :frowning:
				Reason: ${reason}
			`);
		} catch (error) {
			console.error("Cannot create DM channel for soft-banned user");
		}

		// Soft-ban the member
		try {
			const softBannedMember = await memberToSoftBan.ban({ days: 7, reason });
			await message.guild.members.unban(
				softBannedMember.id,
				`soft-ban completed : ${reason}`
			);
			return message.say(stripIndents`
				:wave_tone1: **${softBannedMember.user.tag}** (ID: ${softBannedMember.id}) has been soft-banned! Any messages they've sent in the past 7 days have been wiped.
				Reason: ${reason}
			`);
		} catch (error) {
			console.error(error);
			return message.say(
				`:question: Cannot soft-ban **${memberToSoftBan.user.tag}** (ID: ${memberToSoftBan.id})`
			);
		}
	}
}

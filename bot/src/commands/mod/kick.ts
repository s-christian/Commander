import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";

import { stripIndents } from "common-tags";
import { getUserIDFromArg, fetchMemberFromID } from "../../util/userHelpers";
import memberChecks from "../../util/memberChecks";

export default class KickCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "kick",
			group: "mod",
			memberName: "kick",
			description: "Kicks a member from the guild.",
			examples: [
				"!kick [member] [reason?]",
				"!kick @mention They called me stupid :(",
				"!kick id"
			],
			guildOnly: true,
			userPermissions: ["KICK_MEMBERS"],
			clientPermissions: ["KICK_MEMBERS"],
			guarded: true,
			argsType: "multiple", // only works if 'args' is not specified
			argsCount: 2 // only applicable if 'argsType' is 'multiple'
		});
	}

	async run(message: CommandoMessage, args: string[]): Promise<Message | Message[]> {
		if (!args.length)
			return message.reply(
				"please provide a member to kick. This can be a mention or a user ID."
			);

		const id: string = getUserIDFromArg(args[0]);
		const memberToKick: GuildMember | undefined = await fetchMemberFromID(
			id,
			message.guild.members
		);

		if (!memberToKick)
			return message.reply(
				"I can't find that member! Please provide a valid mention or ID for a user currently in this guild."
			);

		// Check if the request is valid
		const invalidMessage = memberChecks(message, memberToKick, this.name);
		if (invalidMessage) return message.say(invalidMessage);

		let reason: string | undefined;
		if (args.length === 2) reason = args[1];

		// DM the member
		try {
			const dm = await memberToKick.createDM();
			await dm.send(stripIndents`
				You have been kicked from **${message.guild?.name}** :frowning:
				Reason: ${reason}
			`);
		} catch (error) {
			console.error("Cannot create DM channel for kicked user");
		}

		// Kick the member
		try {
			const kickedMember = await memberToKick.kick(reason);
			return message.say(stripIndents`
				:boot: **${kickedMember.user.tag}** (ID: ${kickedMember.id}) has been kicked!
				Reason: ${reason}
			`);
		} catch (error) {
			console.error(error);
			return message.say(
				`:question: Cannot kick **${memberToKick.user.tag}** (ID: ${memberToKick.id})`
			);
		}
	}
}

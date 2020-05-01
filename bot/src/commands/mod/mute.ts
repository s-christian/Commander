import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";

import ms from "ms";
import { stripIndents } from "common-tags";
import { getUserIDFromArg, fetchMemberFromID } from "../../util/userHelpers";
import memberChecks from "../../util/memberChecks";

export default class MuteCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "mute",
			group: "mod",
			memberName: "mute",
			description:
				"Mutes a guild member for a default of five minutes, or a user-specified period of time.",
			examples: [
				"!mute [member] [time? = 5m] [reason?]",
				"!mute @mention",
				"!mute id 15m",
				"!mute @mention 2hours Bad memes"
			],
			guildOnly: true,
			userPermissions: ["MUTE_MEMBERS"],
			clientPermissions: ["MUTE_MEMBERS"],
			guarded: true,
			argsType: "multiple", // only works if 'args' is not specified
			argsCount: 3 // only applicable if 'argsType' is 'multiple'
		});
	}

	async run(message: CommandoMessage, args: string[]): Promise<Message | Message[] | null> {
		if (!args.length)
			return message.reply(
				"please provide a member to mute. This can be a mention or a user ID."
			);

		const id: string = getUserIDFromArg(args[0]);
		const memberToMute: GuildMember | undefined = await fetchMemberFromID(
			id,
			message.guild.members
		);

		if (!memberToMute)
			return message.reply(
				"I can't find that member! Please provide a valid mention or ID for a user currently in this guild."
			);

		// Check if the request is valid
		const invalidMessage = memberChecks(message, memberToMute, this.name);
		if (invalidMessage) return message.say(invalidMessage);

		// Get Roles
		const muteRoleName = "Muted";
		const memberRoleName = "Member";
		const muteRole = message.guild.roles.cache.find((role) => role.name === muteRoleName);
		const memberRole = message.guild.roles.cache.find((role) => role.name === memberRoleName);
		if (!muteRole)
			return message.say(`:question: Cannot find a mute role with the name ${muteRoleName}`);
		if (!memberRole)
			return message.say(
				`:question: Cannot find a member role with the name ${memberRoleName}`
			);

		// Check if the member is already muted
		if (memberToMute.roles.cache.has(muteRole.id))
			return message.reply(
				`**${memberToMute.displayName}** (ID: ${memberToMute.id}) is already muted!`
			);

		// [member, time, reason]
		let time: number = ms("5m");
		if (args.length > 1) time = ms(args[1]);
		if (!time)
			return message.reply(
				"incorrect time specified. Refer to `!help mute` for more information."
			);
		if (time > ms("24h")) return message.reply("the maximum mute time is 24 hours.");

		let reason: string | undefined;
		if (args.length === 3) reason = args[2];

		// Mute the member
		try {
			const mutedMember = await memberToMute.roles.add(muteRole, reason);
			mutedMember.roles.remove(memberRole);

			// Wait the time, then add their roles back
			setTimeout(async () => {
				try {
					await mutedMember.roles.add(memberRole, `mute time is up : ${reason}`);
					await mutedMember.roles.remove(muteRole, `mute time is up : ${reason}`);
				} catch (error) {
					console.log("Tried to add/remove a role that already/doesn't exist(s)");
					console.log(error);
				}
			}, time);

			// prettier-ignore
			return message.say(stripIndents`
				:shushing_face: **${mutedMember.user.tag}** (ID: ${mutedMember.id}) has been muted for ${ms(time, { long: true })}.
				Reason: ${reason}
			`);
		} catch (error) {
			console.error(error);
			return message.say(`:question: Cannot mute ${memberToMute.user.tag}`);
		}
	}
}

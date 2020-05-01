import { GuildMember } from "discord.js";
import { CommandoMessage } from "discord.js-commando";
import rolesAreHigher from "./rolesAreHigher";

export default function memberChecks(
	msg: CommandoMessage,
	memberToActUpon: GuildMember,
	command: string
): string {
	// Can't act upon bots (including Commander)
	if (memberToActUpon.user.bot) {
		return `:no_entry: You can't ${command} bots!`;
	}
	// Can't act upon members higher than yourself
	else if (!rolesAreHigher(msg.member, memberToActUpon)) {
		return `:no_entry: You can only ${command} members lower than you!`;
	}
	// Can't act upon me :)
	else if (memberToActUpon.id === process.env.BOT_OWNER_ID) {
		return `:no_entry: You can't ${command} my master!`;
	}
	// No errors
	else return "";
}

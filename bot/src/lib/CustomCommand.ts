import { Command, CommandoClient, CommandInfo, CommandoMessage } from "discord.js-commando";

export default class CustomCommand extends Command {
	constructor(client: CommandoClient, info: CommandInfo) {
		super(client, info);
	}

	/**
	 * Checks whether the user has permission to use the command
	 * @param {CommandoMessage} message - The triggering command message
	 * @param {boolean} [ownerOverride=true] - Whether the bot owner(s) will always have permission
	 * @return {boolean|string} Whether the user has permission, or an error message to respond with if they don't
	 */
	hasPermission(message: CommandoMessage, ownerOverride = true): string | boolean {
		if (
			message.channel.type === "text" && // in a guild
			message.member.roles.highest.position === 0 && // user has no roles
			message.member !== message.guild.owner // user is not the guild owner
		)
			// reply text
			return "you must be a member to use my commands.";
		else return super.hasPermission(message, ownerOverride); // afterwards, use the normal hasPermission checks
	}
}

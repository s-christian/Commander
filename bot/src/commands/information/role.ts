import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, Role } from "discord.js";

import { getRoleIDFromArg } from "../../util/roleHelpers";

export default class RoleCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "role",
			aliases: ["role-info", "roleinfo"],
			group: "information",
			memberName: "role",
			description: "Get information about a role.",
			examples: ["!role [role]", "!role id", "!role-info mention"],
			// NOTE: bot owners bypass all throttling
			throttling: {
				usages: 1,
				duration: 5 //seconds
			},
			guildOnly: true,
			argsType: "single"
		});
	}

	// "message" and "args" are passed, so we can destructure args, or if no specific args are provided just name it anything we want
	async run(message: CommandoMessage, mentionOrID: string): Promise<Message | Message[]> {
		if (!mentionOrID) return message.reply("please provide a role ID or mention.");
		const roleID: string = getRoleIDFromArg(mentionOrID);

		const role: Role | null = await message.guild.roles.fetch(roleID);
		if (!role) return message.reply("that role does not exist.");

		const roleEmbed = new MessageEmbed()
			.setColor(role.color)
			.setAuthor(
				this.client.user!.username,
				this.client.user?.displayAvatarURL({ size: 128, format: "png" })
			)
			.setTitle("Role Info")
			.addField("Role", `<@&${role.id}>`)
			.addField(
				"Permissions",
				role.permissions.toArray().map((permission: string) => {
					const splitPermission = permission.toLowerCase().split("_");
					splitPermission.forEach(
						(word: string, index: number) =>
							(splitPermission[index] =
								word !== "tts" && word !== "vad"
									? word.charAt(0).toUpperCase() + word.slice(1)
									: word.toUpperCase())
					);
					return `• ${splitPermission.join(" ")}`;
				})
			)
			.setTimestamp();

		return message.say(roleEmbed);
	}
}

import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, Role } from "discord.js";

export default class RolesCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "roles",
			aliases: ["get-roles", "getroles", "roles-info", "rolesinfo"],
			group: "information",
			memberName: "roles",
			description: "Get a list of the guild's roles",
			examples: ["!roles", "!get-roles"],
			// NOTE: bot owners bypass all throttling
			throttling: {
				usages: 1,
				duration: 30 //seconds
			},
			guildOnly: true
		});
	}

	// "message" and "args" are passed, so we can destructure args, or if no specific args are provided just name it anything we want
	async run(message: CommandoMessage): Promise<Message | Message[]> {
		const rolesEmbed = new MessageEmbed()
			.setColor("GOLD")
			.setAuthor(
				this.client.user!.username,
				this.client.user?.displayAvatarURL({ size: 128, format: "png" })
			)
			.setTitle(message.guild.name)
			.addField(
				"Roles",
				message.guild.roles.cache.map((role: Role) => `<@&${role.id}>`)
			)
			.setTimestamp();

		return message.say(rolesEmbed);
	}
}

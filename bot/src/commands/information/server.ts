import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, Guild, GuildPreview } from "discord.js";

export default class ServerCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "server",
			aliases: ["server-info", "guild", "guild-info"],
			group: "information",
			memberName: "server-info",
			description: "Get information about the server.",
			examples: ["!server [publicServerID?]", "!server", "!server id"],
			clientPermissions: ["MANAGE_GUILD"],
			throttling: {
				usages: 1,
				duration: 5
			},
			argsType: "single"
		});
	}

	async run(message: CommandoMessage, guildID: string): Promise<Message | Message[]> {
		let guild: Guild | GuildPreview | undefined;
		if (guildID) {
			try {
				guild = await this.client.fetchGuildPreview(guildID);
			} catch (error) {
				guild = undefined;
			}
			if (!guild)
				return message.say(
					"Either the guild you are searching for is not public, or you did not provide a valid guild ID."
				);
		} else {
			if (message.channel.type === "dm")
				return message.say(
					"You must either provide a guild ID, or use this command within a guild."
				);
			guild = message.guild;
		}

		const commanderAvatar = this.client.user!.displayAvatarURL({ size: 128, format: "png" });
		const guildImage = guild.iconURL({ size: 1024, format: "png", dynamic: true }) || undefined;

		// Base embed, same information for both a Guild and GuildPreview
		const serverInfoEmbed = new MessageEmbed()
			.setAuthor(this.client.user!.username, commanderAvatar)
			.setTimestamp()
			.setTitle(guild.name)
			.setDescription(`(ID: ${guild.id})`)
			.addField("Description", guild.description || "*None*");
		if (guildImage) serverInfoEmbed.setThumbnail(guildImage);

		// GuildPreview information
		if (guild instanceof GuildPreview) {
			serverInfoEmbed
				.setColor("PURPLE")
				.addField("Online Members", guild.approximatePresenceCount, true)
				.addField("Total Members", guild.approximateMemberCount, true)
				.addField("Number of Emojis", guild.emojis.size)
				.setFooter("Guild preview");
		}
		// Full Guild information
		else {
			const serverAgeMs: number = Date.now() - guild.createdAt.getTime();
			const serverAgeDays: number = Math.floor(serverAgeMs / 86400000);
			const region = guild.region.split("-");
			// "us-east" => "US East"
			const formattedRegion =
				region[0].toUpperCase() + " " + region[1][0].toUpperCase() + region[1].slice(1);

			serverInfoEmbed
				.setColor("GREEN")
				.addField(
					"Online Members",
					guild.presences.cache.filter((p) => p.status === "online").size,
					true
				)
				.addField("Total Members", guild.memberCount, true)
				.addField("Members in VC", guild.voiceStates.cache.size, true)
				.addField("Number of Roles", guild.roles.cache.size)
				.addField("Guild Creation Date", guild.createdAt.toLocaleString(), true)
				.addField("Server Age", `${serverAgeDays} day(s)`, true)
				.addField("Region", formattedRegion, true)
				.addField("Owner", `<@${guild.owner?.id}>`);
		}

		return message.say(serverInfoEmbed);
	}
}

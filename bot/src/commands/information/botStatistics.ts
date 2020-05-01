import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed } from "discord.js";
import ms from "ms";

export default class StatisticsCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "statistics",
			aliases: ["stats", "bot-info", "botinfo"],
			group: "information",
			memberName: "statistics",
			description: "Display information about the bot and how it's being used.",
			examples: ["!statistics", "!stats"],
			throttling: {
				usages: 1,
				duration: 60
			}
		});
	}

	async run(message: CommandoMessage): Promise<Message | Message[]> {
		const uptime = ms(this.client.uptime!, { long: true });
		const guilds = this.client.guilds.cache.size;
		const channels = this.client.channels.cache.filter(
			(channel) => channel.type === "text" || channel.type === "voice" // only count text and voice channels
		).size;
		const users = this.client.users.cache.size;

		const statsEmbed = new MessageEmbed()
			.setAuthor(
				this.client.user!.username,
				this.client.user!.displayAvatarURL({ size: 128, format: "png" })
			)
			.setColor(0xa28968)
			.setTitle(`${this.client.user!.username} Statistics`)
			.setDescription(`Uptime: ${uptime}`)
			.addFields([
				{ name: "Guilds", value: guilds },
				{ name: "Channels", value: channels },
				{ name: "Users", value: users }
			])
			.setTimestamp();

		return message.say(statsEmbed);
	}
}

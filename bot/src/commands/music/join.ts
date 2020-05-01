import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildChannel } from "discord.js";

export default class JoinCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: "join",
			group: "music",
			memberName: "join",
			description: "Have the bot join your voice channel."
		});
	}

	async run(message: CommandoMessage): Promise<Message | Message[]> {
		const vc: GuildChannel | undefined = message.guild.channels.cache.find(
			(channel) => channel.id === message.channel.id && channel.type === "voice"
		);
		// Make sure the channel exists, and that the bot isn't already connected to it
		if (vc && !this.client.voice?.connections.get(vc.id))
			return await message.say(`You're in a voice channel with id ${vc.id}`);
		return await message.say("You're not in any voice channel!");
	}
}

import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, Role, TextChannel, MessageEmbed } from "discord.js";

export default class AutoMember extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: "automember",
			group: "misc",
			memberName: "automember",
			description:
				"Automatically assigns the Member role when the user enters the guild's secret phrase.",
			guildOnly: true,
			defaultHandling: false,
			hidden: true,
			patterns: [/^cardboard$/] // matches the secret phrase, and ONLY this phrase (nothing else can be in the string except this exact phrase)
		});
	}

	// Because of one of the CommandDispatcher's Inhibitors, this command will only ever run
	// if the user enters the exact secret phrase, and if the user isn't already a member.
	async run(message: CommandoMessage): Promise<Message | Message[]> {
		// Give the user the Member role
		const memberRole: Role | undefined = message.guild.roles.cache.find(
			(role) => role.name === "Member"
		);
		if (!memberRole) return message.channel.send(":question: Unable to find the Member role");

		await message.member.roles.add(
			memberRole,
			"User entered the secret phrase to gain entrance to the rest of the server."
		);

		// Send a welcome message in the general text channel
		const generalChannel: TextChannel | undefined = message.guild.channels.cache.find(
			(channel) => channel.name === "general" && channel.type === "text"
		) as TextChannel;
		if (!generalChannel)
			return message.channel.send(":question: Unable to find the general channel");

		const welcomeEmbed = new MessageEmbed()
			.setColor(0xa28968)
			.setAuthor(
				this.client.user!.username,
				this.client.user!.displayAvatarURL({ size: 128, format: "png" })
			)
			.setThumbnail(
				message.author.displayAvatarURL({ size: 512, format: "png", dynamic: true })
			)
			.setTitle(`Welcome, **${message.member.user.username}**!`)
			.setDescription(`<@${message.author.id}> has just joined the server`)
			.setTimestamp();

		return generalChannel.send(welcomeEmbed)!;
	}
}

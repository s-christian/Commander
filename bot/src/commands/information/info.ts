import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, GuildMember, User } from "discord.js";

import { getUserIDFromArg, fetchMemberFromID, fetchUserFromID } from "../../util/userHelpers";

export default class InfoCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "info",
			aliases: ["user-info", "user", "avatar", "pfp", "icon"],
			group: "information",
			memberName: "user-info",
			description: "Get information about yourself or another user.",
			examples: [
				"!info [user? = you]",
				"!info",
				`!info <@${process.env.BOT_OWNER_ID}>`,
				"!info id"
			],
			// NOTE: bot owners bypass all throttling
			throttling: {
				usages: 1,
				duration: 5 //seconds
			},
			argsType: "single"
		});
	}

	// "message" and "args" are passed, so we can destructure args, or if no specific args are provided just name it anything we want
	async run(message: CommandoMessage, mentionOrID: string): Promise<Message | Message[]> {
		let userID: string | undefined;
		let member: GuildMember | undefined;
		let user: User;

		const infoEmbed = new MessageEmbed();

		// get ID from arg
		if (mentionOrID) userID = getUserIDFromArg(mentionOrID);

		// Guild Channel
		if (message.channel.type === "text") {
			// arg provided
			if (userID) {
				member = await fetchMemberFromID(userID, message.guild.members);
				// If the specified user is not in the guild
				if (!member) {
					const userResponse: User | undefined = await fetchUserFromID(
						userID,
						this.client.users
					);
					if (userResponse) user = userResponse;
					else return message.reply("I can't find that user.");
				} else user = member.user;
			}
			// no arg provided
			else {
				member = message.member;
				user = message.author;
			}

			const commanderAvatar = this.client.user!.displayAvatarURL({
				size: 128,
				format: "png"
			});
			const userAvatar = user.displayAvatarURL({ size: 512, format: "png", dynamic: true });

			const userAgeMs: number = Date.now() - user.createdAt.getTime();
			const userAgeServerMs: number | undefined =
				member && member.joinedAt ? Date.now() - member.joinedAt.getTime() : undefined;
			const userAgeDays: number = Math.floor(userAgeMs / 86400000); // milliseconds in 1 day
			const userAgeServerDays: number | undefined = userAgeServerMs
				? Math.floor(userAgeServerMs / 86400000)
				: undefined;

			const presenceStatus = user.presence.status;
			const formattedPresenceStatus =
				presenceStatus !== "dnd"
					? presenceStatus[0].toUpperCase() + presenceStatus.slice(1)
					: "Do Not Disturb";

			// Build the embed
			infoEmbed
				.setAuthor(this.client.user!.username, commanderAvatar)
				.setThumbnail(userAvatar)
				.setTimestamp()
				.setColor(member ? "BLUE" : "RED")
				.setTitle(user.tag)
				.setDescription(`(ID: ${user.id})`)
				.addField("Username", member ? user.username : `<@${user.id}>`, !!member);

			if (member)
				infoEmbed
					.addField("Nickname", member.nickname || "*None*", true)
					.addField(
						"Roles",
						member.roles.cache
							.map((role) => `<@&${role.id}>`)
							.slice(0, -1)
							.join(", ") || "*None*"
					)
					.addField("Join Date", member.joinedAt?.toLocaleString(), true)
					.addField("Time in Server", `${userAgeServerDays} day(s)`, true)
					.addField("\u200b", "\u200b");

			infoEmbed
				.addField("Account Creation Date", user.createdAt.toLocaleString(), true)
				.addField("Account Age", `${userAgeDays} day(s)`, true)
				.addField("Bot Account", user.bot, true)
				.addField(
					"Status",
					member ? `<@${user.id}> • ${formattedPresenceStatus}` : "Unknown",
					true
				);

			if (!member) infoEmbed.setFooter("User is not in this guild");
		}
		// DM Channel
		else {
			// arg provided
			if (userID) {
				const userResponse: User | undefined = await fetchUserFromID(
					userID,
					this.client.users
				);
				if (userResponse) user = userResponse;
				else return message.reply("I can't find that user.");
			}
			// no arg provided
			else {
				user = message.author;
			}

			const commanderAvatar = this.client.user!.displayAvatarURL({
				size: 128,
				format: "png"
			});
			const userAvatar = user.displayAvatarURL({ size: 512, format: "png", dynamic: true });

			const timeAliveMs: number = Date.now() - user.createdAt.getTime();
			const timeAliveDays: number = Math.floor(timeAliveMs / 86400000); // milliseconds in 1 day

			// Build the embed
			infoEmbed
				.setAuthor(this.client.user!.username, commanderAvatar)
				.setThumbnail(userAvatar)
				.setTimestamp()
				.setColor("BLUE")
				.setTitle(user.tag)
				.setDescription(`(ID: ${user.id})`)
				.addField("Username", `<@${user.id}>`)
				.addField("Account Creation Date", user.createdAt.toLocaleString(), true)
				.addField("Account Age", `${timeAliveDays} day(s)`, true)
				.addField("Bot Account", user.bot, true);
		}
		// Send the embed
		return message.say(infoEmbed);
	}
}

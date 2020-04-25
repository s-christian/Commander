// TODO:
// Collect server statistics for admins such as total messages sent
// Display information on particular users
// Play music
// Use a MongoDB database (create another shard or whatever on my one account) and store a list of notes for users

import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" }); // starts at root, not current (/src) directory

import ms from "ms";

import Discord from "discord.js";
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
const botID = process.env.BOT_ID;
const botOwnerID = process.env.BOT_OWNER_ID;

let prefix = "!";
let ownerPrefix = "//";

let memberRole = "Member";
let muteRole = "Mute";

// const extractFirstWord = (msg: string): { [key: string]: string } => {
// 	const firstSpace = msg.indexOf(" ");
// 	let firstWord = undefined;
// 	let theRest = undefined;

// 	if (firstSpace > 0) {
// 		firstWord = msg.slice(0, firstSpace);
// 		theRest = msg.slice(firstSpace + 1);
// 	} else {
// 		firstWord = msg;
// 		theRest = "";
// 	}

// 	return { firstWord, theRest };
// };

const rolesAreHigher = (
	memberKicking: Discord.GuildMember | undefined | null,
	memberBeingKicked: Discord.GuildMember | undefined | null
): boolean => {
	if (!memberKicking || !memberBeingKicked) return false;
	const roleCompNum: number = memberKicking.roles.highest.comparePositionTo(
		memberBeingKicked.roles.highest
	); // This number represents how many roles above the other it is. If roles are equal, it's 0. If first role is higher, it's >0. If second role is higher, it's <0.
	return roleCompNum > 0;
};

const memberChecks = (
	msg: Discord.Message,
	memberToActUpon: Discord.GuildMember,
	command: string
): boolean => {
	// Can't act upon bots (including Commander)
	if (memberToActUpon.user.bot) {
		msg.channel.send(`:angry: You can't ${command} bots!`);
		return false;
	}
	// Can't act upon members higher than yourself
	if (!rolesAreHigher(msg.member, memberToActUpon)) {
		msg.channel.send(`:angry: You can only ${command} members lower than you!`);
		return false;
	}
	// Can't act upon me :)
	if (memberToActUpon.id === botOwnerID) {
		msg.channel.send(`:angry: You can't ${command} my master!`);
		return false;
	}

	return true;
};

const isChannel = (msg: Discord.Message, channelName: string): boolean => {
	if (msg.channel instanceof Discord.DMChannel || msg.channel instanceof Discord.NewsChannel)
		return false;
	return msg.channel.name === channelName;
};

const subarrayToString = (arr: any[], startIndex: number): string => {
	return arr.slice(startIndex).join(" ");
};

// Will only run once anyway since this only occurs on login
client.once("ready", () => {
	console.log(`--- Logged in as ${client.user?.tag}! ---`);
});

// Note: In a msg like "!test     ", Discord automatically removes all trailing whitespace, leaving only "!test"
client.on("message", (msg: Discord.Message) => {
	const args: string[] = msg.content.match(/\S+/g) || []; // get rid of all whitespace and just make an array of the words

	// Only act if the message is in a server, starts with the bot's prefix, and if the sender isn't Commander itself
	if (
		msg.channel instanceof Discord.TextChannel &&
		msg.author.id !== botID &&
		msg.content.startsWith(prefix)
	) {
		const command: string = args.shift()!.slice(prefix.length); // ! is a non-null assertion. remove prefix and keep the command

		// prettier-ignore
		process.stdout.write( // used over console.log() to not print a trailing newline
			"\n" +
			`Command incoming! => ${command}\n` +
			`       With args:    `
		);
		console.log(args);

		/*
		// --- Non-Privileged Commands ---
		*/
		if (command === "test") {
			console.log("test");
		}

		// Test bot connectivity. Ping, pong!
		if (command === "ping") {
			msg.reply("pong!");
		}

		// Send the member a DM with all the commands that Commander accepts
		if (command.match(/^(commands|help)$/)) {
			msg.author
				.createDM()
				.then((memberDM: Discord.DMChannel) => {
					memberDM.send(
						"__Commander accepts the following commands__:\n!ping\n!commands (the one you just used :smiley:)\n!repeat\n!server\n!kick\n!ban"
					);
				})
				.catch((error) => {
					msg.reply(
						"I'm unable to DM you! Please make sure your settings allow me to message you."
					);
				});
		}

		// Print information about the server
		if (command === "server") {
			msg.channel.send(
				`Server name: ${msg.guild?.name}\n` +
					`Server description: ${msg.guild?.description || ""}\n` +
					`Date created: ${msg.guild?.createdAt}\n` +
					`Total members: ${msg.guild?.memberCount}\n` +
					`Server owner: ${msg.guild?.owner?.user.tag}\n`,
				{
					files: [`${msg.guild?.iconURL({ size: 256 })}`]
				}
			);
		}

		// Print information about a user
		if (command === "info") {
			const user = msg.mentions?.users.first();
			if (user) {
				msg.channel.send(
					`User tag: ${user.tag}\n` +
						`Created on: ${user.createdAt}\n` +
						`User ID: ${user.id}\n` +
						`Bot: ${user.bot}`,
					{
						files: [`${user.displayAvatarURL({ size: 256 })}`]
					}
				);
			}
		}

		// Have Commander repeat the member's message
		if (command === "repeat") {
			msg.channel.send(subarrayToString(args, 0));
		}

		/*
		// --- Commands that require certain permissions ---
		*/
		// Kick a member with an optional reason
		if (command === "kick") {
			// Can't kick if you don't have the KICK_MEMBERS role permission
			if (!msg.member?.hasPermission("KICK_MEMBERS"))
				return msg.channel.send("Insufficient permissions");

			const memberToKick = msg.mentions?.members?.first();
			// Check if member was found
			if (!memberToKick) return msg.reply("I can't find that member");

			if (!memberChecks(msg, memberToKick, command)) return;

			const reason: string = subarrayToString(args, 1); // everything after memberToKick

			// DM the member
			memberToKick
				.createDM()
				.then((memberDM: Discord.DMChannel) => {
					memberDM
						.send(
							`You have been kicked from ${msg.guild?.name} :frowning:` +
								`${reason && `\nReason: ${reason}`}`
						)
						.catch((error) => console.error(error));
				})
				.catch((error) => console.log(error));

			// Kick the member
			memberToKick
				.kick(reason)
				.then((kickedMember: Discord.GuildMember) => {
					// Show the kick message in the guild
					msg.channel.send(
						`:wave_tone1: ${kickedMember.user.tag} has been kicked!${reason &&
							`\nReason: ${reason}`}`
					);
				})
				.catch((error) => {
					msg.channel.send(`:question: Cannot kick ${memberToKick.user.tag}`);
					console.log(error);
				});
		}

		// Mute a member with an optional reason
		if (command === "mute") {
			// Can't Mute if you don't have the MUTE_MEMBERS permission
			if (!msg.member?.hasPermission("MUTE_MEMBERS"))
				return msg.channel.send("Insufficient permissions");

			const memberToMute = msg.mentions?.members?.first();
			// Check if member was found
			if (!memberToMute) return msg.reply("I can't find that member");

			if (!memberChecks(msg, memberToMute, command)) return;

			let time = "5m"; // default mute time
			let reason: string;
			if (typeof ms(args[1]) === "number") {
				time = args[1]; // if a time is specified
				reason = subarrayToString(args, 2); // everything after the time
			} else reason = subarrayToString(args, 1); // everthing after memberToMute

			// Remove the Member role
			memberToMute.roles.remove(memberRole, reason).catch((error) => {
				msg.channel.send(
					`:question: Unable to remove role "${memberRole}" from ${memberToMute.user.tag}`
				);
				console.log(error);
			});

			// Assign the Muted role
			memberToMute.roles
				.add(muteRole, reason)
				.then((mutedMember: Discord.GuildMember) => {
					// Show the kick message in the guild
					msg.channel.send(
						`:shushing_face: ${mutedMember.user.tag} has been muted for ${ms(ms(time), {
							long: true
						})}.` + `${reason && `\nReason: ${reason}`}`
					);
				})
				.catch((error) => {
					msg.channel.send(
						`:question: Cannot mute ${memberToMute.user.tag} using role "${muteRole}"`
					);
					console.log(error);
				});

			// Wait the time, then unmute the member
			setTimeout(() => {
				memberToMute.roles.add(memberRole).catch((error) => {
					msg.reply(
						`:question: Unable to add role "${memberRole}" back to ${memberToMute.user.tag}`
					);
					console.log(error);
				});
				memberToMute.roles.remove(muteRole).catch((error) => {
					msg.reply(
						`:question: Unable to remove role "${muteRole}" from ${memberToMute.user.tag}`
					);
					console.log(error);
				});
			}, ms(time));
		}

		/*
		// --- Admin Commands ---
		*/
		const memberIsAdmin = msg.member?.roles.highest.name === "Admin";

		if (memberIsAdmin) {
			// Ban a member with an optional reason
			if (command === "ban") {
			}

			// Remove a number of messages from chat
			if (command.match(/^(clear|delete|del|remove|rm)$/)) {
			}
		}
	}

	/*
	// --- OWNER ONLY Commands ---
	*/
	// These commands are also accepted through DM
	if (
		msg.author.id === botOwnerID &&
		msg.author.id !== botID &&
		msg.content.startsWith(ownerPrefix)
	) {
		const command: string = args.shift()!.slice(ownerPrefix.length); // ! is a non-null assertion. remove prefix and keep the command

		// prettier-ignore
		process.stdout.write( // used over console.log() to not print a trailing newline
			"\n" +
			`OWNER COMMAND incoming! => ${command}\n` +
			`             With args:    `
		);
		console.log(args);

		// Test bot connectivity. Ping, pong!
		if (command === "ping") {
			msg.reply("pong!");
		}

		// Set prefix
		if (command === "setPrefix") {
			prefix = subarrayToString(args, 0);
			msg.channel.send(`:exclamation: prefix set to ${prefix}`);
		}

		// Set owner prefix
		if (command === "setOwnerPrefix") {
			ownerPrefix = subarrayToString(args, 0);
			msg.channel.send(`:exclamation: ownerPrefix set to ${ownerPrefix}`);
		}
	}
});

client.login(token);

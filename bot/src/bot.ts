import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" }); // starts at root, not current (/src) directory

import Discord from "discord.js";
const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN;

const prefix = "!";

const extractFirstWord = (msg: string): { [key: string]: string } => {
	const firstSpace = msg.indexOf(" ");
	let firstWord = undefined;
	let theRest = undefined;

	if (firstSpace > 0) {
		firstWord = msg.slice(0, firstSpace);
		theRest = msg.slice(firstSpace + 1);
	} else {
		firstWord = msg;
		theRest = "";
	}

	return { firstWord, theRest };
};

const isChannel = (msg: Discord.Message, channelName: string): boolean => {
	if (msg.channel instanceof Discord.DMChannel || msg.channel instanceof Discord.NewsChannel)
		return false;
	return msg.channel.name === channelName;
};

// Will only run once anyway since this only occurs on login
client.once("ready", () => {
	console.log(`--- Logged in as ${client.user?.tag}! ---`);
});

// Note: In a msg like "!test     ", Discord automatically removes all trailing whitespace, leaving only "!test"
client.on("message", (msg) => {
	// Only act if the message starts with the bot's prefix, if the sender isn't Commander itself, and if the sender is an Admin
	if (msg.content.charAt(0) === prefix && msg.author.id !== "675849072950902883") {
		const { firstWord, theRest: content } = extractFirstWord(msg.content);
		const command = firstWord.slice(1); // remove the prefix from command

		const memberIsAdmin = msg.member?.roles.highest.name === "Admin";

		console.log(`\nCommand incoming! => ${command}`);
		console.log(`With content: ${content}`);

		/*
		// --- Non-Privileged Commands ---
		*/

		// Test bot connectivity. Ping, pong!
		if (command === "ping") {
			msg.reply("pong!");
		}

		// Have Commander repeat the member's message
		if (command === "repeat") {
			msg.channel.send(content);
		}

		// Print information about the server
		if (command === "server") {
			msg.channel.send(
				`Server name: ${msg.guild?.name}\n` +
					`Server description: ${msg.guild?.description || ""}\n` +
					`Date created: ${msg.guild?.createdAt}\n` +
					`Total members: ${msg.guild?.memberCount}\n` +
					`Server owner: ${msg.guild?.owner?.user.tag}\n` +
					`Server icon: ${msg.guild?.iconURL({ size: 256 })}`
			);
		}

		// Send the member a DM with all the commands that Commander accepts
		if (command === "help") {
			msg.author.createDM().then((memberDM: Discord.DMChannel) => {
				memberDM.send(
					"__Commander accepts the following commands__:\n!ping\n!repeat\n!server\n!kick\n!ban"
				);
			});
		}

		/*
		// --- Admin Commands ---
		*/

		if (memberIsAdmin) {
			// Kick a member with an optional reason
			if (command === "kick") {
				const { theRest: reason } = extractFirstWord(content);
				const member = msg.mentions?.members?.first();
				console.log(member);
				if (member) {
					// DM the member
					member
						.createDM()
						.then((memberDM: Discord.DMChannel) => {
							memberDM.send(
								`You have been kicked from ${msg.guild?.name} :frowning:${reason &&
									`\nReason: ${reason}`}`
							);
							// Kick the member
							member
								.kick(reason)
								.then((kickedMember: Discord.GuildMember) => {
									// Show the kick message in the guild
									msg.channel.send(
										`${
											kickedMember.displayName
										} has been kicked :wave_tone1:${reason &&
											`\nReason: ${reason}`}`
									);
								})
								.catch((error) => console.log(error));
						})
						.catch((error) => console.log(error));
				}
			}

			// Ban a member with an optional reason
			if (command === "ban") {
			}

			// Remove a number of messages from chat
			if (command.match(/^(clear|delete|del|remove|rm)$/)) {
			}
		}
	}
});

client.login(token);

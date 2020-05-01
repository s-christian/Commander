// TODO:
// Collect server statistics for admins such as total messages sent
// Play music
// Use a MongoDB database (create another shard or whatever on my one account) and store a list of notes for users

import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" }); // starts at root, not current (/src) directory

const token = process.env.BOT_TOKEN;
const botID = process.env.BOT_ID;

import Discord from "discord.js";
import { CommandoClient, FriendlyError, CommandoMessage } from "discord.js-commando";
import path from "path";

let prefix = "!";
let ownerPrefix = "//";

let welcomeChannel = "general";

const client = new CommandoClient({
	commandPrefix: prefix,
	owner: process.env.BOT_OWNER_ID,
	invite: "https://discord.gg/ZfJGpMU"
});

client
	.on("error", console.error)
	.on("warn", console.warn)
	.on("debug", console.log)
	.once("ready", () => {
		console.log(`--- Logged in as ${client.user?.tag}! ${client.user?.id} ---`);
		client.user?.setActivity("with Discord.js and Commando");
	})
	.on("disconnect", () => {
		console.warn("Disconnected!");
	})
	.on("reconnecting", () => {
		console.warn("Reconnecting...");
	})
	.on("commandError", (cmd, err) => {
		if (err instanceof FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on("commandBlocked", (message: CommandoMessage, reason: string) => {
		console.log(`
			Command ${message.command ? `${message.command.groupID}:${message.command.memberName}` : ""}
			blocked; ${reason}
		`);
	})
	.on("commandPrefixChange", (guild, prefix) => {
		console.log(`
			Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
		`);
	})
	.on("commandStatusChange", (guild, command, enabled) => {
		console.log(`
			Command ${command.groupID}:${command.memberName}
			${enabled ? "enabled" : "disabled"}
			${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
		`);
	})
	.on("groupStatusChange", (guild, group, enabled) => {
		console.log(`
			Group ${group.id}
			${enabled ? "enabled" : "disabled"}
			${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
		`);
	});

client.on("guildMemberAdd", (member) => {
	const channel = member.guild.channels.cache.get(welcomeChannel);
	if (channel) {
	}
});

// Note: In a msg like "  !test  ", Discord automatically removes all unnecessary whitespace, leaving only "!test"
client.on("message", (message: Discord.Message) => {
	if (message.author.bot) return; // return if the message was sent by a bot
	const args: string[] = message.content.match(/\S+/g) || []; // get rid of all whitespace and just make an array of the words

	// Only act if the message is in a server
	if (message.channel instanceof Discord.TextChannel && message.content.startsWith(prefix)) {
		const command: string = args.shift()!.slice(prefix.length); // ! is a non-null assertion. remove prefix and keep the command

		// prettier-ignore
		process.stdout.write( // used over console.log() to not print a trailing newline
			"\n" +
			`Command incoming! => ${command}\n` +
			`       With args:    `
		);
		console.log(args);
	}

	/*
	// --- OWNER ONLY Commands ---
	*/
	// These commands are also accepted through DM
	// else if (
	// 	message.author.id === process.env.BOT_OWNER_ID &&
	// 	message.content.startsWith(ownerPrefix)
	// ) {
	// 	const command: string = args.shift()!.slice(ownerPrefix.length); // ! is a non-null assertion. remove prefix and keep the command

	// 	// prettier-ignore
	// 	process.stdout.write( // used over console.log() to not print a trailing newline
	// 		"\n" +
	// 		`OWNER COMMAND incoming! => ${command}\n` +
	// 		`             With args:    `
	// 	);
	// 	console.log(args);

	// 	// Test bot connectivity. Ping, pong!
	// 	if (command === "ping") {
	// 		message.reply("pong!");
	// 	}

	// 	// Set prefix
	// 	else if (command === "setPrefix") {
	// 		prefix = subarrayToString(args, 0);
	// 		message.channel.send(`:warning: prefix set to ${prefix}`);
	// 	}

	// 	// Set owner prefix
	// 	else if (command === "setOwnerPrefix") {
	// 		ownerPrefix = subarrayToString(args, 0);
	// 		message.channel.send(`:warning: ownerPrefix set to ${ownerPrefix}`);
	// 	}

	// 	// Set admin role
	// 	else if (command === "setAdminRole") {
	// 		adminRole = subarrayToString(args, 0);
	// 		message.channel.send(`:warning: adminRole set to ${adminRole}`);
	// 	}

	// 	// Set member role
	// 	else if (command === "setMemberRole") {
	// 		memberRole = subarrayToString(args, 0);
	// 		message.channel.send(`:warning: memberRole set to ${memberRole}`);
	// 	}

	// 	// Set mute role
	// 	else if (command === "setMuteRole") {
	// 		muteRole = subarrayToString(args, 0);
	// 		message.channel.send(`:warning: muteRole set to ${muteRole}`);
	// 	}

	// 	// Set welcome channel
	// 	else if (command === "setWelcomeChannel") {
	// 		welcomeChannel = subarrayToString(args, 0);
	// 		message.channel.send(`:warning: welcomeChannel set to ${welcomeChannel}`);
	// 	}
	// }
});

client.registry
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands() // could put in { help: false }, for example
	.registerGroups([
		{ id: "information", name: "Information" },
		{ id: "main", name: "Main" },
		{ id: "music", name: "Music" },
		{ id: "mod", name: "Mod", guarded: true }
	])
	.registerCommandsIn(path.join(__dirname, "commands"));

client.login(token);

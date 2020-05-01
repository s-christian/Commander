// TODO:
// Collect server statistics for admins such as total messages sent
// Play music
// Use a database and store a list of notes for users

if (process.env.NODE_ENV !== "production") require("dotenv").config({ path: "./config/.env" }); // starts at root, not current (/src) directory

import {
	CommandoClient,
	CommandoMessage,
	FriendlyError,
	SQLiteProvider,
	Inhibition
} from "discord.js-commando";

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const prefix = "!";

//const welcomeChannelName = "general";

const client = new CommandoClient({
	commandPrefix: prefix,
	owner: process.env.BOT_OWNER_ID,
	invite: "https://discord.gg/ZfJGpMU"
});

// Whitelist certain channels and channel categories; the bot can only be used in these places
client.dispatcher.addInhibitor((msg: CommandoMessage): false | string | Inhibition => {
	if (
		msg.channel.type === "text" && // only applies to Guild channels
		msg.channel.parent?.name !== "Commander" && // contains all the channels used for executing commands
		msg.channel.parent?.name !== "Entrance" && // used to display the command warning rather than ignore the user
		!msg.member.roles.cache.find((role) => role.name === "Admin") && // admins exempt from all whitelist restrictions
		msg.member !== msg.guild.owner // guild owner exempt from all whitelist restrictions
	)
		return "Commands cannot be used outside whitelisted channels.";
	else return false;
});

// Disallow users from re-executing the membership command if they're already members
client.dispatcher.addInhibitor((msg: CommandoMessage): false | string | Inhibition => {
	if (
		msg.channel.type === "text" && // in a guild
		msg.content === "cardboard" && // user entered secret phrase
		msg.member.roles.highest.position > 0 // but they're already a member
	)
		return "User is already a member.";
	else return false;
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
// .on("guildMemberAdd", (member: GuildMember) => {
// 	const welcomeChannel = member.guild.channels.cache.find(
// 		(channel) => channel.name === welcomeChannelName
// 	);
// 	//if (welcomeChannel) send a welcome message!
// });

client.registry
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands({ unknownCommand: false })
	.registerGroups([
		{ id: "information", name: "Information" },
		{ id: "main", name: "Main" },
		{ id: "music", name: "Music" },
		{ id: "math", name: "Math" },
		{ id: "mod", name: "Mod", guarded: true }, // protects against disabling
		{ id: "misc", name: "Miscellaneous" }
	])
	// https://github.com/discordjs/Commando/issues/268#issuecomment-574629535
	// "require-all" is internally used by Commando, but by default only requires files with the extensions ".js" or ".json".
	// This custom regex filter makes it accept the TypeScript files too.
	// This allows you to not have to manually build the application every time on dev, so you can still use nodemon.
	.registerCommandsIn({
		filter: /^([^.].*)\.(js|ts)$/,
		dirname: path.join(__dirname, "commands")
	});

client.setProvider(
	open({
		filename: "./settings.db",
		driver: sqlite3.Database
	}).then((db) => new SQLiteProvider(db))
);

client.login(process.env.BOT_TOKEN);

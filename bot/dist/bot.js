"use strict";
// TODO:
// Collect server statistics for admins such as total messages sent
// Play music
// Use a database and store a list of notes for users
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production")
    require("dotenv").config({ path: "./config/.env" }); // starts at root, not current (/src) directory
const discord_js_commando_1 = require("discord.js-commando");
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const prefix = "!";
//const welcomeChannelName = "general";
const client = new discord_js_commando_1.CommandoClient({
    commandPrefix: prefix,
    owner: process.env.BOT_OWNER_ID,
    invite: "https://discord.gg/ZfJGpMU"
});
// Whitelist certain channels and channel categories; the bot can only be used in these places
client.dispatcher.addInhibitor((msg) => {
    var _a, _b;
    if (msg.channel.type === "text" && // only applies to Guild channels
        ((_a = msg.channel.parent) === null || _a === void 0 ? void 0 : _a.name) !== "Commander" && // contains all the channels used for executing commands
        ((_b = msg.channel.parent) === null || _b === void 0 ? void 0 : _b.name) !== "Entrance" && // used to display the command warning rather than ignore the user
        !msg.member.roles.cache.find((role) => role.name === "Admin") && // admins exempt from all whitelist restrictions
        msg.member !== msg.guild.owner // guild owner exempt from all whitelist restrictions
    )
        return "Commands cannot be used outside whitelisted channels.";
    else
        return false;
});
// Disallow users from re-executing the membership command if they're already members
client.dispatcher.addInhibitor((msg) => {
    if (msg.channel.type === "text" && // in a guild
        msg.content === "cardboard" && // user entered secret phrase
        msg.member.roles.highest.position > 0 // but they're already a member
    )
        return "User is already a member.";
    else
        return false;
});
client
    .on("error", console.error)
    .on("warn", console.warn)
    .on("debug", console.log)
    .once("ready", () => {
    var _a, _b, _c;
    console.log(`--- Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}! ${(_b = client.user) === null || _b === void 0 ? void 0 : _b.id} ---`);
    (_c = client.user) === null || _c === void 0 ? void 0 : _c.setActivity("with Discord.js and Commando");
})
    .on("disconnect", () => {
    console.warn("Disconnected!");
})
    .on("reconnecting", () => {
    console.warn("Reconnecting...");
})
    .on("commandError", (cmd, err) => {
    if (err instanceof discord_js_commando_1.FriendlyError)
        return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
})
    .on("commandBlocked", (message, reason) => {
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
    { id: "mod", name: "Mod", guarded: true },
    { id: "misc", name: "Miscellaneous" }
])
    // https://github.com/discordjs/Commando/issues/268#issuecomment-574629535
    // "require-all" is internally used by Commando, but by default only requires files with the extensions ".js" or ".json".
    // This custom regex filter makes it accept the TypeScript files too.
    // This allows you to not have to manually build the application every time on dev, so you can still use nodemon.
    .registerCommandsIn({
    filter: /^([^.].*)\.(js|ts)$/,
    dirname: path_1.default.join(__dirname, "commands")
});
client.setProvider(sqlite_1.open({
    filename: "./settings.db",
    driver: sqlite3_1.default.Database
}).then((db) => new discord_js_commando_1.SQLiteProvider(db)));
client.login(process.env.BOT_TOKEN);

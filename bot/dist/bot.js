"use strict";
// TODO:
// Collect server statistics for admins such as total messages sent
// Display information on particular users
// Play music
// Use a MongoDB database (create another shard or whatever on my one account) and store a list of notes for users
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config/.env" }); // starts at root, not current (/src) directory
const token = process.env.BOT_TOKEN;
// const botID = process.env.BOT_ID;
// import Discord from "discord.js";
const discord_js_commando_1 = require("discord.js-commando");
const path_1 = __importDefault(require("path"));
// import ms from "ms";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// dayjs.extend(customParseFormat);
const prefix = "!";
// let ownerPrefix = "//";
// let adminRole = "Admin";
// let memberRole = "Member";
// let muteRole = "Mute";
const welcomeChannel = "general";
const client = new discord_js_commando_1.CommandoClient({
    commandPrefix: prefix,
    owner: process.env.BOT_OWNER_ID,
    invite: "https://discord.gg/ZfJGpMU"
});
// import rolesAreHigher from "./lib/rolesAreHigher";
// import memberChecks from "./lib/memberChecks";
// import subarrayToString from "./lib/subarrayToString";
// import { getUserFromMention, getMemberFromMention } from "./lib/getFromMention";
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
client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.cache.get(welcomeChannel);
    if (channel) {
    }
});
client.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({ unknownCommand: false })
    .registerGroups([
    ["information", "Information"],
    ["main", "Main"],
    ["music", "Music"],
    ["mod", "Mod"]
    // { id: "information", name: "Information" },
    // { id: "main", name: "Main" },
    // { id: "music", name: "Music" },
    // { id: "mod", name: "Mod", guarded: true }
])
    .registerCommandsIn(path_1.default.join(__dirname, "commands"));
console.log(client.registry.commandsPath);
console.log(client.registry.groups.keys());
console.log(client.registry.commands.keys());
client.login(token);

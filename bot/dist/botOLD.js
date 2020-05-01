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
const botID = process.env.BOT_ID;
const discord_js_1 = __importDefault(require("discord.js"));
const discord_js_commando_1 = require("discord.js-commando");
const path_1 = __importDefault(require("path"));
const ms_1 = __importDefault(require("ms"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.extend(customParseFormat_1.default);
let prefix = "!";
let ownerPrefix = "//";
let adminRole = "Admin";
let memberRole = "Member";
let muteRole = "Mute";
let welcomeChannel = "general";
const client = new discord_js_commando_1.CommandoClient({
    commandPrefix: prefix,
    owner: process.env.BOT_OWNER_ID,
    invite: "https://discord.gg/ZfJGpMU"
});
const memberChecks_1 = __importDefault(require("./lib/memberChecks"));
const subarrayToString_1 = __importDefault(require("./lib/subarrayToString"));
const getFromMention_1 = require("./lib/getFromMention");
// class CustomClient extends Discord.Client {
// 	public commands = new Discord.Collection();
// 	public constructor(options?: Discord.ClientOptions | undefined) {
// 		super(options);
// 	}
// }
//const client = new CustomClient({ disableMentions: "everyone" });
// const isChannel = (msg: Discord.Message, channelName: string): boolean => {
// 	if (msg.channel instanceof Discord.DMChannel || msg.channel instanceof Discord.NewsChannel)
// 		return false;
// 	return msg.channel.name === channelName;
// };
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
// Note: In a msg like "  !test  ", Discord automatically removes all unnecessary whitespace, leaving only "!test"
client.on("message", (message) => {
    var _a, _b, _c, _d;
    if (message.author.bot)
        return; // return if the message was sent by a bot
    const args = message.content.match(/\S+/g) || []; // get rid of all whitespace and just make an array of the words
    // Only act if the message is in a server
    if (message.channel instanceof discord_js_1.default.TextChannel && message.content.startsWith(prefix)) {
        const command = args.shift().slice(prefix.length); // ! is a non-null assertion. remove prefix and keep the command
        // prettier-ignore
        process.stdout.write(// used over console.log() to not print a trailing newline
        "\n" +
            `Command incoming! => ${command}\n` +
            `       With args:    `);
        console.log(args);
        /*
        // --- Non-Privileged Commands ---
        */
        if (command === "test") {
            console.log("test");
        }
        // Test bot connectivity. Ping, pong!
        // else if (command === "ping") {
        // 	message.reply("pong!");
        // }
        // Send the member a DM with all the commands that Commander accepts
        // else if (command.match(/^(commands|help)$/)) {
        // 	message.author
        // 		.createDM()
        // 		.then((memberDM: Discord.DMChannel) => {
        // 			memberDM.send(
        // 				"__Commander accepts the following commands__:\n!ping\n!commands (the one you just used :smiley:)\n!repeat\n!server\n!kick\n!ban"
        // 			);
        // 		})
        // 		.catch(() => {
        // 			message.reply(
        // 				"I'm unable to DM you! Please make sure your settings allow me to message you."
        // 			);
        // 		});
        // }
        // Print information about the server
        // else if (command === "server") {
        // 	message.channel.send(
        // 		`Server name: ${message.guild?.name}\n` +
        // 			`Server description: ${message.guild?.description || ""}\n` +
        // 			`Date created: ${dayjs(message.guild?.createdAt).format(
        // 				"MM/DD/YYYY, hh:mm:ss"
        // 			)}\n` +
        // 			`Total members: ${message.guild?.memberCount}\n` +
        // 			`Server owner: ${message.guild?.owner?.user.tag}\n`,
        // 		{
        // 			files: [
        // 				`${message.guild?.iconURL({ size: 512, format: "png", dynamic: true })}`
        // 			]
        // 		}
        // 	);
        // }
        // Print information about a user
        // else if (command === "info") {
        // 	let user: Discord.User | undefined = message.author;
        // 	if (args[0]) {
        // 		user = getUserFromMention(args[0], client);
        // 		if (!user) return message.reply("please use a proper user mention.");
        // 	}
        // 	message.channel.send(
        // 		`User tag: ${user.tag}\n` +
        // 			`Account created on: ${dayjs(user.createdAt).format(
        // 				"M/DD/YYYY, h:mm:ss A Z"
        // 			)}\n` +
        // 			`User ID: ${user.id}\n` +
        // 			`Bot: ${user.bot}`,
        // 		{
        // 			files: [`${user.displayAvatarURL({ size: 256, format: "png", dynamic: true })}`]
        // 		}
        // 	);
        // }
        // Compare two dates
        else if (command === "timeUntil") {
            const dateInput = subarrayToString_1.default(args, 0);
            if (!dateInput)
                return message.reply("please provide a full date in the following format: 1/01/2020 1:01:01 PM");
            const now = dayjs_1.default();
            const future = dayjs_1.default(dateInput, "M/DD/YYYY h:mm:ss A");
            if (!future.isValid())
                return message.reply("please provide a full date in the following format: 1/01/2020 1:01:01 PM");
            let difference = future.diff(now, "second"); // seconds of difference
            // Math.trunc(x: number) returns an integer
            const years = Math.trunc(difference / 31540000); // seconds in year
            difference = difference % 31540000;
            const months = Math.trunc(difference / 2628000); // seconds in month
            difference = difference % 2628000;
            const days = Math.trunc(difference / 86400); // seconds in day
            difference = difference % 86400;
            const hours = Math.trunc(difference / 3600); // seconds in hour
            difference = difference % 3600;
            const minutes = Math.trunc(difference / 60); // seconds in minute
            difference = difference % 60;
            const seconds = difference; // remaining seconds
            message.channel.send(`${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`);
        }
        // Have Commander repeat the member's message
        else if (command === "repeat") {
            message.channel.send(subarrayToString_1.default(args, 0));
        }
        /*
        // --- Commands that require certain permissions ---
        */
        // Kick a member with an optional reason
        else if (command === "kick") {
            // Can't kick if you don't have the KICK_MEMBERS role permission
            if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.hasPermission("KICK_MEMBERS")))
                return message.channel.send("Insufficient permissions");
            // Must mention a user to kick
            if (!args[0])
                return message.reply("please mention the user to kick.");
            const memberToKick = getFromMention_1.getMemberFromMention(args[0], message.guild);
            // Check if member was found
            if (!memberToKick)
                return message.reply("please mention the user to kick as the first argument.");
            // Check if the request is valid
            if (!memberChecks_1.default(message, memberToKick, command))
                return;
            const reason = subarrayToString_1.default(args, 1); // everything after the memberToKick
            // DM the member
            memberToKick
                .createDM()
                .then((memberDM) => {
                var _a;
                memberDM
                    .send(`You have been kicked from ${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.name} :frowning:` +
                    `${reason && `\nReason: ${reason}`}`)
                    .catch((error) => console.error(error));
            })
                .catch((error) => console.error(error));
            // Kick the member
            memberToKick
                .kick(reason)
                .then((kickedMember) => {
                // Show the kick message in the guild
                message.channel.send(`:wave_tone1: ${kickedMember.user.tag} has been kicked!${reason &&
                    `\nReason: ${reason}`}`);
            })
                .catch((error) => {
                message.channel.send(`:question: Cannot kick ${memberToKick.user.tag}`);
                console.error(error);
            });
        }
        // Mute a member with an optional reason
        else if (command === "mute") {
            // Can't Mute if you don't have the MUTE_MEMBERS permission
            if (!((_b = message.member) === null || _b === void 0 ? void 0 : _b.hasPermission("MUTE_MEMBERS")))
                return message.channel.send("Insufficient permissions");
            // Must mention a user to mute
            if (!args[0])
                return message.reply("please mention the user to mute.");
            const memberToMute = getFromMention_1.getMemberFromMention(args[0], message.guild);
            // Check if member was found
            if (!memberToMute)
                return message.reply("please mention the user to mute as the first argument.");
            // Check if the request is valid
            if (!memberChecks_1.default(message, memberToMute, command))
                return;
            let time = "5m"; // default mute time
            let reason;
            if (args.length >= 2 && typeof ms_1.default(args[1]) === "number") {
                time = args[1]; // if a time is specified
                reason = subarrayToString_1.default(args, 2); // everything after the time
            }
            else
                reason = subarrayToString_1.default(args, 1); // everthing after the memberToMute
            // Remove the Member role
            memberToMute.roles.remove(memberRole, reason).catch((error) => {
                message.channel.send(`:question: Unable to remove role "${memberRole}" from ${memberToMute.user.tag}`);
                console.error(error);
            });
            // Assign the Muted role
            memberToMute.roles
                .add(muteRole, reason)
                .then((mutedMember) => {
                // Show the mute message in the guild
                message.channel.send(`:shushing_face: ${mutedMember.user.tag} has been muted for ${ms_1.default(ms_1.default(time), {
                    long: true
                })}.` + `${reason && `\nReason: ${reason}`}`);
            })
                .catch((error) => {
                message.channel.send(`:question: Cannot mute ${memberToMute.user.tag} using role "${muteRole}"`);
                console.error(error);
            });
            // Wait the time, then unmute the member
            setTimeout(() => {
                memberToMute.roles.add(memberRole).catch((error) => {
                    message.reply(`:question: Unable to add role "${memberRole}" back to ${memberToMute.user.tag}`);
                    console.error(error);
                });
                memberToMute.roles.remove(muteRole).catch((error) => {
                    message.reply(`:question: Unable to remove role "${muteRole}" from ${memberToMute.user.tag}`);
                    console.error(error);
                });
            }, ms_1.default(time));
        }
        // Ban a member with an optional reason
        else if (command === "ban") {
            if (!((_c = message.member) === null || _c === void 0 ? void 0 : _c.hasPermission("BAN_MEMBERS")))
                return message.channel.send("Insufficient permissions");
            // ...
        }
        // Remove a number of messages from chat
        else if (command.match(/^(clear|delete|remove|prune|del|rm)$/)) {
            if (!((_d = message.member) === null || _d === void 0 ? void 0 : _d.hasPermission("MANAGE_MESSAGES")))
                return message.channel.send("Insufficient permissions");
            const amount = parseInt(args[0], 10) + 1;
            if (isNaN(amount))
                return message.reply("you must provide a number.");
            if (amount < 1 || amount > 99)
                return message
                    .reply("I can only delete 1-99 messages from the past two weeks.")
                    .then((replyMessage) => {
                    replyMessage.delete({ timeout: 2000 }).catch(() => {
                        console.error("Attempted to delete message that was already deleted");
                    });
                });
            message.channel
                .bulkDelete(amount, true)
                .then(async () => {
                try {
                    const sentMessage = await message.channel.send(`:white_check_mark: ${amount - 1} messages have been deleted`);
                    sentMessage.delete({ timeout: 2000 });
                }
                catch (error) {
                    console.error("Attempted to deleted message that was already deleted.");
                }
            })
                .catch((error) => {
                // only throws an error when there are no messages less than two weeks old
                message.channel.send("I cannot delete messages older than two weeks :(");
                console.error(error);
            });
        }
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
    .registerCommandsIn(path_1.default.join(__dirname, "commands"));
client.login(token);

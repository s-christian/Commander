"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomCommand_1 = __importDefault(require("../../lib/CustomCommand"));
const discord_js_1 = require("discord.js");
const userHelpers_1 = require("../../util/userHelpers");
class InfoCommand extends CustomCommand_1.default {
    constructor(client) {
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
    async run(message, mentionOrID) {
        var _a;
        let userID;
        let member;
        let user;
        const infoEmbed = new discord_js_1.MessageEmbed();
        // get ID from arg
        if (mentionOrID)
            userID = userHelpers_1.getUserIDFromArg(mentionOrID);
        // Guild Channel
        if (message.channel.type === "text") {
            // arg provided
            if (userID) {
                member = await userHelpers_1.fetchMemberFromID(userID, message.guild.members);
                // If the specified user is not in the guild
                if (!member) {
                    const userResponse = await userHelpers_1.fetchUserFromID(userID, this.client.users);
                    if (userResponse)
                        user = userResponse;
                    else
                        return message.reply("I can't find that user.");
                }
                else
                    user = member.user;
            }
            // no arg provided
            else {
                member = message.member;
                user = message.author;
            }
            const commanderAvatar = this.client.user.displayAvatarURL({
                size: 128,
                format: "png"
            });
            const userAvatar = user.displayAvatarURL({ size: 512, format: "png", dynamic: true });
            const userAgeMs = Date.now() - user.createdAt.getTime();
            const userAgeServerMs = member && member.joinedAt ? Date.now() - member.joinedAt.getTime() : undefined;
            const userAgeDays = Math.floor(userAgeMs / 86400000); // milliseconds in 1 day
            const userAgeServerDays = userAgeServerMs
                ? Math.floor(userAgeServerMs / 86400000)
                : undefined;
            const presenceStatus = user.presence.status;
            const formattedPresenceStatus = presenceStatus !== "dnd"
                ? presenceStatus[0].toUpperCase() + presenceStatus.slice(1)
                : "Do Not Disturb";
            // Build the embed
            infoEmbed
                .setAuthor(this.client.user.username, commanderAvatar)
                .setThumbnail(userAvatar)
                .setTimestamp()
                .setColor(member ? "BLUE" : "RED")
                .setTitle(user.tag)
                .setDescription(`(ID: ${user.id})`)
                .addField("Username", member ? user.username : `<@${user.id}>`, !!member);
            if (member)
                infoEmbed
                    .addField("Nickname", member.nickname || "*None*", true)
                    .addField("Roles", member.roles.cache
                    .map((role) => `<@&${role.id}>`)
                    .slice(0, -1)
                    .join(", ") || "*None*")
                    .addField("Join Date", (_a = member.joinedAt) === null || _a === void 0 ? void 0 : _a.toLocaleString(), true)
                    .addField("Time in Server", `${userAgeServerDays} day(s)`, true)
                    .addField("\u200b", "\u200b");
            infoEmbed
                .addField("Account Creation Date", user.createdAt.toLocaleString(), true)
                .addField("Account Age", `${userAgeDays} day(s)`, true)
                .addField("Bot Account", user.bot, true)
                .addField("Status", member ? `<@${user.id}> • ${formattedPresenceStatus}` : "Unknown", true);
            if (!member)
                infoEmbed.setFooter("User is not in this guild");
        }
        // DM Channel
        else {
            // arg provided
            if (userID) {
                const userResponse = await userHelpers_1.fetchUserFromID(userID, this.client.users);
                if (userResponse)
                    user = userResponse;
                else
                    return message.reply("I can't find that user.");
            }
            // no arg provided
            else {
                user = message.author;
            }
            const commanderAvatar = this.client.user.displayAvatarURL({
                size: 128,
                format: "png"
            });
            const userAvatar = user.displayAvatarURL({ size: 512, format: "png", dynamic: true });
            const timeAliveMs = Date.now() - user.createdAt.getTime();
            const timeAliveDays = Math.floor(timeAliveMs / 86400000); // milliseconds in 1 day
            // Build the embed
            infoEmbed
                .setAuthor(this.client.user.username, commanderAvatar)
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
exports.default = InfoCommand;

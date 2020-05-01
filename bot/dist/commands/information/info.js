"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const common_tags_1 = require("common-tags");
const dayjs_1 = __importDefault(require("dayjs"));
class InfoCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "info",
            aliases: ["user-info"],
            group: "information",
            memberName: "user-info",
            description: "Gets information about yourself or another user.",
            examples: ["info", "info @Christian1#1493"],
            throttling: {
                usages: 1,
                duration: 5
            },
            args: [
                {
                    key: "member",
                    prompt: "Who would you like information on?",
                    type: "member"
                }
            ]
        });
    }
    // "message" and "args" are passed, so we can destructure args
    run(message, { member }) {
        const user = member.user;
        return message.say(common_tags_1.stripIndents `
			Info on **${user.tag}** (ID: ${user.id})

			**❯ Member Details**
			${member.nickname !== null ? ` • Nickname: ${member.nickname}` : " • No nickname"}
			• Roles: ${member.roles.cache.map((roles) => `\`${roles.name}\``).join(", ")}
			• Joined at: ${member.joinedAt}

			**❯ User Details**
			• Created at: ${dayjs_1.default(user.createdAt).format("MM/DD/YYYY, h:mm:ss A Z")}
			${user.bot ? "• Is a bot account" : ""}• Status: ${user.presence.status}
		`, {
            files: [`${user.displayAvatarURL({ size: 512, format: "png", dynamic: true })}`]
        });
    }
}
exports.default = InfoCommand;

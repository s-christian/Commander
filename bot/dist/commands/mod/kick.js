"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const common_tags_1 = require("common-tags");
class KickCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "kick",
            group: "mod",
            memberName: "kick",
            description: "Kicks a user from the guild.",
            guildOnly: true,
            userPermissions: ["KICK_MEMBERS"],
            clientPermissions: ["KICK_MEMBERS"],
            //argsType: "multiple", // only works if 'args' is not specified
            //argsCount: 2, // only applicable if 'argsType' is 'multiple'
            args: [
                {
                    key: "member",
                    type: "member",
                    prompt: "Please mention a member to kick, and optionally provide a reason.",
                    error: "I can't find that member!"
                },
                {
                    key: "reason",
                    type: "string",
                    prompt: "",
                    default: ""
                }
            ],
            guarded: true
        });
    }
    async run(message, { member, reason }) {
        return await message.reply(common_tags_1.stripIndents `
			The ${this.name} command works!
			Member ID: ${member.id}
			Reason: ${reason}
		`);
    }
}
exports.default = KickCommand;

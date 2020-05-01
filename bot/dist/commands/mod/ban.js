"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const common_tags_1 = require("common-tags");
class BanCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "ban",
            group: "mod",
            memberName: "ban",
            description: "Bans a user from the guild.",
            guildOnly: true,
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"],
            //argsType: "multiple", // only works if 'args' is not specified
            //argsCount: 2, // only applicable if 'argsType' is 'multiple' // unsure if this will give me the first two strings separated by whitespace, or the first string plus all the rest (which is what I want)
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
            guarded: true // prevents this command from disabling
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
exports.default = BanCommand;

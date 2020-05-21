"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomCommand_1 = __importDefault(require("../../lib/CustomCommand"));
const common_tags_1 = require("common-tags");
const userHelpers_1 = require("../../util/userHelpers");
const memberChecks_1 = __importDefault(require("../../util/memberChecks"));
class BanCommand extends CustomCommand_1.default {
    constructor(client) {
        super(client, {
            name: "ban",
            group: "mod",
            memberName: "ban",
            description: "Bans a user from the guild.",
            examples: ["!ban [user] [reason?]", "!ban @mention", "!ban id Spamming"],
            guildOnly: true,
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"],
            guarded: true,
            argsType: "multiple",
            argsCount: 2 // only applicable if 'argsType' is 'multiple'
        });
    }
    async run(message, args) {
        var _a;
        if (!args.length)
            return message.reply("please provide a member to ban. This can be a mention or a user ID.");
        const id = userHelpers_1.getUserIDFromArg(args[0]);
        const memberToBan = await userHelpers_1.fetchMemberFromID(id, message.guild.members);
        if (!memberToBan)
            return message.reply("I can't find that member! Please provide a valid mention or ID for a user currently in this guild.");
        // Check if the request is valid
        const invalidMessage = memberChecks_1.default(message, memberToBan, this.name);
        if (invalidMessage)
            return message.say(invalidMessage);
        let reason;
        if (args.length === 2)
            reason = args[1];
        // DM the member
        try {
            const dm = await memberToBan.createDM();
            await dm.send(common_tags_1.stripIndents `
				You have been banned from **${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.name}** :frowning:
				Reason: ${reason}
			`);
        }
        catch (error) {
            console.error("Cannot create DM channel for banned user");
        }
        // Ban the member
        try {
            const bannedMember = await memberToBan.ban({ days: 7, reason });
            return message.say(common_tags_1.stripIndents `
				:wave_tone1: **${bannedMember.user.tag}** (ID: ${bannedMember.id}) has been banned!
				Reason: ${reason}
			`);
        }
        catch (error) {
            console.error(error);
            return message.say(`:question: Cannot ban **${memberToBan.user.tag}** (ID: ${memberToBan.id})`);
        }
    }
}
exports.default = BanCommand;

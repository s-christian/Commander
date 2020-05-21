"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomCommand_1 = __importDefault(require("../../lib/CustomCommand"));
const common_tags_1 = require("common-tags");
const userHelpers_1 = require("../../util/userHelpers");
const memberChecks_1 = __importDefault(require("../../util/memberChecks"));
class KickCommand extends CustomCommand_1.default {
    constructor(client) {
        super(client, {
            name: "kick",
            group: "mod",
            memberName: "kick",
            description: "Kicks a member from the guild.",
            examples: [
                "!kick [member] [reason?]",
                "!kick @mention They called me stupid :(",
                "!kick id"
            ],
            guildOnly: true,
            userPermissions: ["KICK_MEMBERS"],
            clientPermissions: ["KICK_MEMBERS"],
            guarded: true,
            argsType: "multiple",
            argsCount: 2 // only applicable if 'argsType' is 'multiple'
        });
    }
    async run(message, args) {
        var _a;
        if (!args.length)
            return message.reply("please provide a member to kick. This can be a mention or a user ID.");
        const id = userHelpers_1.getUserIDFromArg(args[0]);
        const memberToKick = await userHelpers_1.fetchMemberFromID(id, message.guild.members);
        if (!memberToKick)
            return message.reply("I can't find that member! Please provide a valid mention or ID for a user currently in this guild.");
        // Check if the request is valid
        const invalidMessage = memberChecks_1.default(message, memberToKick, this.name);
        if (invalidMessage)
            return message.say(invalidMessage);
        let reason;
        if (args.length === 2)
            reason = args[1];
        // DM the member
        try {
            const dm = await memberToKick.createDM();
            await dm.send(common_tags_1.stripIndents `
				You have been kicked from **${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.name}** :frowning:
				Reason: ${reason}
			`);
        }
        catch (error) {
            console.error("Cannot create DM channel for kicked user");
        }
        // Kick the member
        try {
            const kickedMember = await memberToKick.kick(reason);
            return message.say(common_tags_1.stripIndents `
				:boot: **${kickedMember.user.tag}** (ID: ${kickedMember.id}) has been kicked!
				Reason: ${reason}
			`);
        }
        catch (error) {
            console.error(error);
            return message.say(`:question: Cannot kick **${memberToKick.user.tag}** (ID: ${memberToKick.id})`);
        }
    }
}
exports.default = KickCommand;

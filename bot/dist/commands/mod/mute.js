"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomCommand_1 = __importDefault(require("../../lib/CustomCommand"));
const ms_1 = __importDefault(require("ms"));
const common_tags_1 = require("common-tags");
const userHelpers_1 = require("../../util/userHelpers");
const memberChecks_1 = __importDefault(require("../../util/memberChecks"));
class MuteCommand extends CustomCommand_1.default {
    constructor(client) {
        super(client, {
            name: "mute",
            group: "mod",
            memberName: "mute",
            description: "Mutes a guild member for a default of five minutes, or a user-specified period of time.",
            examples: [
                "!mute [member] [time? = 5m] [reason?]",
                "!mute @mention",
                "!mute id 15m",
                "!mute @mention 2hours Bad memes"
            ],
            guildOnly: true,
            userPermissions: ["MUTE_MEMBERS"],
            clientPermissions: ["MUTE_MEMBERS"],
            guarded: true,
            argsType: "multiple",
            argsCount: 3 // only applicable if 'argsType' is 'multiple'
        });
    }
    async run(message, args) {
        if (!args.length)
            return message.reply("please provide a member to mute. This can be a mention or a user ID.");
        const id = userHelpers_1.getUserIDFromArg(args[0]);
        const memberToMute = await userHelpers_1.fetchMemberFromID(id, message.guild.members);
        if (!memberToMute)
            return message.reply("I can't find that member! Please provide a valid mention or ID for a user currently in this guild.");
        // Check if the request is valid
        const invalidMessage = memberChecks_1.default(message, memberToMute, this.name);
        if (invalidMessage)
            return message.say(invalidMessage);
        // Get Roles
        const muteRoleName = "Muted";
        const memberRoleName = "Member";
        const muteRole = message.guild.roles.cache.find((role) => role.name === muteRoleName);
        const memberRole = message.guild.roles.cache.find((role) => role.name === memberRoleName);
        if (!muteRole)
            return message.say(`:question: Cannot find a mute role with the name ${muteRoleName}`);
        if (!memberRole)
            return message.say(`:question: Cannot find a member role with the name ${memberRoleName}`);
        // Check if the member is already muted
        if (memberToMute.roles.cache.has(muteRole.id))
            return message.reply(`**${memberToMute.displayName}** (ID: ${memberToMute.id}) is already muted!`);
        // [member, time, reason]
        let time = ms_1.default("5m");
        if (args.length > 1)
            time = ms_1.default(args[1]);
        if (!time)
            return message.reply("incorrect time specified. Refer to `!help mute` for more information.");
        if (time > ms_1.default("24h"))
            return message.reply("the maximum mute time is 24 hours.");
        let reason;
        if (args.length === 3)
            reason = args[2];
        // Mute the member
        try {
            const mutedMember = await memberToMute.roles.add(muteRole, reason);
            mutedMember.roles.remove(memberRole);
            // Wait the time, then add their roles back
            setTimeout(async () => {
                try {
                    await mutedMember.roles.add(memberRole, `mute time is up : ${reason}`);
                    await mutedMember.roles.remove(muteRole, `mute time is up : ${reason}`);
                }
                catch (error) {
                    console.log("Tried to add/remove a role that already/doesn't exist(s)");
                    console.log(error);
                }
            }, time);
            // prettier-ignore
            return message.say(common_tags_1.stripIndents `
				:shushing_face: **${mutedMember.user.tag}** (ID: ${mutedMember.id}) has been muted for ${ms_1.default(time, { long: true })}.
				Reason: ${reason}
			`);
        }
        catch (error) {
            console.error(error);
            return message.say(`:question: Cannot mute ${memberToMute.user.tag}`);
        }
    }
}
exports.default = MuteCommand;

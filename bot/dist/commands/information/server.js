"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomCommand_1 = __importDefault(require("../../lib/CustomCommand"));
const discord_js_1 = require("discord.js");
class ServerCommand extends CustomCommand_1.default {
    constructor(client) {
        super(client, {
            name: "server",
            aliases: ["server-info", "guild", "guild-info"],
            group: "information",
            memberName: "server-info",
            description: "Get information about the server.",
            examples: ["!server [publicServerID?]", "!server", "!server id"],
            clientPermissions: ["MANAGE_GUILD"],
            throttling: {
                usages: 1,
                duration: 5
            },
            argsType: "single"
        });
    }
    async run(message, guildID) {
        var _a;
        let guild;
        if (guildID) {
            try {
                guild = await this.client.fetchGuildPreview(guildID);
            }
            catch (error) {
                guild = undefined;
            }
            if (!guild)
                return message.say("Either the guild you are searching for is not public, or you did not provide a valid guild ID.");
        }
        else {
            if (message.channel.type === "dm")
                return message.say("You must either provide a guild ID, or use this command within a guild.");
            guild = message.guild;
        }
        const commanderAvatar = this.client.user.displayAvatarURL({ size: 128, format: "png" });
        const guildImage = guild.iconURL({ size: 1024, format: "png", dynamic: true }) || undefined;
        // Base embed, same information for both a Guild and GuildPreview
        const serverInfoEmbed = new discord_js_1.MessageEmbed()
            .setAuthor(this.client.user.username, commanderAvatar)
            .setTimestamp()
            .setTitle(guild.name)
            .setDescription(`(ID: ${guild.id})`)
            .addField("Description", guild.description || "*None*");
        if (guildImage)
            serverInfoEmbed.setThumbnail(guildImage);
        // GuildPreview information
        if (guild instanceof discord_js_1.GuildPreview) {
            serverInfoEmbed
                .setColor("PURPLE")
                .addField("Online Members", guild.approximatePresenceCount, true)
                .addField("Total Members", guild.approximateMemberCount, true)
                .addField("Number of Emojis", guild.emojis.size)
                .setFooter("Guild preview");
        }
        // Full Guild information
        else {
            const serverAgeMs = Date.now() - guild.createdAt.getTime();
            const serverAgeDays = Math.floor(serverAgeMs / 86400000);
            const region = guild.region.split("-");
            // "us-east" => "US East"
            const formattedRegion = region[0].toUpperCase() + " " + region[1][0].toUpperCase() + region[1].slice(1);
            serverInfoEmbed
                .setColor("GREEN")
                .addField("Online Members", guild.presences.cache.filter((p) => p.status === "online").size, true)
                .addField("Total Members", guild.memberCount, true)
                .addField("Members in VC", guild.voiceStates.cache.size, true)
                .addField("Number of Roles", guild.roles.cache.size)
                .addField("Guild Creation Date", guild.createdAt.toLocaleString(), true)
                .addField("Server Age", `${serverAgeDays} day(s)`, true)
                .addField("Region", formattedRegion, true)
                .addField("Owner", `<@${(_a = guild.owner) === null || _a === void 0 ? void 0 : _a.id}>`);
        }
        return message.say(serverInfoEmbed);
    }
}
exports.default = ServerCommand;

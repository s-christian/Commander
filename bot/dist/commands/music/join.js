"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
class JoinCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "join",
            group: "music",
            memberName: "join",
            description: "Have the bot join your voice channel."
        });
    }
    async run(message) {
        var _a;
        const vc = message.guild.channels.cache.find((channel) => channel.id === message.channel.id && channel.type === "voice");
        // Make sure the channel exists, and that the bot isn't already connected to it
        if (vc && !((_a = this.client.voice) === null || _a === void 0 ? void 0 : _a.connections.get(vc.id)))
            return await message.say(`You're in a voice channel with id ${vc.id}`);
        return await message.say("You're not in any voice channel!");
    }
}
exports.default = JoinCommand;

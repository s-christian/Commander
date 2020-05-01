"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
class SayCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "say",
            aliases: ["repeat", "parrot"],
            group: "main",
            memberName: "say",
            description: "Like a mirror, but for your words.",
            args: [
                {
                    key: "text",
                    prompt: "Give me something to say!",
                    type: "string"
                }
            ]
        });
    }
    async run(message, { text }) {
        await message.reply(text);
        return message.delete();
    }
}
exports.default = SayCommand;

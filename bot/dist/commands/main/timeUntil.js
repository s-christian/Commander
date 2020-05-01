"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
class SayCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "timeUntil",
            group: "main",
            memberName: "timeUntil",
            description: "Print the exact amount of time between two dates.",
            argsType: "single",
            args: [
                {
                    key: "text",
                    prompt: "please provide a full date in the following format: 1/01/2020 1:01:01 PM",
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

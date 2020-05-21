"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomCommand_1 = __importDefault(require("../../lib/CustomCommand"));
class SayCommand extends CustomCommand_1.default {
    constructor(client) {
        super(client, {
            name: "say",
            aliases: ["echo", "repeat", "parrot"],
            group: "main",
            memberName: "say",
            description: "Like a mirror, but for your words.",
            examples: ["say hello", "echo AHHHHH", "repeat I, Commander, am stupid and ugly :("],
            argsType: "single",
            throttling: {
                duration: 10,
                usages: 2
            }
        });
    }
    async run(message, text) {
        var _a;
        if (!text)
            return message.reply(`${message.channel.type === "text" ? "g" : "G"}ive me something to say! See \`!help say\``);
        else if (/http[s]?:\/\//.test(text))
            return message.reply("I cannot say URLs.");
        if (message.channel.type === "text" && ((_a = message.guild.me) === null || _a === void 0 ? void 0 : _a.hasPermission("MANAGE_MESSAGES")))
            await message.delete();
        return message.reply(text);
    }
}
exports.default = SayCommand;

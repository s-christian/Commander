"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const dayjs_1 = __importDefault(require("dayjs"));
class ServerCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "server",
            aliases: ["server-info"],
            group: "information",
            memberName: "server-info",
            description: "Gets information about the server.",
            throttling: {
                usages: 1,
                duration: 5
            },
            guildOnly: true // the server command can only be used within guilds
        });
    }
    run(message) {
        var _a, _b, _c, _d, _e, _f, _g;
        return message.say(`Server name: ${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.name}\n` +
            `Server description: ${((_b = message.guild) === null || _b === void 0 ? void 0 : _b.description) || ""}\n` +
            `Date created: ${dayjs_1.default((_c = message.guild) === null || _c === void 0 ? void 0 : _c.createdAt).format("MM/DD/YYYY, hh:mm:ss")}\n` +
            `Total members: ${(_d = message.guild) === null || _d === void 0 ? void 0 : _d.memberCount}\n` +
            `Server owner: ${(_f = (_e = message.guild) === null || _e === void 0 ? void 0 : _e.owner) === null || _f === void 0 ? void 0 : _f.user.tag}\n`, {
            files: [`${(_g = message.guild) === null || _g === void 0 ? void 0 : _g.iconURL({ size: 1024, format: "png", dynamic: true })}`]
        });
    }
}
exports.default = ServerCommand;

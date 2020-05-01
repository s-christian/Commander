"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rolesAreHigher_1 = __importDefault(require("./rolesAreHigher"));
function memberChecks(msg, memberToActUpon, command) {
    // Can't act upon bots (including Commander)
    if (memberToActUpon.user.bot) {
        msg.channel.send(`:no_entry: You can't ${command} bots!`);
        return false;
    }
    // Can't act upon members higher than yourself
    if (!rolesAreHigher_1.default(msg.member, memberToActUpon)) {
        msg.channel.send(`:no_entry: You can only ${command} members lower than you!`);
        return false;
    }
    // Can't act upon me :)
    if (memberToActUpon.id === process.env.BOT_OWNER_ID) {
        msg.channel.send(`:no_entry: You can't ${command} my master!`);
        return false;
    }
    return true;
}
exports.default = memberChecks;

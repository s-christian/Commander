"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromMention = (mention, client) => {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);
    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches)
        return;
    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];
    return client.users.cache.get(id);
};
exports.getMemberFromMention = (mention, guild) => {
    // We must be provided with a guild in order to return a guild member
    if (!guild)
        return;
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);
    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches)
        return;
    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];
    return guild.members.cache.get(id);
};

"use strict";
// import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
// import { Message, MessageEmbed } from "discord.js";
// const streamOptions = {
// 	seek: 0,
// 	volume: 1
// };
// let musicQueue = [];
// export default class QueueCommand extends Command {
// 	constructor(client: CommandoClient) {
// 		super(client, {
// 			name: "queue",
// 			aliases: ["q"],
// 			group: "music",
// 			memberName: "queue",
// 			description: "Queue a song for the bot to play.",
// 			argsType: "single"
// 		});
// 	}
// 	async run(message: CommandoMessage, youtubeURL): Promise<Message | Message[]> {
// 		const embed = new MessageEmbed();
// 		if (musicQueue.some((link) => link === youtubeURL)) {
// 			embed.setDescription("Song is already in queue!");
// 		}
// 	}
// }

import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { messageAutodelete } from "../../util/messageHelpers";

export default class InviteCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "invite",
			group: "misc",
			memberName: "invite",
			description: "Invite Commander to your server.",
			examples: ["!invite"],
			throttling: {
				usages: 1,
				duration: 10
			}
		});
	}

	async run(message: CommandoMessage): Promise<Message | Message[]> {
		const inviteString = `__Follow this link to invite me to your server!__ - ${process.env.DISCORD_BOT_INVITE}`;
		if (message.channel.type === "dm") return message.say(inviteString);
		// if it's not already a DM, create a dm channel
		else {
			try {
				const dm = await message.member.createDM();
				dm.send(inviteString);
				const reply = await message.reply("check your DMs!");
				messageAutodelete(reply, 5000);
				return reply;
			} catch (error) {
				console.log(error);
				return message.reply("please enable DMs and try again.");
			}
		}
	}
}

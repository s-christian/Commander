import CustomCommand from "../../lib/CustomCommand";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import dayjs from "dayjs";

export default class SayCommand extends CustomCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: "timeuntil",
			aliases: ["time", "time-until"],
			group: "main",
			memberName: "timeuntil",
			description: "Print the exact amount of time between two dates.",
			examples: [
				"!timeuntil [date] [time? [AM or PM? = AM]]",
				"!timeuntil 1/02/2023 4:05:06 PM",
				"!time 12-25-20 12:00 PM",
				"!time-until 1 1 21",
				"!timeuntil 2021"
			],
			argsType: "single"
		});
	}

	async run(message: CommandoMessage, date: string): Promise<Message | Message[]> {
		if (!date)
			return message.reply(
				"you must provide a date. Please see `!help timeuntil` for proper usage."
			);

		const now = dayjs();
		const future = dayjs(date, "M/DD/YYYY h:mm:ss A");
		if (!future.isValid())
			return message.reply("invalid date. Please see `!help timeuntil` for proper usage.");

		let difference: number = future.diff(now, "second"); // seconds of difference
		// Math.trunc(x: number) functions as integer division
		const years = Math.trunc(difference / 31540000); // seconds in year
		difference = difference % 31540000;
		const months = Math.trunc(difference / 2628000); // seconds in month
		difference = difference % 2628000;
		const days = Math.trunc(difference / 86400); // seconds in day
		difference = difference % 86400;
		const hours = Math.trunc(difference / 3600); // seconds in hour
		difference = difference % 3600;
		const minutes = Math.trunc(difference / 60); // seconds in minute
		difference = difference % 60;
		const seconds = difference; // remaining seconds

		return message.say(
			`${years} year(s), ${months} month(s), ${days} day(s), ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s).`
		);
	}
}

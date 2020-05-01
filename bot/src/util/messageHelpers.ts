import { Message } from "discord.js";
import { isArray } from "util";

export const messageAutodelete = (msg: Message | Message[], time: number): void => {
	if (isArray(msg)) return;
	setTimeout(() => {
		if (msg.deletable) msg.delete();
	}, time);
};

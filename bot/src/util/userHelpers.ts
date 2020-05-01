import { UserManager, GuildMemberManager, User, GuildMember } from "discord.js";

export const getUserIDFromArg = (userArg: string): string => {
	// Check if the user provided a mention
	const matches = userArg.match(/^<@!?(\d+)>$/);

	// If it wasn't a mention, the user provided either an ID, or garbage
	if (!matches) return userArg;
	// It was a user mention, so extract the ID
	// The first element in the array is the entire mention, and the second is just the ID
	else return matches[1];
};

export const fetchUserFromID = async (
	id: string,
	users: UserManager
): Promise<User | undefined> => {
	// Check the cache first. Then, if the User hasn't been cached, directly call the Discord API to fetch the User data.
	try {
		return await users.fetch(id);
	} catch (error) {
		return undefined;
	}
};

// prettier-ignore
export const fetchMemberFromID = async (id: string, members: GuildMemberManager): Promise<GuildMember | undefined> => {
	// Check the cache first. Then, if the GuildMember hasn't been cached, directly call the Discord API to fetch the GuildMember data.
	try {
		return await members.fetch(id);
	} catch (error) {
		return undefined;
	}
};

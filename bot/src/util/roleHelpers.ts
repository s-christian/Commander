import { RoleManager, Role } from "discord.js";

export const getRoleIDFromArg = (userArg: string): string => {
	// Check if the user provided a mention
	const matches = userArg.match(/^<@&(\d+)>$/);

	// If it wasn't a mention, the user provided either an ID, or garbage
	if (!matches) return userArg;
	// It was a role mention, so extract the ID
	// The first element in the array is the entire mention, and the second is just the ID
	else return matches[1];
};

export const fetchRoleFromID = async (id: string, roles: RoleManager): Promise<Role | null> => {
	// Check the cache first. Then, if the User hasn't been cached, directly call the Discord API to fetch the User data.
	return await roles.fetch(id);
};

import { GuildMember } from "discord.js";

export default function rolesAreHigher(
	memberKicking: GuildMember | undefined | null,
	memberBeingKicked: GuildMember | undefined | null
): boolean {
	if (!memberKicking || !memberBeingKicked) return false;
	const roleCompNum: number = memberKicking.roles.highest.comparePositionTo(
		memberBeingKicked.roles.highest
	); // This number represents how many roles above the other it is. If roles are equal, it's 0. If first role is higher, it's >0. If second role is higher, it's <0.
	return roleCompNum > 0;
}

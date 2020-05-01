"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rolesAreHigher(memberKicking, memberBeingKicked) {
    if (!memberKicking || !memberBeingKicked)
        return false;
    const roleCompNum = memberKicking.roles.highest.comparePositionTo(memberBeingKicked.roles.highest); // This number represents how many roles above the other it is. If roles are equal, it's 0. If first role is higher, it's >0. If second role is higher, it's <0.
    return roleCompNum > 0;
}
exports.default = rolesAreHigher;

import { create } from "zustand";
const useUserRoles = create((set, get) => ({
    roles: JSON.parse(localStorage.getItem("user_roles") || "[]"),
    clearRoles: () => {
        set({ roles: [] });
        localStorage.removeItem("user_roles"); // Remove from localStorage
    },
    // Set roles and save them to localStorage
    setRoles: (roles = []) => {
        set({ roles });
        localStorage.setItem("user_roles", JSON.stringify(roles));
    },
    // Check if the user has any of the given permissions
    can: (permissions) => {
        const currentRoles = get().roles;
        return permissions.some((permission) => currentRoles.includes(permission));
    },
}));
export default useUserRoles;

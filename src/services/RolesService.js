import { APIClient } from "./Http";
export const RoleApiClient = new APIClient("/getRoles");
export const RoleNursesClient = new APIClient("/RolesNursesList");
export const getUsersWithRolesClient = new APIClient("/getUsersViaRoles");
export const DeleteRoleApiClient = new APIClient("/deleteRole");
export const AddRolesApiClient = new APIClient("/grantAccess");
export const CreateRoleApiClient = new APIClient("/createRole");
export const getRolespermissionsApiClient = new APIClient("/userPermissions");

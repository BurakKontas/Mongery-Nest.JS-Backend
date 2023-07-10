import { SetMetadata } from "@nestjs/common";
import { AuthRoles } from "../users/enums/AuthRoles";

export const Roles = (...roles: AuthRoles[]) => SetMetadata("roles", roles);

import { AuthRoles } from "../enums/AuthRoles";

export class User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    role: AuthRoles;
}

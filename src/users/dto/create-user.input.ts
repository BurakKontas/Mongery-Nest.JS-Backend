import { AuthRoles } from "../enums/AuthRoles";

export class CreateUserInput {
    name: string;
    email: string;
    password: string;
    role: AuthRoles;
}

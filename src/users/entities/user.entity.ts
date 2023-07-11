import { AuthRoles } from "../enums/AuthRoles";
import { Users } from "@prisma/client";

export class User {
    id?: number | undefined;
    name: string;
    email: string;
    passwordHash: string;
    role: AuthRoles;

    static fromPrisma(user: Users) {
        let temp = new User();
        temp.id = user.id;
        temp.name = user.name;
        temp.email = user.email;
        temp.passwordHash = user.passwordHash;
        temp.role = user.role as AuthRoles;

        return temp;
    }
}

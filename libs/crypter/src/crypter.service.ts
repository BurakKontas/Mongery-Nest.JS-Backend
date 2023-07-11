import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class CrypterService {
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    static async comparePassword(password: string, passwordHash: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, passwordHash);
        return isMatch;
    }
}

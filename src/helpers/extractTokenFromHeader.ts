import { BadRequestException } from "@nestjs/common";

export function ExtractTokenFromHeader(request: any): string | undefined {
    try {
        const authorization = request.headers.authorization;
        if (authorization && authorization.split(" ")[0] === "Bearer") {
            return authorization.split(" ")[1];
        }
        return undefined;
    } catch {
        throw new BadRequestException();
    }
}

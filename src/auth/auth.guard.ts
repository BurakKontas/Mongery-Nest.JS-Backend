import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext();
        const token = this.extractTokenFromHeader(req);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            req["user"] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
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
}

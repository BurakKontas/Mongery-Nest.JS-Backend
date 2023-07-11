import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { ExtractTokenFromHeader } from "src/helpers/extractTokenFromHeader";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext();
        const token = ExtractTokenFromHeader(req);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            req["user"] = payload;
        } catch (err) {
            throw new UnauthorizedException();
        }
        return true;
    }
}

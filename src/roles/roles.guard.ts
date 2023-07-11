import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthRoles } from "src/users/enums/AuthRoles";
import { JwtService } from "@nestjs/jwt";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ExtractTokenFromHeader } from "src/helpers/extractTokenFromHeader";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<AuthRoles[]>("roles", context.getHandler());
        if (!roles) {
            return true;
        }
        const gqlContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext();
        const token = ExtractTokenFromHeader(req);
        if (!token) {
            throw new UnauthorizedException("Access denied");
        }

        const payload = this.jwtService.verify(token);

        const userRole = payload.role;

        if (!userRole || !roles.includes(userRole)) {
            throw new UnauthorizedException("Access denied");
        }

        return true;
    }
}

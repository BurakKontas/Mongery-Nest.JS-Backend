import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthRoles } from "src/users/enums/AuthRoles";
import { JwtService } from "@nestjs/jwt";
import { GqlExecutionContext } from "@nestjs/graphql";

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
        const token = this.extractTokenFromHeader(req);
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

    private extractTokenFromHeader(request: any): string | undefined {
        const authorization = request.headers.authorization;
        if (authorization && authorization.split(" ")[0] === "Bearer") {
            return authorization.split(" ")[1];
        }
        return undefined;
    }
}

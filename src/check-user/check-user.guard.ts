import { CanActivate, createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { ExtractTokenFromHeader } from "src/helpers/extractTokenFromHeader";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRoles } from "src/users/enums/AuthRoles";

export class CheckUser implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService, private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const params = this.reflector.get<string[]>("check-user", context.getHandler());
        const modelName = params[0];
        const modelParameter = params[1] || "id";
        if (!modelName) return true;

        const gqlContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext();
        const token = ExtractTokenFromHeader(req);

        if (!token) throw new UnauthorizedException("Access denied");

        const payload = this.jwtService.verify(token);

        const userRole = payload.role;

        if (userRole == AuthRoles.ADMIN) return true;

        const requestedId = gqlContext.getArgs()[modelParameter];
        const resolverName = gqlContext.getHandler().name;

        if (!requestedId) throw new Error(`No id provided in ${resolverName}.`);

        const model = this.prisma.client[modelName];

        if (!model) throw new Error(`No model found in ${modelName}.`);

        const record = await model.findUnique({
            where: { id: requestedId },
            select: { userId: true },
        });

        if (!record) throw new Error(`No record found in ${modelName} with ${requestedId}.`);

        if (payload.id !== record?.userId) {
            throw new Error(`You are not authorized to perform this action in ${resolverName}.`);
        }

        return true;
    }
}

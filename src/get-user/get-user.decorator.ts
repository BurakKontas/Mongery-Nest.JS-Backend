import { createParamDecorator, ExecutionContext, UnauthorizedException, Inject } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
import { ExtractTokenFromHeader } from "src/helpers/extractTokenFromHeader";

export const UserId = createParamDecorator(async (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const token = ExtractTokenFromHeader(req);
    const jwtService = new JwtService({
        secret: jwtConstants.secret,
    });
    try {
        const payload = await jwtService.verifyAsync(token);
        if (!payload || !payload.id) {
            throw new UnauthorizedException("User ID not found in token");
        }

        return payload.id;
    } catch (error) {
        throw new UnauthorizedException("Invalid token");
    }
});

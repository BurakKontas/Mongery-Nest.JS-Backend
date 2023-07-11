import { createParamDecorator, ExecutionContext, UnauthorizedException, Inject } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { ExtractTokenFromHeader } from "src/helpers/extractTokenFromHeader";

export class UserIdHelper {
    constructor(@Inject(JwtService) private jwtService: JwtService) {}

    async getUserId(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token);

            if (!payload || !payload.userId) {
                throw new UnauthorizedException("User ID not found in token");
            }

            return payload.userId;
        } catch (error) {
            throw new UnauthorizedException("Invalid token");
        }
    }
}

export const UserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const token = ExtractTokenFromHeader(req);

    const userIdHelper = new UserIdHelper(context.getArgByIndex(2).req.app.get(JwtService));

    return userIdHelper.getUserId(token);
});

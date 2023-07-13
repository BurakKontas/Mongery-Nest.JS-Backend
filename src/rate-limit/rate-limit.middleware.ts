import { Injectable, NestMiddleware } from "@nestjs/common";
import { RedisService } from "@redis/redis";
import { NextFunction, Request, Response } from "express";

interface RateLimitConfig {
    path: string;
    limit: number;
    ttl: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    constructor(private readonly redis: RedisService) {}
    private readonly rateLimits: RateLimitConfig[] = [
        { path: "/auth/login", limit: 5, ttl: 10 },
        { path: "/auth/register", limit: 5, ttl: 10 },
        { path: "/api", limit: 100, ttl: 60 },
    ];

    async use(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip;
        const path = req.originalUrl;
        const key = `rate-limit:${ip}-${path}`;
        const rateLimit = this.findRateLimitConfig(path);

        try {
            let current = await this.redis.get<number>(key);
            if (current === null) current = 0;
            if (current >= rateLimit.limit) {
                res.status(429).send("Too many requests");
                return;
            }
            await this.redis.set(key, current + 1, rateLimit.ttl);
            next();
        } catch (error) {
            console.log(error);
            next();
        }
    }
    private findRateLimitConfig(url: string): RateLimitConfig | undefined {
        return this.rateLimits.find((config) => config.path.startsWith(url));
    }
}

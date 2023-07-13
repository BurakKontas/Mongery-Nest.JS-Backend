import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: "localhost",
            port: 6370,
            password: process.env.REDIS_PASSWORD,
        });
    }

    async get<T>(key: string): Promise<T> {
        let value = await this.client.get(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }

    async set<T>(key: string, value: T, ttl: number = 60 * 15): Promise<string> {
        let response = await this.client.set(key, JSON.stringify(value), "EX", ttl);
        if (response === "OK") {
            return response;
        }
        throw new Error("Error setting redis key");
    }

    async delete(key: string): Promise<number> {
        let result = await this.client.del(key);
        if (result) {
            return result;
        } else {
            throw new Error("Error deleting redis key");
        }
    }

    async onModuleInit() {
        if (this.client.status !== "ready") await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}

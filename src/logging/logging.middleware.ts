import { Injectable, NestMiddleware } from "@nestjs/common";
import { Logger, createLogger, transports } from "winston";
import { NextFunction, Request, Response } from "express";
import * as DailyRotateFile from "winston-daily-rotate-file";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private logger: Logger;

    constructor() {
        const logDirectory = "./logs";

        const rotateTransport = new DailyRotateFile({
            dirname: logDirectory,
            filename: "%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
        });

        this.logger = createLogger({
            transports: [rotateTransport],
        });
    }

    use(req: Request, res: Response, next: NextFunction) {
        let logger = this.logger;
        let request = {
            method: req.method,
            path: req.originalUrl,
            body: req.body,
            headers: req.headers,
            ip: req.ip,
        };

        const originalSend = res.send;
        //@ts-ignore
        res.send = function (body: any) {
            logger.info("Request", {
                ...request,
                statusCode: res.statusCode,
                reponse: body,
            });

            originalSend.apply(res, arguments);
        };

        next();
    }
}

import { Injectable, NestMiddleware } from "@nestjs/common";
import { Logger, createLogger, transports } from "winston";
import { NextFunction, Request, Response } from "express";
import { SeqTransport } from "@datalust/winston-seq";
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

        const seqTransport = new SeqTransport({
            serverUrl: process.env.SEQ_URL,
            apiKey: process.env.SEQ_API_KEY,
            onError: (e) => {
                console.error(e);
            },
            handleExceptions: true,
            handleRejections: true,
        });

        this.logger = createLogger({
            transports: [rotateTransport, seqTransport],
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
            logger.info(`Request to ${request.path} [${request.ip}]`, {
                ...request,
                statusCode: res.statusCode,
                reponse: body,
            });

            originalSend.apply(res, arguments);
        };

        next();
    }
}

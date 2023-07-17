import { Catch, ExceptionFilter, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { Logger, createLogger, transports } from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import { SeqTransport } from "@datalust/winston-seq";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private logger: Logger;

    constructor() {
        const logDirectory = "./logs";

        this.logger = createLogger({
            transports: [
                new DailyRotateFile({
                    dirname: logDirectory,
                    filename: "%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "30d",
                }),
                new SeqTransport({
                    serverUrl: process.env.SEQ_URL,
                    apiKey: process.env.SEQ_API_KEY,
                    onError: (e) => {
                        console.error(e);
                    },
                    handleExceptions: true,
                    handleRejections: true,
                }),
            ],
        });
    }

    catch(exception: any, host: ExecutionContext) {
        const ctx = GqlExecutionContext.create(host);
        const request = ctx.getContext().req as Request;

        this.logger.error(`Error at ${request.originalUrl} [${request.ip}]`, {
            message: exception.message,
            stack: exception.stack,
            method: request.method,
            path: request.originalUrl,
            ip: request.ip,
            status: request.statusCode,
        });
    }
}

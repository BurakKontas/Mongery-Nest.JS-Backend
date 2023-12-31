import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { GlobalExceptionFilter } from "./global-exception/global-exception.filter";
import { json } from "body-parser";

async function bootstrap() {
    dotenv.config();
    const certsDir = path.join(__dirname, "../../../", "certs");

    const app = await NestFactory.create(AppModule, {
        // httpsOptions: {
        //     key: fs.readFileSync(path.join(certsDir, 'privatekey.key')),
        //     cert: fs.readFileSync(path.join(certsDir, 'certificate.crt')),
        // },
    });

    app.use(json({ limit: "50mb" }));

    app.enableCors({
        origin: "*", // TODO: Change this to the actual origin
    });

    app.useGlobalFilters(new GlobalExceptionFilter()); // Global exception filter
    await app.listen(5050);
}
bootstrap();

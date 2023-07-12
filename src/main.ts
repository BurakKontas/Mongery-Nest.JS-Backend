import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
    dotenv.config();
    const certsDir = path.join(__dirname, '../../../', 'certs');

    const app = await NestFactory.create(AppModule, {
        httpsOptions: {
            key: fs.readFileSync(path.join(certsDir, 'privatekey.key')),
            cert: fs.readFileSync(path.join(certsDir, 'certificate.crt')),
        },
    });
    app.enableCors({
        origin: ["*"], // TODO: Change this to the actual origin
    });
    await app.listen(443);
}
bootstrap();

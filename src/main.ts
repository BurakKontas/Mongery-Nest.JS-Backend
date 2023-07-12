import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: ["*"], // TODO: Change this to the actual origin
    });
    await app.listen(5050);
}
bootstrap();

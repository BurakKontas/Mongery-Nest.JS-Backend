import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

async function bootstrap() {
    dotenv.config(); // .env dosyasını yükle
    const app = await NestFactory.create(AppModule);
    await app.listen(5050);
}
bootstrap();

import { Module } from "@nestjs/common";
import { CrypterService } from "./crypter.service";

@Module({
    providers: [CrypterService],
    exports: [CrypterService],
})
export class CrypterModule {}

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { CrypterModule } from "@crypter/crypter";
import { MinioModule } from "@minio/minio";
import { CustomersModule } from "./customers/customers.module";
import { ProductsModule } from "./products/products.module";
import { StatesModule } from "./states/states.module";
import { CategoriesModule } from "./categories/categories.module";
import { PrismaService } from "./prisma/prisma.service";
import { RedisModule } from "@redis/redis";
import { RateLimitMiddleware } from "./rate-limit/rate-limit.middleware";
import { LoggingMiddleware } from "./logging/logging.middleware";
import { OrdersModule } from './orders/orders.module';
import { FileModule } from './file/file.module';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: false,
            path: "/api",
            typePaths: ["./**/*.graphql"],
        }),
        AuthModule,
        UsersModule,
        JwtModule,
        CrypterModule,
        MinioModule,
        CustomersModule,
        ProductsModule,
        StatesModule,
        CategoriesModule,
        RedisModule,
        OrdersModule,
        FileModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RateLimitMiddleware).forRoutes("*"); // öncelikle ratelimit geldiği için 429 lar aşağıdaki loglarda görünmeyecek
        consumer.apply(LoggingMiddleware).forRoutes("*"); // tüm isteklerin loglanması için
    }
}

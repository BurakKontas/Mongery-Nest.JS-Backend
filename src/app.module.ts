import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { JwtModule } from "@nestjs/jwt"; // Import JwtModule

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
        JwtModule, // Add JwtModule here
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

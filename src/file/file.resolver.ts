import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { FileService } from "./file.service";
import { CreateFileInput } from "./dto/create-file.input";
import { UpdateFileInput } from "./dto/update-file.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { Roles } from "src/roles/roles.decorator";
import { AuthRoles } from "src/users/enums/AuthRoles";
import { UserId } from "src/get-user/get-user.decorator";

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(AuthRoles.USER, AuthRoles.ADMIN)
@Resolver("File")
export class FileResolver {
    constructor(private readonly fileService: FileService) {}

    @Mutation("createFile")
    create(@Args("createFileInput") createFileInput: any, @UserId() userId: number) {
        return this.fileService.create(createFileInput, userId);
    }

    @Query("files")
    findAll(@UserId() userId: number) {
        return this.fileService.findAll(userId);
    }

    @Query("file")
    findOne(@Args("fileName") fileName: string, @UserId() userId: number) {
        return this.fileService.findOne(fileName, userId);
    }

    @Mutation("updateFile")
    update(@Args("updateFileInput") updateFileInput: UpdateFileInput, @UserId() userId: number) {
        return this.fileService.update(updateFileInput, userId);
    }

    @Mutation("removeFile")
    remove(@Args("fileName") fileName: string, @UserId() userId: number) {
        return this.fileService.remove(fileName, userId);
    }
}

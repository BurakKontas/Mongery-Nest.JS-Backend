import { CreateFileInput } from "./create-file.input";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateFileInput extends PartialType(CreateFileInput) {
    fileName: string;
}

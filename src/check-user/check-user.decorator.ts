import { SetMetadata } from "@nestjs/common";

export const CheckUser = (...args: string[]) => SetMetadata("check-user", args);

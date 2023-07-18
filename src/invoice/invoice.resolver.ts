import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { InvoiceService } from "./invoice.service";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/roles/roles.decorator";
import { AuthRoles } from "src/users/enums/AuthRoles";
import { UserId } from "src/get-user/get-user.decorator";

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(AuthRoles.USER, AuthRoles.ADMIN)
@Resolver("Invoice")
export class InvoiceResolver {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Query("invoices")
    findAll(@UserId() userId: number) {
        return this.invoiceService.findAll(userId);
    }

    @Query("invoice")
    findOne(@Args("fileName") fileName: string, @UserId() userId: number) {
        return this.invoiceService.findOne(fileName, userId);
    }
}

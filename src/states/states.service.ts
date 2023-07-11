import { Injectable } from "@nestjs/common";
import { CreateStateInput } from "./dto/create-state.input";
import { UpdateStateInput } from "./dto/update-state.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StatesService {
    constructor(private readonly prisma: PrismaService) {}

    create(createStateInput: CreateStateInput, userId: number) {
        let state = this.prisma.client.states.create({
            data: {
                ...createStateInput,
            },
        });

        return state;
    }

    findAll(userId: number) {
        let states = this.prisma.client.states.findMany({
            where: {
                userId,
            },
        });
        return states;
    }

    findOne(id: number) {
        let state = this.prisma.client.states.findUnique({
            where: {
                id: id,
            },
        });
        return state;
    }

    update(id: number, updateStateInput: UpdateStateInput) {
        let state = this.prisma.client.states.update({
            where: {
                id: id,
            },
            data: {
                ...updateStateInput,
            },
        });
        return state;
    }

    remove(id: number) {
        this.prisma.client.states.delete({
            where: {
                id: id,
            },
        });
        return true;
    }
}

import { Injectable } from "@nestjs/common";
import { CreateStateInput } from "./dto/create-state.input";
import { UpdateStateInput } from "./dto/update-state.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StatesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createStateInput: CreateStateInput, userId: number) {
        let state = await this.prisma.client.states.create({
            data: {
                ...createStateInput,
                userId,
            },
        });

        //@ts-ignore
        state.createdAt = state.createdAt.toISOString();
        //@ts-ignore
        state.updatedAt = state.updatedAt.toISOString();

        return state;
    }

    async findAll(userId: number) {
        let states = await this.prisma.client.states.findMany({
            where: {
                userId,
            },
        });

        states.forEach((state) => {
            //@ts-ignore
            state.createdAt = state.createdAt.toISOString();
            //@ts-ignore
            state.updatedAt = state.updatedAt.toISOString();
        });

        return states;
    }

    async findOne(id: number) {
        let state = await this.prisma.client.states.findUnique({
            where: {
                id: id,
            },
        });

        //@ts-ignore
        state.createdAt = state.createdAt.toISOString();
        //@ts-ignore
        state.updatedAt = state.updatedAt.toISOString();

        return state;
    }

    async update(id: number, updateStateInput: UpdateStateInput) {
        let state = await this.prisma.client.states.update({
            where: {
                id: id,
            },
            data: {
                ...updateStateInput,
            },
        });

        //@ts-ignore
        state.createdAt = state.createdAt.toISOString();
        //@ts-ignore
        state.updatedAt = state.updatedAt.toISOString();

        return state;
    }

    async remove(id: number) {
        await this.prisma.client.states.delete({
            where: {
                id,
            },
        });
        return true;
    }
}

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UpdateMenteeUseCase } from "./update-mentee";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMenteeRepository } from "@/repositories/in-memory/in-memory-mentee-repository";
import { NotFoundMenteeError } from "../_errors/mentee/not-found-mentee-error";

let usersRepository: InMemoryUsersRepository
let menteesRepository: InMemoryMenteeRepository
let sut: UpdateMenteeUseCase

describe("Update user mentee", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository(),
        menteesRepository = new InMemoryMenteeRepository()

        sut = new UpdateMenteeUseCase(
            usersRepository,
            menteesRepository
        )
    })

    it("should be able update mentee user information sucessfully", async () => {
        const userCreated = await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            role: "MENTEE",
        })

        const createMentee = await menteesRepository.create({
            user: { connect: {id: userCreated.id}}
        })

        const { user } = await sut.execute({
            name: "John Doe Mentee",
            email: "johndoe@mentee.com",
            password: "123456",
            menteeId: createMentee.id
        })

        expect(user.email).toEqual("johndoe@mentee.com")
        expect(user.name).toEqual("John Doe Mentee")

    })

    it("should throw NotFoundMenteeError if mentee does not exist", async () => {
        await expect(
            sut.execute({
                name: "John Doe Mentee",
                email: "johndoe@mentee.com",
                password: "123456",
                menteeId: 999
            })
        ).rejects.toThrow(NotFoundMenteeError);
    });


})
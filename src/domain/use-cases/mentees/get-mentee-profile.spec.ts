import { InMemoryMenteeRepository } from "@/repositories/in-memory/in-memory-mentee-repository";
import { GetMenteeProfileUseCase } from "./get-mentee-profile";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

let menteeRepository: InMemoryMenteeRepository
let usersRepository: InMemoryUsersRepository
let sut: GetMenteeProfileUseCase

describe("Get Mentee profile ", () => {
    beforeEach(() => {
        menteeRepository = new InMemoryMenteeRepository()
        usersRepository = new InMemoryUsersRepository()
        sut = new GetMenteeProfileUseCase(
            menteeRepository
        )
    })

    it("should be able to get mentee profile", async () => {
        const user = await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            role: "MENTEE"
        })

        const createdMentee = await menteeRepository.create({
            user: { connect: {id: user.id}},
        })

        const { mentee } = await sut.execute({
            userId: createdMentee.userId
        })

        expect(mentee.id).toBe(1)

    })
})
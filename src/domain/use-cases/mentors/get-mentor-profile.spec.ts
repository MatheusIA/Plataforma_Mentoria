import { InMemoryMentorRepository } from "@/repositories/in-memory/in-memory-mentor-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetMentorProfileUseCase } from "./get-mentor-profile";
import { beforeEach, describe, expect, it } from "vitest";

let mentorsRepository: InMemoryMentorRepository
let usersRepository: InMemoryUsersRepository
let sut: GetMentorProfileUseCase

describe("Get mentor profile", () => {
    beforeEach(() => {
        mentorsRepository = new InMemoryMentorRepository()
        usersRepository = new InMemoryUsersRepository()
        sut = new GetMentorProfileUseCase(
            mentorsRepository
        )
    })

    it("should be able to get mentor profile", async () => {
        const user = await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            role: "MENTOR"
        })

        const createdMentor = await mentorsRepository.create({
            bio: "Mentoring in JavaScript, NodeJS and React",
            skills: ["JavaScript", "NodeJS", "React"],
            user: { connect: {id: user.id}}
        })

        const { mentor } = await sut.execute({
            userId: createdMentor.userId
        })

        expect(mentor.id).toBe(1)
        expect(mentor.bio).toEqual("Mentoring in JavaScript, NodeJS and React")
        expect(mentor.skills).toEqual([ 'JavaScript', 'NodeJS', 'React' ])

    })
})
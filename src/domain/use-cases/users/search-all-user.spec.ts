import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { SearchAllUsersUseCase } from "./search-all-users";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMentorRepository } from "@/repositories/in-memory/in-memory-mentor-repository";
import { InMemoryMenteeRepository } from "@/repositories/in-memory/in-memory-mentee-repository";

let usersRepositpory: InMemoryUsersRepository
let mentorRepository: InMemoryMentorRepository
let menteeRepository: InMemoryMenteeRepository
let sut: SearchAllUsersUseCase

describe("Search all users", () => {
    beforeEach(() => {
        usersRepositpory = new InMemoryUsersRepository()
        mentorRepository = new InMemoryMentorRepository()
        menteeRepository = new InMemoryMenteeRepository()
                
        sut = new SearchAllUsersUseCase(
            usersRepositpory
        )
    })

    it("should be able to search all users", async () => {
        const mentor = await usersRepositpory.create({
            name: "John Doe",
            email: "johndoe@mentor.com",
            password: '123456',
            role: "MENTOR"
        })

        await mentorRepository.create({
            bio: "Description",
            skills: ["JavaScript", "NodeJS"],
            user: { connect: { id: mentor.id}}
        })

        const mentee = await usersRepositpory.create({
            name: "John Doe",
            email: "johndoe@mentee.com",
            password: '123456',
            role: "MENTEE"
        })


        await menteeRepository.create({
            user: { connect: {id: mentee.id}}
        })

        const { users } = await sut.execute({
            page: 1
        })

        expect(users).toHaveLength(2)
        expect(users[0].role).toBe("MENTOR")
        expect(users[1].role).toBe("MENTEE")

    } )
})
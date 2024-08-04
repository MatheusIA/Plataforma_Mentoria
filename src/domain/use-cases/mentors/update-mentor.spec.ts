import { InMemoryMentorRepository } from "@/repositories/in-memory/in-memory-mentor-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UpdateMentorUseCase } from "./update-mentor";
import { beforeEach, describe, expect, it } from "vitest";
import { NotFoundMentorError } from "../_errors/mentors/not-found-mentor-error";

let usersRepository: InMemoryUsersRepository
let mentorsRepository: InMemoryMentorRepository
let sut: UpdateMentorUseCase

describe("Update user mentor", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        mentorsRepository = new InMemoryMentorRepository()

        sut = new UpdateMentorUseCase(
            usersRepository,
            mentorsRepository
        )
    })

    it("should be able to mentor user information sucessfully", async () => {
        const userCreated = await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            role: "MENTOR"
        })

        const createdMentor = await mentorsRepository.create({
            bio: "Mentoring in JavaScript and NodeJS",
            skills: ["JavaScript", "NodeJS"],
            user: {connect: {id: userCreated.id}}
        })

        const { user, mentor } = await sut.execute({
            name: "John Doe Mentor",
            email: "johndoe@mentor.com",
            password: "123456",
            bio: "Mentoring in JavaScript, NodeJS and React",
            skills: ["JavaScript", "NodeJS", "React"],
            mentorId: createdMentor.id
        })
        
        expect(user.email).toEqual("johndoe@mentor.com")
        expect(mentor.bio).toEqual("Mentoring in JavaScript, NodeJS and React")
        expect(mentor.skills).toEqual(["JavaScript", "NodeJS", "React"])
    })

    it("should throw NotFoundMentorError if mentor does not exist", async () => {
        await expect(
            sut.execute({
                name: "John Doe Mentor",
                email: "johndoe@mentor.com",
                password: "123456",
                bio: "Mentoring in JavaScript, NodeJS and React",
                skills: ["JavaScript", "NodeJS", "React"],
                mentorId: 999 
            })
        ).rejects.toThrow(NotFoundMentorError);
    });
})
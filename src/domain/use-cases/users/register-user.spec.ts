import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { RegisterUserUseCase } from "./register-user";
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryMentorRepository } from "@/repositories/in-memory/in-memory-mentor-repository";
import { InMemoryMenteeRepository } from "@/repositories/in-memory/in-memory-mentee-repository";
import { UserAlreadyExistsError } from "../_errors/users/user-already-exists-error";

let usersRepostory: InMemoryUsersRepository
let mentorRepository: InMemoryMentorRepository
let menteeRepository: InMemoryMenteeRepository
let sut: RegisterUserUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepostory = new InMemoryUsersRepository()
        mentorRepository = new InMemoryMentorRepository()
        menteeRepository = new InMemoryMenteeRepository()

        sut = new RegisterUserUseCase(
            usersRepostory,
            mentorRepository,
            menteeRepository
        )
    })

    it('should be able to register a user', async () => {
        const { user } = await sut.execute({
            name: "John Doe",
            bio: "Description",
            email: "johndoe@example.com",
            password: '123456',
            role: "MENTOR",
            skills: ["JavaScript", "NodeJS"]
        })

        expect(user).toHaveProperty('id')
        expect(user.email).toBe("johndoe@example.com")
        expect(user.role).toBe('MENTOR')

        const mentor = mentorRepository.items.find((mentor) => mentor.userId === user.id)

        expect(mentor).toBeTruthy()
        expect(mentor?.bio).toBe('Description')
        expect(mentor?.skills).toEqual(['JavaScript', 'NodeJS'])
    })

    it('should not be able to register user with same email twice', async () => {
        const email = "johndoe@example.com"

        await sut.execute({
            name: "John Doe",
            bio: "Description",
            email,
            password: '123456',
            role: "MENTOR",
            skills: ["JavaScript", "NodeJS"]
        })

        await expect(
            sut.execute({
                name: "John Doe",
                bio: "Description",
                email,
                password: '123456',
                role: "MENTOR",
                skills: ["JavaScript", "NodeJS"]
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
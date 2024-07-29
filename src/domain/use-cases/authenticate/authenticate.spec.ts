import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { beforeEach, describe, expect, it } from "vitest";
import { InvalidEmailError } from "../_errors/authenticate/invalid-email-error";
import { InvalidCredentialsError } from "../_errors/authenticate/invalid-credentials-error";
import { hash } from "bcryptjs";

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe("Authenticate Use Case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(
            usersRepository
        )
    })

    it("should be able to authenticate", async () => {
        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: await hash('123456', 6),
            role: "MENTOR",
        })

        const { user } = await sut.execute({
            email: "johndoe@example.com",
            password: "123456"
        })

        expect(user.id).toBe(1)
    })

    it("should not be able to authenticate with wrong email", async () => {

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            role: "MENTOR",
        })

        await expect(() => 
            sut.execute({
                email: "johndoe@example",
                password: "123456"
            
            })).rejects.toBeInstanceOf(InvalidEmailError)
    })

    it("should not be able to authenticate with wrong password", async () => {
        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: '123456',
            role: "MENTOR",
        })

        await expect(() => 
            sut.execute({
                email: "johndoe@example.com",
                password: "123123"
            
            })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
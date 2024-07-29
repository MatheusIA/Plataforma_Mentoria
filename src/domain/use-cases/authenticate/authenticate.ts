import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"
import { InvalidEmailError } from "../_errors/authenticate/invalid-email-error"
import { compare } from "bcryptjs"
import { InvalidCredentialsError } from "../_errors/authenticate/invalid-credentials-error"

interface AuthenticateUseCaseRequest {
    email: string,
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(
        private usersRepository: UsersRepository
    ) {}

    async execute({
        email,
        password
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email)

        if(!user) {
            throw new InvalidEmailError()
        }

        const doesPasswordMatches = await compare(password, user.password)

        if(!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return {
            user
        }
    }
}
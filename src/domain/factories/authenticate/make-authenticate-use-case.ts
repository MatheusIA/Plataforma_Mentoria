import { AuthenticateUseCase } from "@/domain/use-cases/authenticate/authenticate";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeAuthenticateUseCase() {
    const usersRepository = new PrismaUsersRepository()
    
    const authenticateUseCase = new AuthenticateUseCase(
        usersRepository
    )

    return authenticateUseCase
}
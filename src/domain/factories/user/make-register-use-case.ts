import { RegisterUserUseCase } from "@/domain/use-cases/users/register-user";
import { PrismaMenteeRepository } from "@/repositories/prisma/prisma-mentee-repository";
import { PrismaMentorRepository } from "@/repositories/prisma/prisma-mentor-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeRegisterUserUseCase() {
    const usersRepository = new PrismaUsersRepository()
    const mentorRepository = new PrismaMentorRepository()
    const menteeRepository = new PrismaMenteeRepository()

    const registerUserUseCase = new RegisterUserUseCase(
        usersRepository,
        mentorRepository,
        menteeRepository
    )

    return registerUserUseCase
}
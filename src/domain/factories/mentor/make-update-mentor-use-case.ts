import { UpdateMentorUseCase } from "@/domain/use-cases/mentors/update-mentor";
import { PrismaMentorRepository } from "@/repositories/prisma/prisma-mentor-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeUpdateMentorUseCase() {
    const usersRepository = new PrismaUsersRepository()
    const mentorRepository = new PrismaMentorRepository()

    const useCase = new UpdateMentorUseCase(
        usersRepository,
        mentorRepository
    )

    return useCase
}
import { GetMentorProfileUseCase } from "@/domain/use-cases/mentors/get-mentor-profile";
import { PrismaMentorRepository } from "@/repositories/prisma/prisma-mentor-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeGetMentorProfileUseCase() {
    const mentorsRepository = new PrismaMentorRepository()
  
    const useCase = new GetMentorProfileUseCase(
        mentorsRepository
    )

    return useCase
}
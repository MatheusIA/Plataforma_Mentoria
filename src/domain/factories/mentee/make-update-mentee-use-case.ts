import { UpdateMenteeUseCase } from "@/domain/use-cases/mentees/update-mentee";
import { PrismaMenteeRepository } from "@/repositories/prisma/prisma-mentee-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeUpdateMenteeUseCase(){
    const usersRepository = new PrismaUsersRepository()
    const menteesRepository = new PrismaMenteeRepository()

    const useCase = new UpdateMenteeUseCase(
        usersRepository,
        menteesRepository
    )

    return useCase
}
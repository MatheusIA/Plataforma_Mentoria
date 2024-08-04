import { GetMenteeProfileUseCase } from "@/domain/use-cases/mentees/get-mentee-profile";
import { PrismaMenteeRepository } from "@/repositories/prisma/prisma-mentee-repository";

export function makeGetMenteeProfileUseCase() {
    const menteeRepository = new PrismaMenteeRepository()
    const useCase = new GetMenteeProfileUseCase(
        menteeRepository
    )

    return useCase
}
import { SearchAllMentorsUseCase } from "@/domain/use-cases/mentors/search-all-mentors";
import { PrismaMentorRepository } from "@/repositories/prisma/prisma-mentor-repository";

export function makeSearchAllMentorsUseCase() {
    const mentorRepository = new PrismaMentorRepository()
    const useCase = new SearchAllMentorsUseCase(
        mentorRepository
    )

    return useCase
}
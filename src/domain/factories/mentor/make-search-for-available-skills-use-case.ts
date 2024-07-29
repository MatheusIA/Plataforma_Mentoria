import { SearchForAvailableSkillsUseCase } from "@/domain/use-cases/mentors/search-for-available-skills-user";
import { PrismaMentorRepository } from "@/repositories/prisma/prisma-mentor-repository";

export function makeSearchForAvailableSkillsUseCase() {
    const mentorRepository = new PrismaMentorRepository()

    const searchForAvailableSkillsUseCase = new SearchForAvailableSkillsUseCase(
        mentorRepository
    )

    return searchForAvailableSkillsUseCase
}
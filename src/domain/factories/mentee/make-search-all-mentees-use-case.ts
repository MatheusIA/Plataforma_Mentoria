import { SearchAllMenteeUseCase } from "@/domain/use-cases/mentees/search-all-mentees";
import { PrismaMenteeRepository } from "@/repositories/prisma/prisma-mentee-repository";

export function makeSearchAllMenteessUseCase() {
    const menteesRepository = new PrismaMenteeRepository()
    const useCase = new SearchAllMenteeUseCase(
        menteesRepository
    )

    return useCase
}
import { GetReviewMentorIdUseCase } from "@/domain/use-cases/reviews/get-review-by-mentor-id";
import { PrismaReviewRepository } from "@/repositories/prisma/prisma-review-repository";

export function makeGetReviewByMentorIdUseCase(){
    const reviewsRepository = new PrismaReviewRepository()
    const useCase = new GetReviewMentorIdUseCase(
        reviewsRepository
    )

    return useCase
}
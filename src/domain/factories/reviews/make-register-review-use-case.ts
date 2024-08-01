import { RegisterReviewUseCase } from "@/domain/use-cases/reviews/register-review";
import { PrismaMentorShipRepository } from "@/repositories/prisma/prisma-mentorship-repository";
import { PrismaReviewRepository } from "@/repositories/prisma/prisma-review-repository";

export function makeRegisterReviewUseCase(){
    const reviewRepository = new PrismaReviewRepository()
    const mentorshipRepository = new PrismaMentorShipRepository()

    const useCase = new RegisterReviewUseCase(
        reviewRepository,
        mentorshipRepository
    )

    return useCase
}
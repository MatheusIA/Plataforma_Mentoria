import { ReviewRepository } from "@/repositories/review-repository"
import { Review } from "@prisma/client"
import { NotFoundReviewError } from "../_errors/review/not-foud-review-error"

interface GetReviewByMentorIdUseCaseRequest {
    mentorId: number
}

interface GetReviewMentorIdUseCaseResponse {
    review: Review[]
}

export class GetReviewMentorIdUseCase {
    constructor(
        private reviewsRepository: ReviewRepository
    ){}

    async execute({
        mentorId
    }: GetReviewByMentorIdUseCaseRequest): Promise<GetReviewMentorIdUseCaseResponse> {
        const review = await this.reviewsRepository.findReviewByMentorId(mentorId)

        if(!review) {
            throw new NotFoundReviewError()
        }

        return {
            review
        }
    }
}
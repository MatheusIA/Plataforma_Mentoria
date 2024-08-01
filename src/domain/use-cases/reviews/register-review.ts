import { MentorshipRepository } from "@/repositories/mentorship-repository"
import { ReviewRepository } from "@/repositories/review-repository"
import { Review } from "@prisma/client"
import { NotFoundMentorshipError } from "../_errors/mentorship/not-found-mentorship-error"

interface RegisterReviewRequest {
    mentorshipId: number
    rating: number,
    comment?: string
}

interface RegisterReviewResponse {
    review: Review
}

export class RegisterReviewUseCase {
    constructor(
        private reviewRepository: ReviewRepository,
        private mentorshipRepository: MentorshipRepository
    ){}

    async execute({
        mentorshipId,
        rating,
        comment
    }: RegisterReviewRequest): Promise<RegisterReviewResponse> {
        const mentorship = await this.mentorshipRepository.findById(mentorshipId)

        if(!mentorship){
            throw new NotFoundMentorshipError()
        }

        const review = await this.reviewRepository.create({
            mentorship: { connect: {id: mentorship.id}},
            rating,
            comment
        })

        return {
            review
        }
    }
}
import { InMemoryMentorshipRepository } from "@/repositories/in-memory/in-memory-mentorship-repository";
import { InMemoryReviewRepository } from "@/repositories/in-memory/in-memory-review-repository";
import { RegisterReviewUseCase } from "./register-review";
import { beforeEach, describe, expect, it } from "vitest";

let reviewRepository: InMemoryReviewRepository
let mentorshipRepository: InMemoryMentorshipRepository
let sut: RegisterReviewUseCase

describe("Register Review Use Case", () => {
    beforeEach(async () => {
        reviewRepository = new InMemoryReviewRepository()
        mentorshipRepository = new InMemoryMentorshipRepository()
    
        sut = new RegisterReviewUseCase(
            reviewRepository,
            mentorshipRepository
        )
    })

    it("should be able to register a review ", async () => {
        const mentorship = await mentorshipRepository.create({
            mentor: { connect: {id: 1}},
            mentee: { connect: {id: 1}},
            topic: "Learn TypeScript",
            date: new Date("2024-08-01T14:00:00Z")
        })

        const { review } = await sut.execute({
            mentorshipId: mentorship.id,
            rating: 5,
            comment: "Excellent mentorship"
        })

        expect(review).toBeDefined()
        expect(review.rating).toBe(5)
        expect(review.comment).toBe("Excellent mentorship")
    })
    
})
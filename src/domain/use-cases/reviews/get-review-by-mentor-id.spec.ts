import { InMemoryMenteeRepository } from "@/repositories/in-memory/in-memory-mentee-repository";
import { InMemoryMentorRepository } from "@/repositories/in-memory/in-memory-mentor-repository";
import { InMemoryMentorshipRepository } from "@/repositories/in-memory/in-memory-mentorship-repository";
import { InMemoryReviewRepository } from "@/repositories/in-memory/in-memory-review-repository";
import { GetReviewMentorIdUseCase } from "./get-review-by-mentor-id";
import { beforeEach, describe, expect, it } from "vitest";

let menteeRepository: InMemoryMenteeRepository
let mentorRepository: InMemoryMentorRepository
let mentorshipRepository: InMemoryMentorshipRepository
let reviewsRepository: InMemoryReviewRepository
let sut: GetReviewMentorIdUseCase

describe("Get review by mentor id use case", () => {
    beforeEach(() => {
        reviewsRepository = new InMemoryReviewRepository()
        mentorshipRepository = new InMemoryMentorshipRepository()
        sut = new GetReviewMentorIdUseCase(
            reviewsRepository
        )
    })

    it("should be able to get all reviews by mentor id", async () => {
        const mentorship1 = await mentorshipRepository.create({
            mentor: { connect: { id: 1}},
            mentee: { connect: { id: 1}},
            topic: "Topic 1",
            date: new Date("2024-08-11T17:00:00Z"),
        }) 

        const mentorship2 = await mentorshipRepository.create({
            mentor: { connect: { id: 1}},
            mentee: { connect: { id: 2}},
            topic: "Topic 2",
            date: new Date("2024-08-12T17:00:00Z"),
        }) 

        const mentorship3 = await mentorshipRepository.create({
            mentor: { connect: { id: 1}},
            mentee: { connect: { id: 3}},
            topic: "Topic 3",
            date: new Date("2024-08-13T17:00:00Z"),
        })  

        reviewsRepository.addMentorship(mentorship1)
        reviewsRepository.addMentorship(mentorship2)
        reviewsRepository.addMentorship(mentorship3)

        await reviewsRepository.create({
            mentorship: { connect: {id: mentorship1.id}},
            rating: 5
        })

        await reviewsRepository.create({
            mentorship: {connect: {id: mentorship2.id}},
            rating: 4
        })

        await reviewsRepository.create({
            mentorship: { connect: {id: mentorship3.id}},
            rating: 3
        })

        const { review } = await sut.execute({
            mentorId: 1
        })

        expect(review.length).toBe(3)
        expect(review[0].rating).toBe(5)
        expect(review[1].rating).toBe(4)
        expect(review[2].rating).toBe(3)
    })
})
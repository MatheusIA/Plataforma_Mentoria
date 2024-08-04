import { InMemoryMentorshipRepository } from "@/repositories/in-memory/in-memory-mentorship-repository";
import { GetMentorshipUseCase } from "./get-mentorship";
import { beforeEach, describe, expect, it } from "vitest";

let mentorshipRepository: InMemoryMentorshipRepository
let sut: GetMentorshipUseCase

describe("Get mentorship ", () => {
    beforeEach(() => {
        mentorshipRepository = new InMemoryMentorshipRepository()
        sut = new GetMentorshipUseCase(
            mentorshipRepository
        )
    })

    it("should be able to get mentorship by id", async () => {
        await mentorshipRepository.create({
            mentee: {connect: {id: 1}},
            mentor: { connect: {id: 1}},
            date: "2024-08-10T14:40:00Z",
            topic: "Topic 1",
            googleEventId: '1234'
        })

        await mentorshipRepository.create({
            mentee: {connect: {id: 1}},
            mentor: { connect: {id: 1}},
            date: "2024-08-11T14:40:00Z",
            topic: "Topic 2",
            googleEventId: '4321'
        })  

        const { mentorship } = await sut.execute({
            mentorshipId: 1
        })

        expect(mentorship.id).toBe(1)
        expect(mentorship.topic).toEqual("Topic 1")
    })
})
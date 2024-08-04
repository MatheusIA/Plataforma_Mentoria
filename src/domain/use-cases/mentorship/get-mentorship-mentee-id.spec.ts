import { InMemoryMentorshipRepository } from "@/repositories/in-memory/in-memory-mentorship-repository";
import { GetMentorshipMenteeIdUseCase } from "./get-mentorship-mentee-id";
import { beforeEach, describe, expect, it } from "vitest";

let mentorshipRepository: InMemoryMentorshipRepository
let sut: GetMentorshipMenteeIdUseCase

describe("Get mentorship by mentee id use case", () => {
    beforeEach(() => {
        mentorshipRepository = new InMemoryMentorshipRepository()
        sut = new GetMentorshipMenteeIdUseCase(
            mentorshipRepository
        )
    })

    it("should be able to get mentorships by mentee id", async () => {
        await mentorshipRepository.create({
            mentor: { connect: { id: 1}},
            mentee: { connect: { id: 1}},
            topic: "Topic 1",
            date: new Date("2024-08-11T17:00:00Z"),
        }) 

        await mentorshipRepository.create({
            mentor: { connect: { id: 1}},
            mentee: { connect: { id: 1}},
            topic: "Topic 2",
            date: new Date("2024-08-12T17:00:00Z"),
        }) 

        await mentorshipRepository.create({
            mentor: { connect: { id: 1}},
            mentee: { connect: { id: 1}},
            topic: "Topic 3",
            date: new Date("2024-08-13T17:00:00Z"),
        }) 

        const { mentorship } = await sut.execute({
            menteeId: 1
        })

        expect(mentorship.length).toBe(3)
        expect(mentorship[0].topic).toEqual("Topic 1")
        expect(mentorship[1].topic).toEqual("Topic 2")
        expect(mentorship[2].topic).toEqual("Topic 3")
    })
})
import { InMemoryMentorshipRepository } from "@/repositories/in-memory/in-memory-mentorship-repository";
import { GetMentorshipMentorIdUseCase } from "./get-mentorship-mentor-id";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

let mentorshipRepository: InMemoryMentorshipRepository
let sut: GetMentorshipMentorIdUseCase

describe("Get mentorships by mentor id Use Case", () => {
    beforeEach(() => {
        mentorshipRepository = new InMemoryMentorshipRepository
        sut = new GetMentorshipMentorIdUseCase(
            mentorshipRepository
        )
    })

    it("should be able to get mentorships by mentor id", async () => {
        await mentorshipRepository.create({
            mentor: { connect: { id: 1}},
            mentee: { connect: { id: 1}},
            topic: "Topic 1",
            date: new Date("2024-08-11T17:00:00Z"),
        }) 

        await mentorshipRepository.create({
            mentor: { connect: { id: 1}},
            mentee: { connect: { id: 2}},
            topic: "Topic 2",
            date: new Date("2024-08-12T17:00:00Z"),
        }) 

        const { mentorship } = await sut.execute({
            mentorId: 1
        })

        expect(mentorship.length).toBe(2)
        expect(mentorship[0].topic).toEqual("Topic 1")
        expect(mentorship[1].topic).toEqual("Topic 2")

    })
})
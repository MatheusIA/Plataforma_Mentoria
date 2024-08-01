import { InMemoryMenteeRepository } from "@/repositories/in-memory/in-memory-mentee-repository";
import { InMemoryMentorRepository } from "@/repositories/in-memory/in-memory-mentor-repository";
import { InMemoryMentorshipRepository } from "@/repositories/in-memory/in-memory-mentorship-repository";
import { RegisterMentorshipUseCase } from "./register-mentorship";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AvailableTimeError } from "../_errors/mentorship/available-time-error";

let mentorRepository: InMemoryMentorRepository
let menteeRepository: InMemoryMenteeRepository
let mentorshipRepository: InMemoryMentorshipRepository
let sut: RegisterMentorshipUseCase

describe("Register Mentorship Use Case", () => {
    beforeEach(() => {
        mentorRepository = new InMemoryMentorRepository()
        menteeRepository = new InMemoryMenteeRepository()
        mentorshipRepository = new InMemoryMentorshipRepository()

        sut = new RegisterMentorshipUseCase(
            mentorshipRepository,
            mentorRepository,
            menteeRepository,
        )
    })

    it("should be able register a mentorship and Google Calendar", async () => {
        const mentor = await mentorRepository.create({
            bio: "Experienced in TypeScript and Node.js",
            skills: ["TypeScript", "Node.js"],
            user: { connect: { id: 1 } }
        })

        const mentee = await menteeRepository.create({
            user: { connect: { id: 2 } }
        })

        const { mentorship } = await sut.execute({
            mentorId: mentor.id,
            menteeId: mentee.id,
            topic: "Learn TypeScript",
            date: new Date("2024-08-01T14:00:00Z"),
            dateGoogle: new Date("2024-08-01T14:00:00-03:00")
        })

        expect(mentorship).toBeDefined()
        expect(mentorship.topic).toBe("Learn TypeScript")
    })

    it("should throw AvailableTimeError if the desired time slot is already occupied", async () => {
        const mentor = await mentorRepository.create({
            bio: "Experienced in TypeScript and Node.js",
            skills: ["TypeScript", "Node.js"],
            user: { connect: { id: 1 } }
        })
    
        const mentee = await menteeRepository.create({
            user: { connect: { id: 2 } }
        })
    
        await expect(sut.execute({
            mentorId: mentor.id,
            menteeId: mentee.id,
            topic: "Learn TypeScript",
            date: new Date("2024-08-01T14:00:00Z"),
            dateGoogle: new Date("2024-08-01T14:00:00-03:00")
        })).rejects.toBeInstanceOf(AvailableTimeError);
    })
})
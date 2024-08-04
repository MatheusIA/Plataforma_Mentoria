import { MentorshipRepository } from "@/repositories/mentorship-repository";
import { UpdateMentorshipUseCase } from "./update-mentorship";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMentorshipRepository } from "@/repositories/in-memory/in-memory-mentorship-repository";
import { PrismaClient } from "@prisma/client";
import { InvalidDateError } from "../_errors/mentorship/invalid-date-error";
import { NotFoundMentorshipError } from "../_errors/mentorship/not-found-mentorship-error";

let mentorshipRepository: InMemoryMentorshipRepository
let prisma: PrismaClient
let sut: UpdateMentorshipUseCase

describe("Update mentorship Use Case", () => {
    beforeEach(() => {        
        mentorshipRepository = new InMemoryMentorshipRepository()
        prisma = new PrismaClient()
        
        sut = new UpdateMentorshipUseCase(
            mentorshipRepository,
            prisma
        )
    })

    it.skip('should be able to update mentorship', async () => {
        const date = new Date("2024-08-11T17:00:00Z").toISOString()

        const mentorship = await mentorshipRepository.create({
            mentor: { connect: { id: 1}},
            mentee: { connect: { id: 1}},
            topic: 'Learn NodeJS',
            date: new Date(),
            googleEventId: '1234'
        })

        const result = await sut.execute({
            id: mentorship.id,
            mentorId: 1,
            menteeId: 1,
            topic: "Learn TypeScript",
            date: date,
            dateGoogle: new Date("2024-08-11T17:00:00-03:00"),
            googleEventId: '1234'
        })

        expect(result.mentorship.topic).toBe("Learn TypeScript")
    })

    it('should throw NotFoundMentorshipError if mentorship is not found', async () => {
        await expect(sut.execute({
            id: 999, 
            mentorId: 1,
            menteeId: 1,
            topic: 'Updated Topic',
            date: new Date().toISOString(),
            dateGoogle: new Date(),
            googleEventId: '1234',
        })).rejects.toBeInstanceOf(NotFoundMentorshipError);
    });

    it('should throw InvalidDateError if the date is in the past', async () => {
        const dateInPast = new Date('2000-01-01').toISOString();
        const mentorship = await mentorshipRepository.create({
            mentor: { connect: { id: 1 } },
            mentee: { connect: { id: 1 } },
            topic: 'Test Topic',
            date: new Date(),
            googleEventId: '1234'
        });

        await expect(sut.execute({
            id: mentorship.id,
            mentorId: 1,
            menteeId: 1,
            topic: 'Updated Topic',
            date: dateInPast,
            dateGoogle: new Date(),
            googleEventId: '1234',
        })).rejects.toBeInstanceOf(InvalidDateError);
    });
    
    
})
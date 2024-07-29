import { InMemoryMentorRepository } from "@/repositories/in-memory/in-memory-mentor-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchForAvailableSkillsUseCase } from "./search-for-available-skills-user";
import { exec } from "child_process";

let mentorRepository: InMemoryMentorRepository
let sut: SearchForAvailableSkillsUseCase

describe("Search for available skills", () => {
    beforeEach(() => {
        mentorRepository = new InMemoryMentorRepository()
        
        sut = new SearchForAvailableSkillsUseCase(
            mentorRepository
        )
    })

    it("should return unique skills from mentors", async () => {
        await mentorRepository.create({
            bio: 'Mentor 1',
            skills: ['JavaScript', 'NodeJS'],
            user: { connect: { id: 1 } }
        })

        await mentorRepository.create({
            bio: 'Mentor 2',
            skills: ['JavaScript', 'TypeScript'],
            user: { connect: { id: 2 } }
        })

        const { mentors } = await sut.execute()

        expect(mentors).toEqual(
            expect.arrayContaining(['JavaScript', 'NodeJS', 'TypeScript'])
        )
        expect(mentors).toHaveLength(3)
    })
})
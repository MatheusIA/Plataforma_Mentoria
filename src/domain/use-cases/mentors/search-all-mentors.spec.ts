import { InMemoryMentorRepository } from "@/repositories/in-memory/in-memory-mentor-repository";
import { SearchAllMentorsUseCase } from "./search-all-mentors";
import { beforeEach, describe, expect, it } from "vitest";

let mentorsRepository: InMemoryMentorRepository
let sut: SearchAllMentorsUseCase

describe("Search all mentor", () => {
    beforeEach(async () => {
        mentorsRepository = new InMemoryMentorRepository()
        sut = new SearchAllMentorsUseCase(
            mentorsRepository
        )
    })

    it("should be able to search all the mentors", async () => {
        await mentorsRepository.create({
            bio: 'Mentor 1',
            skills: ['JavaScript', 'NodeJS'],
            user: { connect: { id: 1 } }
        })

        await mentorsRepository.create({
            bio: 'Mentor 2',
            skills: ['JavaScript', 'NodeJS'],
            user: { connect: { id: 2 } }
        })

        const { mentors} = await sut.execute({
            page: 1
        })

        expect(mentors).toHaveLength(2)
    })
})
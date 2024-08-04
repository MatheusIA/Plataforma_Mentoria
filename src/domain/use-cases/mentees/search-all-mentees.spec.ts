import { InMemoryMenteeRepository } from "@/repositories/in-memory/in-memory-mentee-repository";
import { SearchAllMenteeUseCase } from "./search-all-mentees";
import { beforeEach, describe, expect, it } from "vitest";

let menteesRepository: InMemoryMenteeRepository
let sut: SearchAllMenteeUseCase

describe("Search all mentees", () => {
    beforeEach(async () => {
        menteesRepository = new InMemoryMenteeRepository()
        sut = new SearchAllMenteeUseCase(
            menteesRepository
        )
    })

    it("should be able to search all mentees", async () => {
        await menteesRepository.create({
            user: { connect: { id: 1}}
        })

        await menteesRepository.create({
            user: { connect: { id: 2}}
        })

        await menteesRepository.create({
            user: { connect: {id: 3}}
        })

        const { mentees } = await sut.execute({
            page: 1
        })

        expect(mentees).toHaveLength(3)

    })
})
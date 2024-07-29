import { MentorsRepository } from "@/repositories/mentor-repository";
import { NotFoundAvailableSkillsError } from "../_errors/users/not-found-available-skills-error";

interface SearchForAvailableSkillsResponse {
    mentors: string[]
}

export class SearchForAvailableSkillsUseCase {
    constructor(
        private mentorsRepository: MentorsRepository
    ){}

    async execute(): Promise<SearchForAvailableSkillsResponse>{
        const mentors = await this.mentorsRepository.searchSkills()

        if(!mentors){
            throw new NotFoundAvailableSkillsError()
        }

        return {
            mentors
        }
    }
}
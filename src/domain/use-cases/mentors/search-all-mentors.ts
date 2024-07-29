import { MentorsRepository } from "@/repositories/mentor-repository";
import { Mentor } from "@prisma/client";
import { NotFoundUsersError } from "../_errors/users/not-found-users-error";

interface SearchAllMentorRequest {
    page: number
}

interface SearchAllMentorResponse {
    mentors: Mentor[]
}

export class SearchAllMentorsUseCase {
    constructor(
        private mentorsRepository: MentorsRepository
    ){}

    async execute({
        page
    }: SearchAllMentorRequest): Promise<SearchAllMentorResponse> {
        const mentors = await this.mentorsRepository.searchAllMentors(page)

        if(!mentors){
            throw new NotFoundUsersError()
        }

        return {
            mentors
        }
    }
}
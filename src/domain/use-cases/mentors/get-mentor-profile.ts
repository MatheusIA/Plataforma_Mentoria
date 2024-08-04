import { MentorsRepository } from "@/repositories/mentor-repository"
import { Mentor } from "@prisma/client"
import { NotFoundMentorError } from "../_errors/mentors/not-found-mentor-error"

interface GetMentorProfileUseCaseRequest {
    userId: number
}

interface GetMentorProfileUseCaseResponse {
    mentor: Mentor
}

export class GetMentorProfileUseCase {
    constructor(
        private mentorsRepository: MentorsRepository
    ){}

    async execute({
        userId
    }: GetMentorProfileUseCaseRequest): Promise<GetMentorProfileUseCaseResponse> {
        const mentor = await this.mentorsRepository.findMentorByUserId(userId)

        if(!mentor){
            throw new NotFoundMentorError()
        }

        return {
            mentor
        }
    }
}
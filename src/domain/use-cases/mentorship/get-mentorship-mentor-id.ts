import { MentorshipRepository } from "@/repositories/mentorship-repository"
import { Mentorship } from "@prisma/client"
import { NotFoundMentorshipError } from "../_errors/mentorship/not-found-mentorship-error"

interface GetMentorshipMentorIdRequest {
    mentorId: number
}

interface GetMentorshipMentorIdResponse {
    mentorship: Mentorship[]
}

export class GetMentorshipMentorIdUseCase {
    constructor(
        private mentorshipRepository: MentorshipRepository
    ){}

    async execute({
        mentorId
    }: GetMentorshipMentorIdRequest): Promise<GetMentorshipMentorIdResponse>{
        const mentorship = await this.mentorshipRepository.findMentorshipMentorId(mentorId)

        if(!mentorship){
            throw new NotFoundMentorshipError()
        }

        return {
            mentorship
        }
    }
}
import { MentorshipRepository } from "@/repositories/mentorship-repository"
import { Mentorship } from "@prisma/client"
import { NotFoundMentorshipError } from "../_errors/mentorship/not-found-mentorship-error"

interface GetMentorshipMenteeIdRequest {
    menteeId: number
}

interface GetMentorshipMenteeIdResponse {
    mentorship: Mentorship[]
}

export class GetMentorshipMenteeIdUseCase {
    constructor(
        private mentorshipRepository: MentorshipRepository
    ){}

    async execute({
        menteeId
    }: GetMentorshipMenteeIdRequest): Promise<GetMentorshipMenteeIdResponse>{
        const mentorship = await this.mentorshipRepository.findMentorshipMenteeId(menteeId)

        if(!mentorship) {
            throw new NotFoundMentorshipError()
        }

        return {
            mentorship
        }
    }
}
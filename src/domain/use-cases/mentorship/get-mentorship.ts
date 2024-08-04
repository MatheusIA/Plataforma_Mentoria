import { MentorshipRepository } from "@/repositories/mentorship-repository"
import { Mentorship } from "@prisma/client"
import { NotFoundMentorshipError } from "../_errors/mentorship/not-found-mentorship-error"

interface GetMentorshipUseCaseRequest {
    mentorshipId: number
}

interface GetMentorshipUseCaseResponse {
    mentorship: Mentorship
}

export class GetMentorshipUseCase {
    constructor(
        private mentorshipsRepository: MentorshipRepository
    ){}

    async execute({
        mentorshipId
    }: GetMentorshipUseCaseRequest): Promise<GetMentorshipUseCaseResponse> {
        const mentorship = await this.mentorshipsRepository.findById(mentorshipId)

        if(!mentorship){
            throw new NotFoundMentorshipError()
        }

        return {
            mentorship
        }
    }
}
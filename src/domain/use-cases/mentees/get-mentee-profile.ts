import { MenteesRepository } from "@/repositories/mentee-repository"
import { Mentee } from "@prisma/client"
import { NotFoundMenteeError } from "../_errors/mentee/not-found-mentee-error"

interface GetMenteeProfileUseCaseRequest {
    userId: number
}

interface GetMenteeProfileUseCaseResponse {
    mentee: Mentee
}

export class GetMenteeProfileUseCase {
    constructor(
        private menteesRepository: MenteesRepository
    ){}

    async execute({
        userId
    }: GetMenteeProfileUseCaseRequest): Promise<GetMenteeProfileUseCaseResponse> {
        const mentee = await this.menteesRepository.findMenteeByUserId(userId)

        if(!mentee){
            throw new NotFoundMenteeError()
        }

        return {
            mentee
        }
    }
}

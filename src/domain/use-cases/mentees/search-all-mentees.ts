import { MenteesRepository } from "@/repositories/mentee-repository"
import { Mentee } from "@prisma/client"
import { NotFoundMenteeError } from "../_errors/mentee/not-found-mentee-error"

interface SearchAllMenteeRequest {
    page: number
}

interface SearchAllMenteeResponse {
    mentees: Mentee[]
}

export class SearchAllMenteeUseCase {
    constructor(
        private menteeRepository: MenteesRepository
    ){}

    async execute({
        page
    }: SearchAllMenteeRequest): Promise<SearchAllMenteeResponse>{
        const mentees = await this.menteeRepository.searchAllMentee(page)

        if(!mentees){
            throw new NotFoundMenteeError()
        }

        return {
            mentees
        }
    }
}
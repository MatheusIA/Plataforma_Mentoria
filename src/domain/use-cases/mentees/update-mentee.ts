import { MenteesRepository } from "@/repositories/mentee-repository"
import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"
import { NotFoundMenteeError } from "../_errors/mentee/not-found-mentee-error"
import { hash } from "bcryptjs"
import { NotFoundUsersError } from "../_errors/users/not-found-users-error"
import { NotPossibleUpdateUserError } from "../_errors/users/not-possible-update-user-error"

interface UpdateMenteeRequest {
    menteeId: number
    name: string
    email: string
    password: string
}

interface UpdateMenteeResponse {
    user: User
}

export class UpdateMenteeUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private menteesRepository: MenteesRepository
    ){}

    async execute({
        menteeId,
        name,
        email,
        password
    }: UpdateMenteeRequest): Promise<UpdateMenteeResponse> {
        const mentee = await this.menteesRepository.findMenteeById(menteeId)

        if(!mentee){
            throw new NotFoundMenteeError()
        }

        const menteeUser = await this.usersRepository.findById(mentee.userId)

        if(!menteeUser){
            throw new NotFoundUsersError()
        }

        const password_hash = await hash(password, 6)

        menteeUser.email = email
        menteeUser.name = name
        menteeUser.password = password_hash

        const updateUser = await this.usersRepository.update(menteeUser)

        if(!updateUser){
            throw new NotPossibleUpdateUserError()
        }

        return {
            user: menteeUser
        }

    }

}
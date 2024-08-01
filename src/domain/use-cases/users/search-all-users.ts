import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"
import { NotFoundUsersError } from "../_errors/users/not-found-users-error"

interface SearchAllUsersUseCaseRequest {
    page: number
}

interface SearchAllUsersUseCaseResponse {
    users: User[]
}

export class SearchAllUsersUseCase {
    constructor(
        private usersRepositpory: UsersRepository
    ){}

    async execute({
        page
    }: SearchAllUsersUseCaseRequest): Promise<SearchAllUsersUseCaseResponse>{
        const users = await this.usersRepositpory.searchAllUsers(page)

        if(!users){
            throw new NotFoundUsersError()
        }

        return {
            users
        }
    }
}
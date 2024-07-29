import { MenteesRepository } from "@/repositories/mentee-repository"
import { MentorsRepository } from "@/repositories/mentor-repository"
import { UsersRepository } from "@/repositories/users-repository"
import { Role, User } from "@prisma/client"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "../_errors/users/user-already-exists-error"

interface RegisterUserRequest {
    name: string
    email: string
    password: string
    role: Role,
    bio?: string,
    skills: string[]
}

interface RegisterUserResponse {
    user: User
}

export class RegisterUserUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private mentorsRepository: MentorsRepository,
        private menteesRepository: MenteesRepository
    ){}

    async execute({
        name,
        email,
        password,
        role,
        bio,
        skills = []
    }: RegisterUserRequest): Promise<RegisterUserResponse> {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if(userWithSameEmail){
            throw new UserAlreadyExistsError()
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password: password_hash,
            role
        })

        if(user.role === Role.MENTEE) {
            await this.menteesRepository.create({
                user: {connect: { id: user.id}}
            })
        }

        if(user.role === Role.MENTOR){
            await this.mentorsRepository.create({
                user: { connect: {id: user.id}},
                bio: bio || '',
                skills: skills || []
            })
        }

        return {
            user
        }
    }
}
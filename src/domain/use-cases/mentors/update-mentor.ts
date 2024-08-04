import { MentorsRepository } from "@/repositories/mentor-repository"
import { UsersRepository } from "@/repositories/users-repository"
import { Mentor, User } from "@prisma/client"
import { NotFoundMentorError } from "../_errors/mentors/not-found-mentor-error"
import { NotFoundUsersError } from "../_errors/users/not-found-users-error"
import { hash } from "bcryptjs"
import { NotPossibleUpdateUserError } from "../_errors/users/not-possible-update-user-error"
import { NotPossibleUpdateMentorError } from "../_errors/mentors/not-possible-update-mentor-error"

interface UpdateMentorRequest {
    mentorId: number
    name: string
    email: string
    password: string
    bio: string
    skills: string[]
}

interface UpdateMentorResponse{
    user: User,
    mentor: Mentor
}

export class UpdateMentorUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private mentorsRepository: MentorsRepository
    ){}

    async execute({
        mentorId,
        name,
        email,
        password,
        bio,
        skills
    }: UpdateMentorRequest): Promise<UpdateMentorResponse> {
        const mentor = await this.mentorsRepository.findMentorById(mentorId)

        if(!mentor){
            throw new NotFoundMentorError()
        }

        const mentorUser = await this.usersRepository.findById(mentor.userId)

        if(!mentorUser) {
            throw new NotFoundUsersError()
        }

        const password_hash = await hash(password, 6)

        mentorUser.email = email
        mentorUser.name = name
        mentorUser.password = password_hash
        mentor.bio = bio
        mentor.skills = skills

        const updatedUser =  await this.usersRepository.update(mentorUser)
        const updatedMentor = await this.mentorsRepository.update(mentor)

        if (!updatedUser) {
            throw new NotPossibleUpdateUserError();
        }

        if (!updatedMentor) {
            throw new NotPossibleUpdateMentorError();
        }

        return {
            user: updatedUser,
            mentor: updatedMentor
        }
    }
}
import { Mentor, Prisma, User } from "@prisma/client";

export interface MentorsRepository {
    create(data: Prisma.MentorCreateInput): Promise<(Mentor & {user: User}) | null>
    update(data: Mentor): Promise<Mentor>
    findMentorById(mentorId: number): Promise<(Mentor & {user: User}) | null>
    findMentorByUserId(userId: number): Promise<Mentor | null >
    searchSkills(): Promise<string[]>
    searchAllMentors(page: number): Promise<Mentor[]>
}
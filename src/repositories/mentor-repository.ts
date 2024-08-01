import { Mentor, Prisma, User } from "@prisma/client";

export interface MentorsRepository {
    create(data: Prisma.MentorCreateInput): Promise<(Mentor & {user: User}) | null>
    findMentorById(mentorId: number): Promise<(Mentor & {user: User}) | null>
    searchSkills(): Promise<string[]>
    searchAllMentors(page: number): Promise<Mentor[]>
}
import { Mentor, Prisma } from "@prisma/client";

export interface MentorsRepository {
    create(data: Prisma.MentorCreateInput): Promise<Mentor>
    searchSkills(): Promise<string[]>
    searchAllMentors(page: number): Promise<Mentor[]>
}
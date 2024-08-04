import { Mentee, Prisma, User } from "@prisma/client";

export interface MenteesRepository {
    create(data: Prisma.MenteeCreateInput): Promise<Mentee>
    findMenteeById(menteeId: number): Promise<(Mentee & {user: User}) | null>
    findMenteeByUserId(userId: number): Promise<Mentee | null>
    searchAllMentee(page: number): Promise<Mentee[]>
}
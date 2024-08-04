import { Mentorship, Prisma, PrismaClient } from "@prisma/client";

export interface MentorshipRepository {
    create(data: Prisma.MentorshipCreateInput): Promise<Mentorship>
    update(id: number, data: Prisma.MentorshipUpdateInput, prismaClient?: Prisma.TransactionClient): Promise<Mentorship | null>
    findById(mentorshipId: number): Promise<Mentorship | null>
    findMentorshipMentorId(mentorId: number): Promise<Mentorship[] | null>
    findMentorshipMenteeId(menteeId: number): Promise<Mentorship[] | null>
    getPrismaTransaction(): Promise<Prisma.TransactionClient>
}
import { Mentorship, Prisma } from "@prisma/client";

export interface MentorshipRepository {
    create(data: Prisma.MentorshipCreateInput): Promise<Mentorship>
    findById(mentorshipId: number): Promise<Mentorship | null>
}
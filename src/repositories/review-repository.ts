import { Prisma, Review } from "@prisma/client";

export interface ReviewRepository {
    create(data: Prisma.ReviewCreateInput): Promise<Review>
    findByMentorshipdId(mentorshipId: number): Promise<Review[]>
}
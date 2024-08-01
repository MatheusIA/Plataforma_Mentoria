import { Prisma, Review } from "@prisma/client";
import { ReviewRepository } from "../review-repository";
import { prisma } from "@/lib/prisma";

export class PrismaReviewRepository implements ReviewRepository {
    async create(data: Prisma.ReviewCreateInput) {
        const review = await prisma.review.create({
            data
        })

        return review
    }

    async findByMentorshipdId(mentorshipId: number) {
        const review = await prisma.review.findMany({
            where: {
                mentorshipId
            }
        })

        return review
    }
    
}
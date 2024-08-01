import { Prisma, Review } from "@prisma/client";
import { ReviewRepository } from "../review-repository";

export class InMemoryReviewRepository implements ReviewRepository {
    public items: Review[] = []

    async create(data: Prisma.ReviewCreateInput) {
        const newId = this.items.length + 1

        const review = {
            id: newId,
            rating: data.rating,
            comment: data.comment ? data.comment : null,
            mentorshipId: data.mentorship.connect?.id ? data.mentorship.connect.id : 1, 
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.items.push(review)

        return review
    }

    async findByMentorshipdId(mentorshipId: number): Promise<Review[]> {
        throw new Error("Method not implemented.");
    }
    
}
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

    async findReviewByMentorId(mentorId: number) {
        const reviews = await prisma.review.findMany({
            where: {
              mentorship: {
                mentorId: mentorId,
              },
            },
            include: {
              mentorship: {
                include: {
                  mentee: {
                    include: {
                      user: {
                        select: {
                          name: true,
                          email: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });
      

          const formattedReviews = reviews.map((review) => ({
            ...review,
            mentorship: {
              ...review.mentorship,
              mentee: {
                ...review.mentorship.mentee,
                user: {
                  name: review.mentorship.mentee.user.name,
                  email: review.mentorship.mentee.user.email,
                },
              },
            },
          }));
      
          return formattedReviews.length > 0 ? formattedReviews : null;
        }
    
}


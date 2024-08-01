import { makeRegisterReviewUseCase } from "@/domain/factories/reviews/make-register-review-use-case";
import { NotFoundMentorshipError } from "@/domain/use-cases/_errors/mentorship/not-found-mentorship-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function registerReviews(request: FastifyRequest, reply: FastifyReply) {
    const registerReviewsSchema = z.object({
        mentorshipId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional()
    })

    try {
        
        const { mentorshipId, rating, comment } = registerReviewsSchema.parse(request.body)

        const registerReviewUseCase = makeRegisterReviewUseCase()

        const { review } = await registerReviewUseCase.execute({
            mentorshipId,
            rating,
            comment
        })

        return reply.status(200).send({
            review
        })

    } catch (err) {
        if(err instanceof NotFoundMentorshipError){
            return reply.status(404).send({ message: err.message})

        } else if (err instanceof z.ZodError) {
            return reply.status(400).send({ message: 'Invalid input data.', errors: err.errors})

        } else {
            console.log(err)
            return reply.status(500).send({message: "Internal server Error."})
        }
    }
}
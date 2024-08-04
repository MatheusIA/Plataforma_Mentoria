import { makeGetReviewByMentorIdUseCase } from "@/domain/factories/reviews/make-get-review-by-mentor-id-use-case";
import { NotFoundReviewError } from "@/domain/use-cases/_errors/review/not-foud-review-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getReviewByMentorId(request: FastifyRequest, reply: FastifyReply){
    const getReviewByMentorIdSchema = z.object({
        mentorId: z.string().transform((mentorId) => parseInt(mentorId, 10))
    })

    const { mentorId } = getReviewByMentorIdSchema.parse(request.params)

    try {
        const getReviewByMentorId = makeGetReviewByMentorIdUseCase()

        const { review } = await getReviewByMentorId.execute({
            mentorId
        })
        
        return reply.send({
            review
        })

    } catch (err) {
        if(err instanceof NotFoundReviewError){
            return reply.status(404).send({ message: err.message})

        } else if (err instanceof z.ZodError){
            return reply.status(400).send({ message: err.message})

        } else {
            console.log(err)
            return reply.status(500).send({ message: "Internal Server Error"})
        }
    }
}
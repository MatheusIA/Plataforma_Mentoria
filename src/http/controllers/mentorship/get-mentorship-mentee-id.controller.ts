import { makeGetMentorshipMenteeId } from "@/domain/factories/mentorship/make-get-mentorship-mentee-id-use-case";
import { NotFoundMentorshipError } from "@/domain/use-cases/_errors/mentorship/not-found-mentorship-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getMentorshipMenteeId(request: FastifyRequest, reply: FastifyReply) {
    const getMentorshipMenteeIdSchema = z.object({
        menteeId: z.string().transform((menteeId) => parseInt(menteeId, 10))
    })

    const { menteeId } = getMentorshipMenteeIdSchema.parse(request.params)

    try {
        const getMentorshipMenteeId = makeGetMentorshipMenteeId()

        const { mentorship } = await getMentorshipMenteeId.execute({
            menteeId
        })

        return reply.send({
            mentorship: mentorship
        })

    } catch (err) {
        if(err instanceof NotFoundMentorshipError){
            return reply.status(404).send({ message: err.message });

        } else if (err instanceof z.ZodError) {
            return reply.status(400).send({ message: err.message });

        } else {
            return reply.status(500).send({ message: "Internal server error" });
        }
    }
}
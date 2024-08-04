import { makeGetMentorshipMentorId } from "@/domain/factories/mentorship/make-get-mentorship-mentor-id-use-case";
import { NotFoundMentorshipError } from "@/domain/use-cases/_errors/mentorship/not-found-mentorship-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getMentorshipMentorId(request: FastifyRequest, reply: FastifyReply) {
    const getMentorshipMentorIdSchema = z.object({
        mentorId: z.string().transform((mentorId) => parseInt(mentorId, 10))
    })

    const { mentorId } = getMentorshipMentorIdSchema.parse(request.params)

    try {

        const getMentorshipMentorId = makeGetMentorshipMentorId()

        const { mentorship } = await getMentorshipMentorId.execute({
            mentorId
        })

        return reply.send({
            mentorship: mentorship
        });        

    } catch (err) {
        if (err instanceof NotFoundMentorshipError) {
            return reply.status(404).send({ message: err.message });

        } else if (err instanceof z.ZodError) {
            return reply.status(400).send({ message: err.message });

        } else {
            return reply.status(500).send({ message: "Internal server error" });
        }
    }
    
}
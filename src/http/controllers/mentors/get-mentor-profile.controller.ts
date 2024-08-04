import { makeGetMentorProfileUseCase } from "@/domain/factories/mentor/make-get-mentor-profile.use-case";
import { NotFoundMentorError } from "@/domain/use-cases/_errors/mentors/not-found-mentor-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getMentorProfile(request: FastifyRequest, reply: FastifyReply) {
    const getMentorProfileSchema = z.object({
        userId: z.string().transform((userId) => parseInt(userId, 10))
    })

    const { userId } = getMentorProfileSchema.parse(request.query)

    try {
        const getMentorProfileUseCase = makeGetMentorProfileUseCase()

        const { mentor } = await getMentorProfileUseCase.execute({
            userId
        })

        return reply.status(200).send({
            mentor
        })

    } catch (err) {
        if(err instanceof NotFoundMentorError){
            return reply.status(404).send({ message: err.message})

        } else if (err instanceof z.ZodError){
            return reply.status(400).send({ message: "Invalid imput data.", errors: err.message})

        } else {
            console.log(err)
            return reply.status(500).send({ message: "Internal server error."})
        }
    }
}
import { makeGetMenteeProfileUseCase } from "@/domain/factories/mentee/make-get-mentee-profile-use-case";
import { NotFoundMenteeError } from "@/domain/use-cases/_errors/mentee/not-found-mentee-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getMenteeProfile(request: FastifyRequest, reply: FastifyReply){
    const getMenteeProfileSchema = z.object({
        userId: z.string().transform((userId) => parseInt(userId, 10))
    })

    const { userId } = getMenteeProfileSchema.parse(request.query)
    
    try {

        const getMenteeProfileUseCase = makeGetMenteeProfileUseCase()

        const { mentee } = await getMenteeProfileUseCase.execute({
            userId
        })

        return reply.status(200).send({
            mentee
        })

    } catch (err){
        if(err instanceof NotFoundMenteeError) {
            return reply.status(404).send({ message: err.message})

        } else if (err instanceof z.ZodError) {
            return reply.status(400).send({ message: "Invalid imput data.", errors: err.message})

        } else {
            console.log(err)
            return reply.status(500).send({ message: "Internal server error."})
        }
    }
}
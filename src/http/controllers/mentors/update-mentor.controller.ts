import { makeUpdateMentorUseCase } from "@/domain/factories/mentor/make-update-mentor-use-case";
import { NotFoundMentorError } from "@/domain/use-cases/_errors/mentors/not-found-mentor-error";
import { NotPossibleUpdateMentorError } from "@/domain/use-cases/_errors/mentors/not-possible-update-mentor-error";
import { NotFoundUsersError } from "@/domain/use-cases/_errors/users/not-found-users-error";
import { NotPossibleUpdateUserError } from "@/domain/use-cases/_errors/users/not-possible-update-user-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function updateMentor(request: FastifyRequest, reply: FastifyReply) {
    const updateMentorParamsSchema = z.object({
        mentorId: z.string().transform((mentorId) => parseInt(mentorId, 10))
    })

    const updateMentorBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        bio: z.string(),
        skills: z.array(z.string())
    })

    const { mentorId } = updateMentorParamsSchema.parse(request.params)
    const { name, email, password, bio, skills } = updateMentorBodySchema.parse(request.body)

    try {

        const updateMentorUseCase = makeUpdateMentorUseCase()

        const { user, mentor } = await updateMentorUseCase.execute({
            mentorId,
            name,
            email,
            password,
            bio,
            skills
        })

        const { password: _, ...userWithoutPassword } = user

        return reply.status(200).send({
            user: userWithoutPassword,
            mentor,
        })

    } catch(err) {
        if(err instanceof NotFoundMentorError){
            return reply.status(404).send({message: err.message})

        } else if (err instanceof NotFoundUsersError) {
            return reply.status(404).send({ message: err.message})

        } else if (err instanceof z.ZodError) {
            return reply.status(400).send({ message: "Invalid Imput Data.", errors: err.message})

        } else if (err instanceof NotPossibleUpdateUserError) {
            return reply.status(500).send({ message: "Internal server error.", errors: err.message})

        } else if (err instanceof NotPossibleUpdateMentorError) {
            return reply.status(500).send({ message: "Internal server error.", errors: err.message})

        } else {
            console.log(err)
            return reply.status(500).send({ message: "Internal server error."})
        }
    }
}
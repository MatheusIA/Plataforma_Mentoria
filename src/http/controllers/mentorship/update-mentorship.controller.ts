import { makeUpdateMentorshipUseCase } from "@/domain/factories/mentorship/make-update-mentorship-use-case";
import { InvalidDateError } from "@/domain/use-cases/_errors/mentorship/invalid-date-error";
import { NotFoundMentorshipError } from "@/domain/use-cases/_errors/mentorship/not-found-mentorship-error";
import { error } from "console";
import { formatInTimeZone } from "date-fns-tz";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function updateMentorship(request: FastifyRequest, reply: FastifyReply) {
    const updateMentorshipParamsSchema = z.object({
        id: z.string().transform((id) => parseInt(id, 10))
    })

    const updateMentorshipBodySchema = z.object({
        mentorId: z.number(),
        menteeId: z.number(),
        topic: z.string(),
        date: z.string(),
        dateGoogle: z.string().refine(value => !isNaN(Date.parse(value)), {
            message: "Invalid date format. Please use ISO 8601 format."
        }),
        googleEventId: z.string()
    })

    try {
        const { id } = updateMentorshipParamsSchema.parse(request.params)
        const { mentorId, menteeId, topic, date, dateGoogle:googleString, googleEventId } = updateMentorshipBodySchema.parse(request.body)

        const timeZone = 'America/Sao_Paulo';
        const formattedDate2 = formatInTimeZone(date, timeZone,"yyyy-MM-dd'T'HH:mm:ssXXX");
        const dateGoogle = new Date(googleString)
        
        const updateMentorshipUseCase = makeUpdateMentorshipUseCase()

        const { mentorship } = await updateMentorshipUseCase.execute({
            id,
            mentorId,
            menteeId,
            topic,
            date: formattedDate2,
            dateGoogle,
            googleEventId
        })

        return reply.status(200).send({
            mentorship
        })

    } catch (err) {
        if(err instanceof NotFoundMentorshipError){
            return reply.status(404).send({ message: err.message})

        } else if(err instanceof InvalidDateError){
            return reply.status(400).send({ message: err.message})

        } else if(err instanceof z.ZodError){
            return reply.status(400).send({ message: 'Invalid imput data', errors: err.message})

        } else {
            console.log(err)
            return reply.status(500).send({ message: 'Internal Server Error'})
        }
    }
}
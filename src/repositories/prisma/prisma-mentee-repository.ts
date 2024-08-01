import { Prisma, Mentee } from "@prisma/client";
import { MenteesRepository } from "../mentee-repository";
import { prisma } from "@/lib/prisma";

export class PrismaMenteeRepository implements MenteesRepository {
    async create(data: Prisma.MenteeCreateInput) {
        const mentee = await prisma.mentee.create({
            data
        })

        return mentee
    }

    async findMenteeById(menteeId: number) {
        console.log("Prisma Parametro: ", menteeId)
        const mentee = await prisma.mentee.findFirst({
            where: {
                userId: menteeId
            },
            include: {
                user: true
            }
        })

        console.log("Mentee Prisma: ", mentee)

        if(!mentee) {
            return null
        }

        return mentee
    }
    
}
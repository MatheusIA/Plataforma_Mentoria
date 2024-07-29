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
    
}
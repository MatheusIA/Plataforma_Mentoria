import { Prisma, Mentorship } from "@prisma/client";
import { MentorshipRepository } from "../mentorship-repository";
import { prisma } from "@/lib/prisma";

export class PrismaMentorShipRepository implements MentorshipRepository{

    async create(data: Prisma.MentorshipCreateInput) {
        const mentorship = await prisma.mentorship.create({
            data
        })

        return mentorship
    }

    async findById(mentorshipId: number) {
        const mentorship = await prisma.mentorship.findUnique({
            where: {
                id: mentorshipId
            }
        })

        if(!mentorship){
            return null
        }

        return mentorship
    }
    
}
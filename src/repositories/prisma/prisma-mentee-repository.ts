import { Prisma, Mentee, User } from "@prisma/client";
import { MenteesRepository } from "../mentee-repository";
import { prisma } from "@/lib/prisma";

export class PrismaMenteeRepository implements MenteesRepository {

    async create(data: Prisma.MenteeCreateInput) {
        const mentee = await prisma.mentee.create({
            data
        })

        return mentee
    }

    async update(userId: number, data: Prisma.MenteeUpdateInput) {
       const mentee = await prisma.mentee.update({
            where: {
                userId: userId
            },
            data: data
       })
    }


    async findMenteeById(menteeId: number) {
        const mentee = await prisma.mentee.findUnique({
            where: {
                id: menteeId
            },
            include: {
                user: true
            }
        })

        if(!mentee) {
            return null
        }

        return mentee
    }

    
    async findMenteeByUserId(userId: number) {
        const mentee = await prisma.mentee.findUnique({
            where: {
                userId: userId
            },
            include: {
                user: true
            }
        })

        if(!mentee) {
            return null
        }

        return mentee
    }

    async searchAllMentee(page: number) {
        const mentees = await prisma.mentee.findMany({
            include: {
                user: true
            },
            skip: (page - 1) * 10,
            take: 10
        })

        const formattedMentees = mentees.map(mentee => ({
            id: mentee.id,
            userId: mentee.userId,
            user: {
                name: mentee.user.name,
                email: mentee.user.email
            }
        }))

        return formattedMentees
    }

    
}
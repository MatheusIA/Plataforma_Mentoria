import { Prisma, Mentorship, PrismaClient } from "@prisma/client";
import { MentorshipRepository } from "../mentorship-repository";
import { prisma } from "@/lib/prisma";

export class PrismaMentorShipRepository implements MentorshipRepository{
    private prisma: PrismaClient;

    constructor(prismaClient?: PrismaClient) {
        this.prisma = prismaClient || new PrismaClient();
    }
    
    async create(data: Prisma.MentorshipCreateInput) {
        const mentorship = await this.prisma.mentorship.create({
            data
        })

        return mentorship
    }

    async findById(mentorshipId: number) {
        const mentorship = await this.prisma.mentorship.findUnique({
            where: {
                id: mentorshipId
            },
            include: {
                mentee: {
                    include: {
                        user: true
                    }
                },
                mentor: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if(!mentorship){
            return null
        }

        return mentorship
    }

    async update(id: number, data: Prisma.MentorshipUpdateInput, prismaClient?: Prisma.TransactionClient): Promise<Mentorship> {

        const mentorship = await prisma.mentorship.update({
            where: {
                id
            },
            data
        });

        return mentorship;
    }

    async findMentorshipMentorId(mentorId: number) {
        const mentorship = await this.prisma.mentorship.findMany({
            where: {
                mentorId: mentorId
            },
            include: {
                mentee: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                mentor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        const formattedMentorship = mentorship.map(m => ({
            id: m.id,
            mentorId: m.mentorId,
            menteeId: m.menteeId,
            topic: m.topic,
            date: new Date(m.date), // Convertendo para o formato ISO string
            googleEventId: m.googleEventId,
            createdAt: new Date(m.createdAt),
            updatedAt: new Date(m.updatedAt),
            mentee: {
                id: m.mentee.id,
                userId: m.mentee.userId,
                user: {
                    name: m.mentee.user.name,
                    email: m.mentee.user.email
                }
            },
            mentor: {
                id: m.mentor.id,
                bio: m.mentor.bio,
                skills: m.mentor.skills,
                userId: m.mentor.userId,
                user: {
                    name: m.mentor.user.name,
                    email: m.mentor.user.email
                }
            }
        }));


        return formattedMentorship
    }
    
    async findMentorshipMenteeId(menteeId: number) {
        const mentorship = await this.prisma.mentorship.findMany({
            where: {
                menteeId: menteeId
            },
            include: {
                mentor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        const formattedMentorship = mentorship.map(m => ({
            id: m.id,
            mentorId: m.mentorId,
            menteeId: m.menteeId,
            topic: m.topic,
            date: new Date(m.date), // Convertendo para o formato ISO string
            googleEventId: m.googleEventId,
            createdAt: new Date(m.createdAt),
            updatedAt: new Date(m.updatedAt),
            mentor: {
                id: m.mentor.id,
                bio: m.mentor.bio,
                skills: m.mentor.skills,
                userId: m.mentor.userId,
                user: {
                    name: m.mentor.user.name,
                    email: m.mentor.user.email
                }
            }
        }));


        return formattedMentorship
    }

    getPrismaTransaction(): Promise<Prisma.TransactionClient> {
        throw new Error("Method not implemented.");
    }

}
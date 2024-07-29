import { Prisma, Mentor } from "@prisma/client";
import { MentorsRepository } from "../mentor-repository";
import { prisma } from "@/lib/prisma";

export class PrismaMentorRepository implements MentorsRepository {
    async create(data: Prisma.MentorCreateInput) {
        const mentor = await prisma.mentor.create({
            data
        })

        return mentor
    }

    async searchSkills() {
        const mentor = await prisma.mentor.findMany({
            select: {
                skills: true
            }
        })

        const skills = [...new Set(mentor.flatMap(mentor => mentor.skills))]

        return skills
    }

    async searchAllMentors(page: number) {
        const mentors = await prisma.mentor.findMany({
            include: {
                user: true
            },
            skip: (page - 1) * 10,
            take: 10,
        })

        const formattedMentors = mentors.map(mentor => ({
           id: mentor.id,
           bio: mentor.bio,
           skills: mentor.skills,
           userId: mentor.userId,
           user: {
            name: mentor.user.name,
            email: mentor.user.email
           } 
        }))

        return formattedMentors
    }
    
}
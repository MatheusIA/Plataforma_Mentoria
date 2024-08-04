import { Prisma, Mentor, User } from "@prisma/client";
import { MentorsRepository } from "../mentor-repository";
import { prisma } from "@/lib/prisma";

export class PrismaMentorRepository implements MentorsRepository {

    // async update(data: Prisma.MentorUpdateInput, dataUser: User): Promise<Mentor> {
    //     data.user?.update.
    // }
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

    async findMentorById(mentorId: number) {
        const mentor = await prisma.mentor.findFirst({
            where: {
                id: mentorId
            },
            include: {
                user: true
            }
        })

        if(!mentor) {
            return null
        }

        return mentor
    }

    async findMentorByUserId(userId: number) {
        const mentor = await prisma.mentor.findUnique({
            where: {
                userId: userId
            },
            include: {
                user: true
            }
        })

        if(!mentor) {
            return null
        }

        return mentor
    }
    

    async update(data: Mentor) {
        // const mentor = await prisma.mentor.update({
        //     where: {
        //         id: data.id
        //     },
        //     data: {
        //         bio: data.bio,
        //         skills: data.skills,
        //         user: {
        //             update: {
        //                 name: dataUser.name,
        //                 email: dataUser.email,
        //                 password: dataUser.password
        //             }
        //         }
        //     },
        //     include: {
        //         user: true
        //     }
        // })

        const mentor = await prisma.mentor.update({
            where: {
                id: data.id
            },
            data: {
                bio: data.bio,
                skills: data.skills
            }
        })

        return mentor
    }
    
}
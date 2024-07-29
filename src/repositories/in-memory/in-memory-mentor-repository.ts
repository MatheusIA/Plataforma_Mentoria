import { Mentor, Prisma } from "@prisma/client";
import { MentorsRepository } from "../mentor-repository";

export class InMemoryMentorRepository implements MentorsRepository {
    public items: Mentor[] = []

    async create(data: Prisma.MentorCreateInput) {
        const newId = this.items.length + 1

        const mentor = {
            id: newId,
            bio: data.bio,
            skills: data.skills as string[],
            userId: data.user.connect?.id ? data.user.connect?.id : 1
        }

        this.items.push(mentor)

        return mentor
    }

    async searchSkills() {
        const skills = new Set<string>()
        
        this.items.forEach(mentor => {
            mentor.skills.forEach(skill => {
                skills.add(skill)
            })
        })

        return Array.from(skills)
    }
    
    async searchAllMentors(page: number) {
        return this.items.slice((page - 1) * 20, page * 20)
    }
}
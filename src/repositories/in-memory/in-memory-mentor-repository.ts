import { Mentor, Prisma, Role, User } from "@prisma/client";
import { MentorsRepository } from "../mentor-repository";

export class InMemoryMentorRepository implements MentorsRepository {
    public items: (Mentor & { user: User })[] = [];
    private userIdCounter = 1;

    async create(data: Prisma.MentorCreateInput) {
        const newId = this.items.length + 1

        const user = {
            id: newId,
            name: `Jonh Doe ${newId}`,
            email: `jonhDoe${newId}@example.com`,
            password: "123456",
            role: Role.MENTOR,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const mentor = {
            id: this.items.length + 1,
            bio: data.bio,
            skills: data.skills as string[],
            userId: user.id,
            user: user,
          };

        this.items.push(mentor)

        return mentor
    }

    async update(data: Mentor) {
        const mentorIndex = this.items.findIndex((item) => item.id === data.id)

        if(mentorIndex >= 0) {
            this.items[mentorIndex].bio = data.bio,
            this.items[mentorIndex].skills = data.skills
        }

        return data
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

    async findMentorById(mentorId: number) {
        const mentor = this.items.find(item => item.id === mentorId)

        if(!mentor){
            return null
        }

        return mentor
    }

    async findMentorByUserId(userId: number) {
        const mentor = this.items.find(item => item.id === userId)

        if(!mentor){
            return null
        }

        return mentor
    }
}
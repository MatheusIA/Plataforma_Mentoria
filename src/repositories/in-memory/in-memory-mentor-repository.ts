import { Mentor, Prisma, Role, User } from "@prisma/client";
import { MentorsRepository } from "../mentor-repository";

export class InMemoryMentorRepository implements MentorsRepository {
    public items: (Mentor & { user: User })[] = [];
    private userIdCounter = 1;

    async create(data: Prisma.MentorCreateInput) {
        const newId = this.items.length + 1

        const user = {
            id: this.userIdCounter++,
            name: "Jonh Doe",
            email: "jonhDoe@example.com",
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
}
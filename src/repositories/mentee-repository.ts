import { Mentee, Prisma } from "@prisma/client";

export interface MenteesRepository {
    create(data: Prisma.MenteeCreateInput): Promise<Mentee>
}
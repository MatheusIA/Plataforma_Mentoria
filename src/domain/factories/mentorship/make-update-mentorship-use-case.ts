import { UpdateMentorshipUseCase } from "@/domain/use-cases/mentorship/update-mentorship";
import { PrismaMentorShipRepository } from "@/repositories/prisma/prisma-mentorship-repository";
import { PrismaClient } from "@prisma/client";

export function makeUpdateMentorshipUseCase() {
    const prisma = new PrismaClient()
    const mentorShipRepository = new PrismaMentorShipRepository()
    const useCase = new UpdateMentorshipUseCase(
        mentorShipRepository,
        prisma
    )

    return useCase
}
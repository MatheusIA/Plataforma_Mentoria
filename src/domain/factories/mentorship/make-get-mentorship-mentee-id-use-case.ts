import { GetMentorshipMenteeIdUseCase } from "@/domain/use-cases/mentorship/get-mentorship-mentee-id";
import { PrismaMentorShipRepository } from "@/repositories/prisma/prisma-mentorship-repository";

export function makeGetMentorshipMenteeId(){
    const mentorshipRepository = new PrismaMentorShipRepository()
    const useCase = new GetMentorshipMenteeIdUseCase(
        mentorshipRepository
    )

    return useCase
}
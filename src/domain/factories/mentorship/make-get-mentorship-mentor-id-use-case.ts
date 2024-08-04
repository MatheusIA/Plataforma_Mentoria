import { GetMentorshipMentorIdUseCase } from "@/domain/use-cases/mentorship/get-mentorship-mentor-id";
import { PrismaMentorShipRepository } from "@/repositories/prisma/prisma-mentorship-repository";

export function makeGetMentorshipMentorId(){
    const mentorshipRepository = new PrismaMentorShipRepository() 
    const useCase = new GetMentorshipMentorIdUseCase(
        mentorshipRepository
    )

    return useCase
}
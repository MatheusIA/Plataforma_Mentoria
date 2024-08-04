import request from "supertest"
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Get review by mentor id (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to get all reviews by mentor id", async () => {
        const { token } = await createAndAuthenticateUser(app)

        const userMentor = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoe1@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in NodeJS and JavaScript",
            skills: ["NodeJS", "JavaScript"]
        })

        const userMentee1 = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoementee1@example.com",
            password: "123456",
            role: "MENTEE",
            bio: "",
            skills: []
        })

        const userMentee2 = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoementee2@example.com",
            password: "123456",
            role: "MENTEE",
            bio: "",
            skills: []
        })

        const findMentee1 = await request(app.server)
        .get('/mentee/profile/')
        .query({ userId: userMentee1.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        const findMentee2 = await request(app.server)
        .get('/mentee/profile/')
        .query({ userId: userMentee2.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        const findMentor = await request(app.server)
        .get('/mentor/profile/')
        .query({ userId: userMentor.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        const mentorship1 = await prisma.mentorship.create({
            data: {
                date: new Date(),
                topic: "Aprender NodeJS e JavaScript",
                menteeId: findMentee1.body.mentee.id,
                mentorId: findMentor.body.mentor.id
            }
        })

        const mentorship2 = await prisma.mentorship.create({
            data: {
                date: new Date(),
                topic: "Aprender NodeJS e JavaScript",
                menteeId: findMentee2.body.mentee.id,
                mentorId: findMentor.body.mentor.id
            }
        })

        await request(app.server)
        .post('/register/review')
        .set("Authorization", `Bearer ${token}`)
        .send({
            mentorshipId: mentorship1.id,
            rating: 5,
            comment: 'Excellent mentorship'
        })

        await request(app.server)
        .post('/register/review')
        .set("Authorization", `Bearer ${token}`)
        .send({
            mentorshipId: mentorship2.id,
            rating: 4,
            comment: 'Good mentorship'
        })

        const response = await request(app.server)
        .get(`/review/by/mentorId/${findMentor.body.mentor.id}`)
        .set("Authorization", `Bearer ${token}`)

        console.log("Response Error: ", response.error)
        console.log("Response Body: ", response.body)

        expect(response.status).toBe(200)

    })
})
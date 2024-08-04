import request from "supertest"
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { addDays, addHours, formatISO } from "date-fns";

describe("Update mentorship (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able update mentorship", async () => {
        const { token } = await createAndAuthenticateUser(app)

        const now = new Date()
        const date = addHours(now, 1)

        const startIso = formatISO(date);
        
        const userMentee = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe Mentee",
            email: "jonhdoementee@example.com",
            password: "123456",
            role: "MENTEE",
            bio: "",
            skills: []
        })

        const userMentor = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe Mentor",
            email: "jonhdoementor@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentoring in JavaScript and NodeJS",
            skills: ["JavaScript", "NodeJS"],
        })

        const findMentee = await request(app.server)
        .get('/mentee/profile/')
        .query({ userId: userMentee.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        const findMentor = await request(app.server)
        .get('/mentor/profile/')
        .query({ userId: userMentor.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        const createMentorship = await request(app.server)
        .post('/register/mentorship')
        .set("Authorization", `Bearer ${token}`)
        .send({
            mentorId: findMentor.body.mentor.id,
            menteeId: findMentee.body.mentee.id,
            topic: "Aprender NodeJS e JavaScript",
            date: startIso,
            dateGoogle: startIso
        })

        const response = await request(app.server)
        .put(`/update/mentorship/${createMentorship.body.mentorship.id}`)
        .send({
            mentorId: findMentor.body.mentor.id,
            menteeId: findMentee.body.mentee.id,
            topic: "Aprender NodeJS e JavaScript",
            date: addDays(startIso,1),
            dateGoogle: addDays(startIso,1),
            googleEventId: createMentorship.body.mentorship.googleEventId
        })

        expect(response.status).toBe(200)

    })
})
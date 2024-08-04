import request from "supertest"
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { toZonedTime } from "date-fns-tz";
import { formatISO, addHours, addDays } from "date-fns";

describe.skip("Get mentorship by mentor id (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
        
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to get mentorship by mentor id", async () => {
        const { token } = await createAndAuthenticateUser(app)
        const now = new Date()
        const test = addHours(now, 1)
        const startIso = formatISO(test);

        const user2 = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 2",
            email: "jonhdoementee1@example.com",
            password: "123456",
            role: "MENTEE",
            bio: "",
            skills: []
        })

        const user3 = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 3",
            email: "jonhdoementee2@example.com",
            password: "123456",
            role: "MENTEE",
            bio: "",
            skills: []
        })

        const user4 = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 3",
            email: "jonhdoementor@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in NodeJS and JavaScript",
            skills: ["NodeJS", "JavaScript"]
        })

        const findMentee1 = await request(app.server)
        .get('/mentee/profile/')
        .query({ userId: user2.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        const findMentee2 = await request(app.server)
        .get('/mentee/profile/')
        .query({ userId: user3.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        const findMentor = await request(app.server)
        .get('/mentor/profile/')
        .query({ userId: user4.body.user.id})
        .set("Authorization", `Bearer ${token}`)

        await request(app.server)
        .post('/register/mentorship')
        .set("Authorization", `Bearer ${token}`)
        .send({
            mentorId: findMentor.body.mentor.id,
            menteeId: findMentee1.body.mentee.id,
            topic: "Aprender NodeJS e JavaScript",
            date: startIso,
            dateGoogle: startIso
        })
    
        await request(app.server)
        .post('/register/mentorship')
        .set("Authorization", `Bearer ${token}`)
        .send({
            mentorId: findMentor.body.mentor.id,
            menteeId: findMentee2.body.mentee.id,
            topic: "Aprender NodeJS e JavaScript",
            date: addDays(startIso,2),
            dateGoogle: addDays(startIso,2)
        })        


        const response = await request(app.server)
        .get(`/get/mentorship/mentorId/${findMentor.body.mentor.id}`)
        .set("Authorization", `Bearer ${token}`)
            
        expect(response.status).toBe(200)
    })
} )
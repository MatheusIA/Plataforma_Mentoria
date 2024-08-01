import request from "supertest"
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { addDays, format } from 'date-fns'
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz'

describe('Registe Review (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to register a review", async () => {
        const { token } = await createAndAuthenticateUser(app)

        const mentor = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoe@mentor.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in NodeJS and JavaScript",
            skills: ["NodeJS", "JavaScript"]
        })

        console.log("Mentor Test: ", mentor.body)

        const mentee = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoe@mentee.com",
            password: "123456",
            role: "MENTEE",
        })

        const timeZone = 'America/Sao_Paulo';
        const date = new Date();
        const zonedDate = toZonedTime(date, timeZone);

        const tomorrow = addDays(new Date(),1)
        const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ssX");
        const formattedDate2 = formatInTimeZone(date, timeZone,"yyyy-MM-dd'T'HH:mm:ssXXX");

        console.log(tomorrow)
        console.log('1', formattedDate)
        console.log('2', formattedDate2)

        const mentorship = await request(app.server)
        .post('/register/mentorship')
        .set("Authorization", `Bearer ${token}`)
        .send({
            mentorId: mentor.body.user.id,
            menteeId: mentee.body.user.id,
            topic: "Learn TypeScript",
            date: formattedDate,
            dateGoogle: formattedDate2
        })

        console.log("Mentorship", mentorship.body)

        const response = await request(app.server)
        .post('/register/review')
        .set("Authorization", `Bearer ${token}`)
        .send({
            mentorshipId: mentorship.body.mentorship.id,
            rating: 5,
            comment: 'Excellent mentorship'
        })

        expect(response.status).toBe(200)
        expect(response.body.review).toEqual(expect.objectContaining({
            id: 1,
            rating: 5,
            comment: 'Excellent mentorship'
        }))
    })
})